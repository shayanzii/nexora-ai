import { LLMError, LLMProviderNotFoundError } from "../errors/llm-errors";
import type { LLMProvider } from "../providers/base-provider";
import {
  getProviderRegistry,
  type ProviderRegistry,
} from "../providers/provider-registry";
import type { LLMRequest } from "../types/llm-request";
import type {
  LLMHealthCheckResult,
  LLMResponse,
  LLMStreamChunk,
  TokenUsage,
} from "../types/llm-response";
import {
  resolveGatewayConfig,
  type GatewayConfig,
} from "./gateway-config";
import { propagateGatewayError } from "./GatewayErrors";
import {
  normalizeGatewayRequest,
  validateGatewayRequest,
} from "./RequestNormalizer";
import {
  normalizeGatewayResponse,
  normalizeGatewayStreamChunk,
} from "./ResponseNormalizer";
import {
  resolveRoutingStrategy,
  type RoutingDecision,
  type RoutingStrategy,
} from "./RoutingStrategy";

export type { GatewayConfig } from "./gateway-config";
export { DEFAULT_GATEWAY_CONFIG, resolveGatewayConfig } from "./gateway-config";

export interface GatewayLogEvent {
  level: "info" | "error";
  operation: "generate" | "stream" | "healthCheck";
  provider: string;
  model: string;
  latencyMs: number;
  retries: number;
  usage?: TokenUsage;
  requestId?: string;
  error?: string;
}

export type GatewayLogger = (event: GatewayLogEvent) => void;

export interface LLMGatewayOptions {
  config?: Partial<GatewayConfig>;
  registry?: ProviderRegistry;
  routingStrategy?: RoutingStrategy;
  logger?: GatewayLogger;
}

function defaultLogger(event: GatewayLogEvent): void {
  const payload = {
    ...event,
    timestamp: new Date().toISOString(),
  };

  if (event.level === "error") {
    console.error("[llm:gateway]", JSON.stringify(payload));
    return;
  }

  console.info("[llm:gateway]", JSON.stringify(payload));
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Provider-agnostic LLM gateway — the single entry point for Brain AI requests.
 * Agents should use this instead of accessing the provider registry directly.
 */
export class LLMGateway {
  readonly config: GatewayConfig;
  private readonly registry: ProviderRegistry;
  private readonly routingStrategy: RoutingStrategy;
  private readonly logger: GatewayLogger;

  constructor(options: LLMGatewayOptions = {}) {
    this.config = resolveGatewayConfig(options.config);
    this.registry = options.registry ?? getProviderRegistry();
    this.routingStrategy = resolveRoutingStrategy(options.routingStrategy);
    this.logger = options.logger ?? defaultLogger;
  }

  /** Performs a validated, routed, non-streaming LLM completion. */
  async generate(request: LLMRequest): Promise<LLMResponse> {
    const prepared = this.prepareRequest(request);
    const routing = this.route(prepared);
    const provider = this.resolveProvider(routing.providerId);
    const dispatched = this.buildProviderRequest(prepared, routing);

    const startedAt = Date.now();
    let retries = 0;

    try {
      const response = await this.executeWithRetry(
        () => provider.generate(dispatched),
        routing,
        prepared.id,
        () => {
          retries += 1;
        },
      );

      const latencyMs = Date.now() - startedAt;
      const normalized = normalizeGatewayResponse(response, {
        routing,
        latencyMs,
        retries,
        requestId: prepared.id,
      });

      this.logger({
        level: "info",
        operation: "generate",
        provider: routing.providerId,
        model: routing.modelId,
        latencyMs,
        retries,
        usage: normalized.usage,
        requestId: prepared.id,
      });

      return normalized;
    } catch (error) {
      this.logError(error, "generate", routing, prepared.id, Date.now() - startedAt, retries);
      throw propagateGatewayError(error, {
        requestId: prepared.id,
        providerId: routing.providerId,
        modelId: routing.modelId,
      });
    }
  }

  /** Performs a validated, routed, streaming LLM completion. */
  async *stream(request: LLMRequest): AsyncIterable<LLMStreamChunk> {
    const prepared = this.prepareRequest({
      ...request,
      options: { ...request.options, stream: true },
    });
    const routing = this.route(prepared);
    const provider = this.resolveProvider(routing.providerId);
    const dispatched = this.buildProviderRequest(prepared, routing);

    const startedAt = Date.now();
    let retries = 0;
    let lastUsage: TokenUsage | undefined;

    try {
      for await (const chunk of this.streamWithRetry(
        provider,
        dispatched,
        routing,
        prepared.id,
        () => {
          retries += 1;
        },
      )) {
        const normalized = normalizeGatewayStreamChunk(chunk);
        if (normalized.usage) {
          lastUsage = normalized.usage;
        }
        yield normalized;
      }

      const latencyMs = Date.now() - startedAt;
      this.logger({
        level: "info",
        operation: "stream",
        provider: routing.providerId,
        model: routing.modelId,
        latencyMs,
        retries,
        usage: lastUsage,
        requestId: prepared.id,
      });
    } catch (error) {
      this.logError(error, "stream", routing, prepared.id, Date.now() - startedAt, retries);
      throw propagateGatewayError(error, {
        requestId: prepared.id,
        providerId: routing.providerId,
        modelId: routing.modelId,
      });
    }
  }

  /** Checks health of the routed provider (OpenAI by default). */
  async healthCheck(): Promise<LLMHealthCheckResult> {
    const routing = this.route({
      model: this.config.defaultModel,
      messages: [{ role: "user", content: "health-check" }],
    });
    const provider = this.resolveProvider(routing.providerId);
    const startedAt = Date.now();

    try {
      const result = await provider.healthCheck();
      const latencyMs = Date.now() - startedAt;

      this.logger({
        level: result.healthy ? "info" : "error",
        operation: "healthCheck",
        provider: routing.providerId,
        model: routing.modelId,
        latencyMs,
        retries: 0,
        error: result.healthy ? undefined : result.message,
      });

      return result;
    } catch (error) {
      const latencyMs = Date.now() - startedAt;
      this.logError(error, "healthCheck", routing, undefined, latencyMs, 0);
      throw propagateGatewayError(error, {
        providerId: routing.providerId,
        modelId: routing.modelId,
      });
    }
  }

  private prepareRequest(request: LLMRequest): LLMRequest {
    validateGatewayRequest(request);
    const normalized = normalizeGatewayRequest(request, this.config);
    validateGatewayRequest(normalized);
    return normalized;
  }

  private route(request: LLMRequest): RoutingDecision {
    return this.routingStrategy.resolve(
      { request, config: this.config },
      this.registry,
    );
  }

  private resolveProvider(providerId: string): LLMProvider {
    const provider = this.registry.resolve(providerId);
    if (!provider) {
      throw new LLMProviderNotFoundError(providerId);
    }
    return provider;
  }

  private buildProviderRequest(
    request: LLMRequest,
    routing: RoutingDecision,
  ): LLMRequest {
    return {
      ...request,
      provider: routing.providerId,
      model: routing.modelId,
    };
  }

  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    routing: RoutingDecision,
    requestId: string | undefined,
    onRetry: () => void,
  ): Promise<T> {
    let lastError: unknown;

    for (let attempt = 0; attempt <= this.config.maxRetries; attempt += 1) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        if (!this.shouldRetry(error) || attempt >= this.config.maxRetries) {
          throw error;
        }
        onRetry();
        await sleep(this.retryDelayMs(attempt));
      }
    }

    throw propagateGatewayError(lastError, {
      requestId,
      providerId: routing.providerId,
      modelId: routing.modelId,
    });
  }

  private async *streamWithRetry(
    provider: LLMProvider,
    request: LLMRequest,
    routing: RoutingDecision,
    requestId: string | undefined,
    onRetry: () => void,
  ): AsyncIterable<LLMStreamChunk> {
    let lastError: unknown;

    for (let attempt = 0; attempt <= this.config.maxRetries; attempt += 1) {
      try {
        yield* provider.stream(request);
        return;
      } catch (error) {
        lastError = error;
        if (!this.shouldRetry(error) || attempt >= this.config.maxRetries) {
          throw error;
        }
        onRetry();
        await sleep(this.retryDelayMs(attempt));
      }
    }

    throw propagateGatewayError(lastError, {
      requestId,
      providerId: routing.providerId,
      modelId: routing.modelId,
    });
  }

  private shouldRetry(error: unknown): boolean {
    return error instanceof LLMError && error.retryable;
  }

  private retryDelayMs(attempt: number): number {
    return Math.min(1_000 * 2 ** attempt, 8_000);
  }

  private logError(
    error: unknown,
    operation: GatewayLogEvent["operation"],
    routing: RoutingDecision,
    requestId: string | undefined,
    latencyMs: number,
    retries: number,
  ): void {
    const message =
      error instanceof Error ? error.message : "Unknown gateway error";

    this.logger({
      level: "error",
      operation,
      provider: routing.providerId,
      model: routing.modelId,
      latencyMs,
      retries,
      requestId,
      error: message,
    });
  }
}

let defaultGateway: LLMGateway | undefined;

/** Returns the process-wide default LLM gateway instance. */
export function getLLMGateway(options?: LLMGatewayOptions): LLMGateway {
  if (!defaultGateway) {
    defaultGateway = new LLMGateway(options);
  }
  return defaultGateway;
}

/** Resets the process-wide default gateway. Intended for tests. */
export function resetLLMGateway(): void {
  defaultGateway = undefined;
}

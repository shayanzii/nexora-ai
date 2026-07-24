import OpenAI from "openai";
import type {
  ChatCompletion,
  ChatCompletionChunk,
  ChatCompletionCreateParams,
} from "openai/resources/chat/completions";

import { LLMError, LLMModelNotSupportedError } from "../../errors/llm-errors";
import type { LLMProvider } from "../base-provider";
import type { LLMRequest } from "../../types/llm-request";
import type {
  LLMHealthCheckResult,
  LLMResponse,
  LLMStreamChunk,
  TokenUsage,
} from "../../types/llm-response";
import type { ModelCapability } from "../../types/model";
import { getProviderRegistry } from "../provider-registry";
import {
  mapLLMRequestToOpenAI,
  mapOpenAIChunkToLLMStreamChunk,
  mapOpenAIResponseToLLM,
} from "./OpenAIMapper";
import {
  configurationError,
  mapOpenAIError,
  type OpenAIErrorContext,
} from "./OpenAIErrors";
import {
  OPENAI_DEFAULT_MODEL,
  OPENAI_MODELS,
  OPENAI_PROVIDER_ID,
  isSupportedOpenAIModel,
  normalizeOpenAIModelId,
  resolveOpenAIModel,
} from "./OpenAIModels";

const DEFAULT_TIMEOUT_MS = 30_000;

export interface OpenAILogEvent {
  level: "info" | "error";
  provider: string;
  operation: "generate" | "stream" | "healthCheck";
  model?: string;
  latencyMs?: number;
  usage?: TokenUsage;
  error?: string;
  requestId?: string;
}

export type OpenAILogger = (event: OpenAILogEvent) => void;

export interface OpenAIClientLike {
  chat: {
    completions: {
      create(
        body: ChatCompletionCreateParams,
        options?: { timeout?: number; signal?: AbortSignal },
      ): Promise<ChatCompletion | AsyncIterable<ChatCompletionChunk>>;
    };
  };
  models: {
    list(options?: { timeout?: number }): Promise<{ data: Array<{ id: string }> }>;
  };
}

export interface OpenAIProviderOptions {
  apiKey?: string;
  client?: OpenAIClientLike;
  timeoutMs?: number;
  logger?: OpenAILogger;
}

function defaultLogger(event: OpenAILogEvent): void {
  const payload = {
    ...event,
    timestamp: new Date().toISOString(),
  };

  if (event.level === "error") {
    console.error("[llm:openai]", JSON.stringify(payload));
    return;
  }

  console.info("[llm:openai]", JSON.stringify(payload));
}

function resolveApiKey(explicitKey?: string): string | undefined {
  return explicitKey?.trim() || process.env.OPENAI_API_KEY?.trim() || undefined;
}

function createDefaultClient(apiKey: string): OpenAIClientLike {
  const client = new OpenAI({ apiKey });
  return client as unknown as OpenAIClientLike;
}

/** Production OpenAI provider implementing the canonical LLMProvider contract. */
export class OpenAIProvider implements LLMProvider {
  readonly id = OPENAI_PROVIDER_ID;
  readonly name = "OpenAI";
  readonly models = OPENAI_MODELS;

  private readonly client: OpenAIClientLike | null;
  private readonly timeoutMs: number;
  private readonly logger: OpenAILogger;
  readonly configured: boolean;

  constructor(options: OpenAIProviderOptions = {}) {
    const apiKey = resolveApiKey(options.apiKey);
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.logger = options.logger ?? defaultLogger;
    this.client = options.client ?? (apiKey ? createDefaultClient(apiKey) : null);
    this.configured = this.client != null;
  }

  supports(capability: ModelCapability, modelId?: string): boolean {
    if (modelId) {
      const model = resolveOpenAIModel(modelId);
      return model?.capabilities.includes(capability) ?? false;
    }

    return OPENAI_MODELS.some((model) => model.capabilities.includes(capability));
  }

  async healthCheck(): Promise<LLMHealthCheckResult> {
    const checkedAt = new Date().toISOString();
    const context: OpenAIErrorContext = { operation: "healthCheck" };

    if (!this.client) {
      return {
        provider: this.id,
        healthy: false,
        message: "OPENAI_API_KEY is not configured.",
        checkedAt,
      };
    }

    const startedAt = Date.now();

    try {
      await this.client.models.list({ timeout: this.timeoutMs });
      const latencyMs = Date.now() - startedAt;

      this.logger({
        level: "info",
        provider: this.id,
        operation: "healthCheck",
        latencyMs,
      });

      return {
        provider: this.id,
        healthy: true,
        latencyMs,
        checkedAt,
      };
    } catch (error) {
      const latencyMs = Date.now() - startedAt;
      const mapped = mapOpenAIError(error, context);

      this.logger({
        level: "error",
        provider: this.id,
        operation: "healthCheck",
        latencyMs,
        error: mapped.message,
      });

      return {
        provider: this.id,
        healthy: false,
        latencyMs,
        message: mapped.message,
        checkedAt,
      };
    }
  }

  async generate(request: LLMRequest): Promise<LLMResponse> {
    this.assertConfigured({ operation: "generate", request });
    const normalizedModel = this.validateRequest(request);
    const context: OpenAIErrorContext = {
      operation: "generate",
      modelId: normalizedModel,
      requestId: request.id,
    };

    const startedAt = Date.now();

    try {
      const params = mapLLMRequestToOpenAI(
        { ...request, model: normalizedModel },
        false,
      );
      const completion = (await this.client!.chat.completions.create(params, {
        timeout: this.timeoutMs,
      })) as ChatCompletion;

      const response = mapOpenAIResponseToLLM(completion, request);
      const latencyMs = Date.now() - startedAt;

      this.logger({
        level: "info",
        provider: this.id,
        operation: "generate",
        model: response.model,
        latencyMs,
        usage: response.usage,
        requestId: request.id,
      });

      return response;
    } catch (error) {
      const mapped = this.handleOperationError(error, context, startedAt);
      throw mapped;
    }
  }

  async *stream(request: LLMRequest): AsyncIterable<LLMStreamChunk> {
    this.assertConfigured({ operation: "stream", request });
    const normalizedModel = this.validateRequest(request);
    const context: OpenAIErrorContext = {
      operation: "stream",
      modelId: normalizedModel,
      requestId: request.id,
    };

    const startedAt = Date.now();
    let lastUsage: TokenUsage | undefined;

    try {
      const params = mapLLMRequestToOpenAI(
        { ...request, model: normalizedModel },
        true,
      );
      const stream = (await this.client!.chat.completions.create(params, {
        timeout: this.timeoutMs,
      })) as AsyncIterable<ChatCompletionChunk>;

      const fallbackId = request.id ?? `openai-stream-${startedAt}`;

      for await (const chunk of stream) {
        const mapped = mapOpenAIChunkToLLMStreamChunk(chunk, fallbackId);
        if (mapped.usage) {
          lastUsage = mapped.usage;
        }
        yield mapped;
      }

      this.logger({
        level: "info",
        provider: this.id,
        operation: "stream",
        model: normalizedModel,
        latencyMs: Date.now() - startedAt,
        usage: lastUsage,
        requestId: request.id,
      });
    } catch (error) {
      const mapped = this.handleOperationError(error, context, startedAt);
      throw mapped;
    }
  }

  private assertConfigured(context: {
    operation: OpenAIErrorContext["operation"];
    request?: LLMRequest;
  }): void {
    if (this.client) {
      return;
    }

    throw configurationError("OPENAI_API_KEY is not configured.", {
      operation: context.operation,
      modelId: context.request?.model,
      requestId: context.request?.id,
    });
  }

  private validateRequest(request: LLMRequest): string {
    if (!request.messages.length) {
      throw new LLMError("LLM request must include at least one message.", {
        code: "VALIDATION_ERROR",
        providerId: this.id,
        modelId: request.model,
        requestId: request.id,
        retryable: false,
      });
    }

    const normalizedModel = normalizeOpenAIModelId(request.model);
    if (!isSupportedOpenAIModel(normalizedModel)) {
      throw new LLMModelNotSupportedError(this.id, request.model);
    }

    return normalizedModel;
  }

  private handleOperationError(
    error: unknown,
    context: OpenAIErrorContext,
    startedAt: number,
  ): LLMError {
    const mapped = mapOpenAIError(error, context);

    this.logger({
      level: "error",
      provider: this.id,
      operation: context.operation,
      model: context.modelId,
      latencyMs: Date.now() - startedAt,
      error: mapped.message,
      requestId: context.requestId,
    });

    return mapped;
  }
}

/** Creates an OpenAI provider instance. */
export function createOpenAIProvider(
  options: OpenAIProviderOptions = {},
): OpenAIProvider {
  return new OpenAIProvider(options);
}

/** Registers the OpenAI provider with the global provider registry. */
export function registerOpenAIProvider(
  options: OpenAIProviderOptions = {},
): OpenAIProvider {
  const provider = createOpenAIProvider(options);
  getProviderRegistry().register({
    provider,
    priority: 100,
    tags: ["cloud", "openai"],
  });
  return provider;
}

export { OPENAI_DEFAULT_MODEL };

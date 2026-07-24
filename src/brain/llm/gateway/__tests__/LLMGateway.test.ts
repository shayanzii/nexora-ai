/**
 * LLM Gateway tests — mocked providers only, no real API calls.
 */
import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";

import OpenAI from "openai";

import { LLMError } from "../../errors/llm-errors";
import type { LLMProvider } from "../../providers/base-provider";
import {
  ProviderRegistry,
  resetProviderRegistry,
} from "../../providers/provider-registry";
import type { LLMRequest } from "../../types/llm-request";
import type {
  LLMHealthCheckResult,
  LLMResponse,
  LLMStreamChunk,
} from "../../types/llm-response";
import type { ModelCapability, ModelDefinition } from "../../types/model";
import {
  GatewayRoutingError,
  GatewayValidationError,
} from "../GatewayErrors";
import {
  getLLMGateway,
  LLMGateway,
  resetLLMGateway,
  type GatewayLogEvent,
} from "../LLMGateway";
import { selectProviderAndModel } from "../ModelSelector";
import { DefaultRoutingStrategy } from "../RoutingStrategy";
import { validateGatewayRequest } from "../RequestNormalizer";
import { resolveGatewayConfig } from "../gateway-config";

function createMockProvider(
  id: string,
  handlers?: {
    generate?: () => Promise<LLMResponse>;
    stream?: () => AsyncIterable<LLMStreamChunk>;
    healthCheck?: () => Promise<LLMHealthCheckResult>;
  },
): LLMProvider {
  const models: ModelDefinition[] = [
    {
      id: "gpt-5-mini",
      providerId: id,
      displayName: "Mock Model",
      capabilities: ["chat-completion", "streaming"],
    },
  ];

  return {
    id,
    name: "Mock Provider",
    models,
    supports(capability: ModelCapability) {
      return capability === "chat-completion" || capability === "streaming";
    },
    healthCheck:
      handlers?.healthCheck ??
      (async () => ({
        provider: id,
        healthy: true,
        checkedAt: new Date().toISOString(),
      })),
    generate:
      handlers?.generate ??
      (async (request) => ({
        id: "mock-response",
        provider: id,
        model: request.model,
        content: "Gateway response",
        finishReason: "stop",
        usage: { promptTokens: 4, completionTokens: 6, totalTokens: 10 },
      })),
    stream:
      handlers?.stream ??
      (async function* () {
        yield { id: "mock-stream", delta: "Hello", done: false };
        yield {
          id: "mock-stream",
          delta: "",
          done: true,
          finishReason: "stop",
          usage: { promptTokens: 2, completionTokens: 2, totalTokens: 4 },
        };
      }),
  };
}

const baseRequest: LLMRequest = {
  id: "gw-req-1",
  model: "gpt-5-mini",
  messages: [{ role: "user", content: "Hello gateway" }],
  options: { temperature: 0.5, maxTokens: 256 },
};

describe("Gateway request validation", () => {
  it("rejects empty messages", () => {
    assert.throws(
      () => validateGatewayRequest({ model: "gpt-5-mini", messages: [] }),
      GatewayValidationError,
    );
  });

  it("rejects invalid temperature and maxTokens", () => {
    assert.throws(
      () =>
        validateGatewayRequest({
          ...baseRequest,
          options: { temperature: 3 },
        }),
      GatewayValidationError,
    );

    assert.throws(
      () =>
        validateGatewayRequest({
          ...baseRequest,
          options: { maxTokens: 0 },
        }),
      GatewayValidationError,
    );
  });

  it("rejects non-boolean stream flag", () => {
    assert.throws(
      () =>
        validateGatewayRequest({
          ...baseRequest,
          options: { stream: "yes" as unknown as boolean },
        }),
      GatewayValidationError,
    );
  });
});

describe("Model selection", () => {
  it("uses request provider and model when provided", () => {
    const config = resolveGatewayConfig({
      defaultProvider: "openai",
      defaultModel: "gpt-5",
      preferredProvider: "anthropic",
      preferredModel: "gpt-4.1",
    });

    const selection = selectProviderAndModel({
      request: { ...baseRequest, provider: "openai", model: "gpt-5-mini" },
      config,
    });

    assert.equal(selection.providerId, "openai");
    assert.equal(selection.modelId, "gpt-5-mini");
  });

  it("falls back to preferred and default config values", () => {
    const config = resolveGatewayConfig({
      defaultProvider: "openai",
      defaultModel: "gpt-5",
      preferredProvider: "openai",
      preferredModel: "gpt-4.1",
    });

    const preferred = selectProviderAndModel({
      request: { model: "", messages: baseRequest.messages },
      config,
    });
    assert.equal(preferred.modelId, "gpt-4.1");

    const defaults = selectProviderAndModel({
      request: {
        model: "",
        messages: baseRequest.messages,
        provider: undefined,
      },
      config: resolveGatewayConfig({
        defaultProvider: "openai",
        defaultModel: "gpt-5",
      }),
    });
    assert.equal(defaults.providerId, "openai");
    assert.equal(defaults.modelId, "gpt-5");
  });
});

describe("Default routing strategy", () => {
  it("always routes through registered OpenAI provider", () => {
    const registry = new ProviderRegistry();
    const mock = createMockProvider("openai");
    registry.register({ provider: mock });

    const decision = new DefaultRoutingStrategy().resolve(
      {
        request: baseRequest,
        config: resolveGatewayConfig(),
      },
      registry,
    );

    assert.equal(decision.providerId, "openai");
    assert.equal(decision.strategyId, "default");
  });

  it("throws when OpenAI is not registered", () => {
    const registry = new ProviderRegistry();

    assert.throws(
      () =>
        new DefaultRoutingStrategy().resolve(
          { request: baseRequest, config: resolveGatewayConfig() },
          registry,
        ),
      GatewayRoutingError,
    );
  });
});

describe("LLMGateway", () => {
  let registry: ProviderRegistry;
  let logs: GatewayLogEvent[];

  beforeEach(() => {
    resetProviderRegistry();
    resetLLMGateway();
    registry = new ProviderRegistry();
    logs = [];
    registry.register({ provider: createMockProvider("openai"), priority: 100 });
  });

  function createGateway(overrides?: Partial<ConstructorParameters<typeof LLMGateway>[0]>) {
    return new LLMGateway({
      registry,
      logger: (event) => logs.push(event),
      ...overrides,
    });
  }

  it("generate() validates, routes, and returns normalized response", async () => {
    const gateway = createGateway();
    const response = await gateway.generate(baseRequest);

    assert.equal(response.content, "Gateway response");
    assert.equal(response.provider, "openai");
    assert.equal(response.metadata?.gateway?.routingStrategy, "default");
    assert.equal(logs.at(-1)?.operation, "generate");
    assert.equal(logs.at(-1)?.retries, 0);
    assert.ok(logs.at(-1)?.latencyMs != null);
  });

  it("stream() yields chunks through the registered provider", async () => {
    const gateway = createGateway();
    const chunks = [];

    for await (const chunk of gateway.stream(baseRequest)) {
      chunks.push(chunk);
    }

    assert.deepEqual(
      chunks.map((chunk) => chunk.delta),
      ["Hello", ""],
    );
    assert.equal(logs.at(-1)?.operation, "stream");
  });

  it("retries retryable provider errors", async () => {
    let attempts = 0;
    registry.register({
      provider: createMockProvider("openai", {
        generate: async () => {
          attempts += 1;
          if (attempts === 1) {
            throw new LLMError("Rate limited", {
              code: "RATE_LIMITED",
              retryable: true,
            });
          }
          return {
            id: "retry-response",
            provider: "openai",
            model: "gpt-5-mini",
            content: "Recovered",
            finishReason: "stop",
            usage: { promptTokens: 1, completionTokens: 1, totalTokens: 2 },
          };
        },
      }),
    });

    const gateway = createGateway({
      config: { maxRetries: 2 },
    });

    const response = await gateway.generate(baseRequest);
    assert.equal(response.content, "Recovered");
    assert.equal(attempts, 2);
    assert.equal(logs.at(-1)?.retries, 1);
  });

  it("propagates non-retryable provider errors", async () => {
    registry.register({
      provider: createMockProvider("openai", {
        generate: async () => {
          throw new OpenAI.BadRequestError(400, undefined, "Invalid", undefined);
        },
      }),
    });

    const gateway = createGateway();

    await assert.rejects(() => gateway.generate(baseRequest), (error: unknown) => {
      assert.ok(error instanceof LLMError);
      return true;
    });

    assert.equal(logs.at(-1)?.level, "error");
  });

  it("healthCheck() delegates to the routed provider", async () => {
    const gateway = createGateway();
    const result = await gateway.healthCheck();

    assert.equal(result.healthy, true);
    assert.equal(logs.at(-1)?.operation, "healthCheck");
  });
});

describe("default LLMGateway singleton", () => {
  beforeEach(() => {
    resetLLMGateway();
    resetProviderRegistry();
  });

  it("returns a shared gateway instance", () => {
    const a = getLLMGateway();
    const b = getLLMGateway();
    assert.equal(a, b);

    resetLLMGateway();
    assert.notEqual(getLLMGateway(), a);
  });
});

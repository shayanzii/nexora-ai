/**
 * OpenAI provider tests — mocked client only, no real API calls.
 */
import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";

import OpenAI from "openai";

import { LLMError, LLMModelNotSupportedError } from "../../../errors/llm-errors";
import {
  getProviderRegistry,
  resetProviderRegistry,
} from "../../provider-registry";
import {
  mapLLMRequestToOpenAI,
  mapOpenAIChunkToLLMStreamChunk,
  mapOpenAIResponseToLLM,
} from "../OpenAIMapper";
import { mapOpenAIError } from "../OpenAIErrors";
import {
  createOpenAIProvider,
  registerOpenAIProvider,
  type OpenAIClientLike,
  type OpenAILogEvent,
} from "../OpenAIProvider";
import {
  isSupportedOpenAIModel,
  normalizeOpenAIModelId,
  OPENAI_MODEL_IDS,
} from "../OpenAIModels";
import type { LLMRequest } from "../../../types/llm-request";

const sampleRequest: LLMRequest = {
  id: "req-openai-1",
  model: "gpt-5-mini",
  messages: [
    { role: "system", content: "You are helpful." },
    { role: "user", content: "Say hello." },
  ],
  options: {
    temperature: 0.4,
    maxTokens: 128,
    responseFormat: "text",
  },
};

function createMockClient(handlers: {
  create?: OpenAIClientLike["chat"]["completions"]["create"];
  list?: OpenAIClientLike["models"]["list"];
}): OpenAIClientLike {
  return {
    chat: {
      completions: {
        create:
          handlers.create ??
          (async () => ({
            id: "chatcmpl-test",
            object: "chat.completion",
            created: Date.now(),
            model: "gpt-5-mini",
            choices: [
              {
                index: 0,
                message: { role: "assistant", content: "Hello!" },
                finish_reason: "stop",
                logprobs: null,
              },
            ],
            usage: {
              prompt_tokens: 12,
              completion_tokens: 4,
              total_tokens: 16,
            },
          })),
      },
    },
    models: {
      list:
        handlers.list ??
        (async () => ({
          data: [{ id: "gpt-5-mini" }],
        })),
    },
  };
}

describe("OpenAIMapper", () => {
  it("maps LLMRequest to OpenAI chat completion params", () => {
    const mapped = mapLLMRequestToOpenAI(sampleRequest, false);

    assert.equal(mapped.model, "gpt-5-mini");
    assert.equal(mapped.messages.length, 2);
    assert.equal(mapped.temperature, 0.4);
    assert.equal(mapped.max_tokens, 128);
    assert.equal("stream" in mapped, false);
  });

  it("maps streaming requests with stream=true", () => {
    const mapped = mapLLMRequestToOpenAI(sampleRequest, true);
    assert.equal(mapped.stream, true);
  });

  it("maps OpenAI completion responses to LLMResponse", () => {
    const mapped = mapOpenAIResponseToLLM(
      {
        id: "chatcmpl-abc",
        object: "chat.completion",
        created: 1,
        model: "gpt-5",
        choices: [
          {
            index: 0,
            message: { role: "assistant", content: "Done." },
            finish_reason: "stop",
            logprobs: null,
          },
        ],
        usage: {
          prompt_tokens: 5,
          completion_tokens: 2,
          total_tokens: 7,
        },
      },
      sampleRequest,
    );

    assert.equal(mapped.provider, "openai");
    assert.equal(mapped.content, "Done.");
    assert.equal(mapped.usage.totalTokens, 7);
    assert.equal(mapped.finishReason, "stop");
  });

  it("maps OpenAI stream chunks to LLMStreamChunk", () => {
    const chunk = mapOpenAIChunkToLLMStreamChunk(
      {
        id: "chatcmpl-stream",
        object: "chat.completion.chunk",
        created: 1,
        model: "gpt-5-mini",
        choices: [
          {
            index: 0,
            delta: { content: "Hel" },
            finish_reason: null,
            logprobs: null,
          },
        ],
      },
      "fallback-id",
    );

    assert.equal(chunk.delta, "Hel");
    assert.equal(chunk.done, false);

    const finalChunk = mapOpenAIChunkToLLMStreamChunk(
      {
        id: "chatcmpl-stream",
        object: "chat.completion.chunk",
        created: 1,
        model: "gpt-5-mini",
        choices: [
          {
            index: 0,
            delta: {},
            finish_reason: "stop",
            logprobs: null,
          },
        ],
        usage: {
          prompt_tokens: 3,
          completion_tokens: 2,
          total_tokens: 5,
        },
      },
      "fallback-id",
    );

    assert.equal(finalChunk.done, true);
    assert.equal(finalChunk.usage?.totalTokens, 5);
  });

  it("normalizes supported model aliases", () => {
    assert.equal(normalizeOpenAIModelId("GPT-5 Mini"), "gpt-5-mini");
    assert.ok(isSupportedOpenAIModel("gpt-4.1"));
    assert.equal(OPENAI_MODEL_IDS.length, 3);
  });
});

describe("OpenAIErrors", () => {
  it("maps authentication errors to configuration LLM errors", () => {
    const error = mapOpenAIError(
      new OpenAI.AuthenticationError(401, undefined, "Unauthorized", undefined),
      { operation: "generate", modelId: "gpt-5" },
    );

    assert.equal(error.code, "CONFIGURATION_ERROR");
    assert.equal(error.providerId, "openai");
  });

  it("maps rate limits and timeouts to retryable LLM errors", () => {
    const rateLimit = mapOpenAIError(
      new OpenAI.RateLimitError(429, undefined, "Rate limited", undefined),
      { operation: "generate" },
    );
    assert.equal(rateLimit.code, "RATE_LIMITED");
    assert.equal(rateLimit.retryable, true);

    const timeout = mapOpenAIError(
      new OpenAI.APIUserAbortError({ message: "Timed out" }),
      { operation: "stream" },
    );
    assert.equal(timeout.code, "TIMEOUT");
    assert.equal(timeout.retryable, true);
  });

  it("maps network and invalid request failures", () => {
    const network = mapOpenAIError(
      new OpenAI.APIConnectionError({ message: "Network down" }),
      { operation: "generate" },
    );
    assert.equal(network.code, "GENERATION_FAILED");
    assert.equal(network.retryable, true);

    const invalid = mapOpenAIError(
      new OpenAI.BadRequestError(400, undefined, "Bad request", undefined),
      { operation: "generate" },
    );
    assert.equal(invalid.code, "VALIDATION_ERROR");
    assert.equal(invalid.retryable, false);
  });
});

describe("OpenAIProvider", () => {
  it("generate() returns mapped LLMResponse via mocked client", async () => {
    const logs: OpenAILogEvent[] = [];
    const provider = createOpenAIProvider({
      client: createMockClient({}),
      logger: (event) => logs.push(event),
    });

    const response = await provider.generate(sampleRequest);

    assert.equal(response.content, "Hello!");
    assert.equal(response.provider, "openai");
    assert.equal(logs.at(-1)?.operation, "generate");
    assert.equal(logs.at(-1)?.level, "info");
    assert.ok(logs.at(-1)?.latencyMs != null);
  });

  it("stream() yields chunks from mocked client", async () => {
    const provider = createOpenAIProvider({
      client: createMockClient({
        create: async (body) => {
          assert.equal(body.stream, true);

          async function* generator() {
            yield {
              id: "chatcmpl-stream",
              object: "chat.completion.chunk",
              created: 1,
              model: "gpt-5-mini",
              choices: [
                {
                  index: 0,
                  delta: { content: "Hi" },
                  finish_reason: null,
                  logprobs: null,
                },
              ],
            };
            yield {
              id: "chatcmpl-stream",
              object: "chat.completion.chunk",
              created: 1,
              model: "gpt-5-mini",
              choices: [
                {
                  index: 0,
                  delta: {},
                  finish_reason: "stop",
                  logprobs: null,
                },
              ],
            };
          }

          return generator();
        },
      }),
    });

    const chunks = [];
    for await (const chunk of provider.stream(sampleRequest)) {
      chunks.push(chunk);
    }

    assert.deepEqual(
      chunks.map((chunk) => chunk.delta),
      ["Hi", ""],
    );
    assert.equal(chunks.at(-1)?.done, true);
  });

  it("healthCheck() reports healthy with mocked models.list()", async () => {
    const provider = createOpenAIProvider({
      client: createMockClient({}),
    });

    const result = await provider.healthCheck();
    assert.equal(result.healthy, true);
    assert.ok(result.latencyMs != null);
  });

  it("supports() reflects model capabilities", () => {
    const provider = createOpenAIProvider({
      client: createMockClient({}),
    });

    assert.equal(provider.supports("chat-completion", "gpt-5-mini"), true);
    assert.equal(provider.supports("vision", "gpt-5-mini"), false);
    assert.equal(provider.supports("vision", "gpt-5"), true);
  });

  it("fails gracefully when OPENAI_API_KEY is missing", async () => {
    const originalKey = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;

    const provider = createOpenAIProvider();

    assert.equal(provider.configured, false);

    const health = await provider.healthCheck();
    assert.equal(health.healthy, false);
    assert.match(health.message ?? "", /OPENAI_API_KEY/);

    await assert.rejects(
      () => provider.generate(sampleRequest),
      (error: unknown) => {
        assert.ok(error instanceof LLMError);
        assert.equal(error.code, "CONFIGURATION_ERROR");
        return true;
      },
    );

    if (originalKey) {
      process.env.OPENAI_API_KEY = originalKey;
    }
  });

  it("throws for unsupported models", async () => {
    const provider = createOpenAIProvider({
      client: createMockClient({}),
    });

    await assert.rejects(
      () =>
        provider.generate({
          ...sampleRequest,
          model: "gpt-unknown",
        }),
      LLMModelNotSupportedError,
    );
  });

  it("logs errors from failed generate() calls", async () => {
    const logs: OpenAILogEvent[] = [];
    const provider = createOpenAIProvider({
      client: createMockClient({
        create: async () => {
          throw new OpenAI.RateLimitError(429, undefined, "Rate limited", undefined);
        },
      }),
      logger: (event) => logs.push(event),
    });

    await assert.rejects(() => provider.generate(sampleRequest), (error: unknown) => {
      assert.ok(error instanceof LLMError);
      assert.equal(error.code, "RATE_LIMITED");
      return true;
    });

    assert.equal(logs.at(-1)?.level, "error");
    assert.match(logs.at(-1)?.error ?? "", /rate limit/i);
  });
});

describe("OpenAI provider registry integration", () => {
  beforeEach(() => {
    resetProviderRegistry();
  });

  it("registers OpenAIProvider with the provider registry", () => {
    const provider = registerOpenAIProvider({
      client: createMockClient({}),
    });

    const registry = getProviderRegistry();
    assert.equal(registry.has("openai"), true);
    assert.equal(registry.resolve("openai"), provider);

    const discovered = registry.discover({
      capability: "chat-completion",
      tag: "openai",
    });
    assert.ok(discovered.some((entry) => entry.provider.id === "openai"));
  });
});

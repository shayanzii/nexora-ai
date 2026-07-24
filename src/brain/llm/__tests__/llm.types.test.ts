/**
 * LLM layer type contract tests.
 * Compile-time and runtime shape validation — no external API calls.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type {
  GenerationOptions,
  LLMMessage,
  LLMRequest,
} from "../types/llm-request";
import type {
  LLMHealthCheckResult,
  LLMResponse,
  LLMStreamChunk,
  TokenUsage,
} from "../types/llm-response";
import type {
  LLMProviderId,
  ModelCapability,
  ModelDefinition,
} from "../types/model";
import { KNOWN_LLM_PROVIDERS } from "../types/model";

describe("LLM type contracts", () => {
  it("accepts a fully typed LLMRequest", () => {
    const messages: LLMMessage[] = [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: "Hello" },
    ];

    const options: GenerationOptions = {
      temperature: 0.7,
      maxTokens: 1024,
      stream: false,
      responseFormat: "text",
    };

    const request = {
      id: "req-1",
      provider: "openai" satisfies LLMProviderId,
      model: "gpt-4o",
      messages,
      options,
      metadata: { department: "website" },
    } satisfies LLMRequest;

    assert.equal(request.messages.length, 2);
    assert.equal(request.options?.temperature, 0.7);
  });

  it("accepts a fully typed LLMResponse with TokenUsage", () => {
    const usage: TokenUsage = {
      promptTokens: 10,
      completionTokens: 20,
      totalTokens: 30,
    };

    const response = {
      id: "resp-1",
      provider: "anthropic",
      model: "claude-3-5-sonnet",
      content: "Hello!",
      finishReason: "stop",
      usage,
    } satisfies LLMResponse;

    assert.equal(response.usage.totalTokens, 30);
  });

  it("accepts stream chunks and health check results", () => {
    const chunk = {
      id: "stream-1",
      delta: "Hi",
      done: false,
    } satisfies LLMStreamChunk;

    const health = {
      provider: "local",
      healthy: true,
      latencyMs: 12,
      checkedAt: new Date().toISOString(),
    } satisfies LLMHealthCheckResult;

    assert.equal(chunk.done, false);
    assert.equal(health.healthy, true);
  });

  it("covers all known provider IDs and model capabilities", () => {
    const providers: LLMProviderId[] = [...KNOWN_LLM_PROVIDERS];
    assert.equal(providers.length, 5);
    assert.ok(providers.includes("openai"));
    assert.ok(providers.includes("local"));

    const capabilities: ModelCapability[] = [
      "text-generation",
      "chat-completion",
      "streaming",
      "function-calling",
      "vision",
      "json-mode",
      "embeddings",
    ];

    const model: ModelDefinition = {
      id: "test-model",
      providerId: "grok",
      displayName: "Test Model",
      capabilities,
      contextWindowTokens: 128_000,
    };

    assert.equal(model.capabilities.length, capabilities.length);
  });
});

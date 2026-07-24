/**
 * Provider registry tests.
 * Uses in-test stub providers — no external API calls.
 */
import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";

import { LLMProviderNotFoundError } from "../errors/llm-errors";
import type { LLMProvider } from "../providers/base-provider";
import {
  ProviderRegistry,
  getProviderRegistry,
  resetProviderRegistry,
} from "../providers/provider-registry";
import type { LLMRequest } from "../types/llm-request";
import type {
  LLMHealthCheckResult,
  LLMResponse,
  LLMStreamChunk,
} from "../types/llm-response";
import type { LLMProviderId, ModelCapability, ModelDefinition } from "../types/model";

function createStubProvider(
  id: LLMProviderId,
  capabilities: ModelCapability[],
): LLMProvider {
  const models: ModelDefinition[] = [
    {
      id: `${id}-default`,
      providerId: id,
      displayName: `${id} default`,
      capabilities,
    },
  ];

  return {
    id,
    name: `${id} stub`,
    models,
    supports(capability: ModelCapability, modelId?: string) {
      if (modelId && modelId !== models[0].id) return false;
      return capabilities.includes(capability);
    },
    async healthCheck(): Promise<LLMHealthCheckResult> {
      return {
        provider: id,
        healthy: true,
        checkedAt: new Date().toISOString(),
      };
    },
    async generate(request: LLMRequest): Promise<LLMResponse> {
      return {
        id: "stub-response",
        provider: id,
        model: request.model,
        content: "stub",
        finishReason: "stop",
        usage: { promptTokens: 1, completionTokens: 1, totalTokens: 2 },
      };
    },
    async *stream(): AsyncIterable<LLMStreamChunk> {
      yield { id: "stub-stream", delta: "stub", done: false };
      yield { id: "stub-stream", delta: "", done: true, finishReason: "stop" };
    },
  };
}

describe("ProviderRegistry", () => {
  let registry: ProviderRegistry;

  beforeEach(() => {
    registry = new ProviderRegistry();
  });

  it("registers and resolves providers by ID", () => {
    const openai = createStubProvider("openai", ["chat-completion", "streaming"]);
    registry.register({ provider: openai, priority: 10, tags: ["cloud"] });

    assert.equal(registry.resolve("openai")?.id, "openai");
    assert.equal(registry.has("openai"), true);
    assert.equal(registry.has("google"), false);
  });

  it("lists providers sorted by priority", () => {
    registry.register({
      provider: createStubProvider("openai", ["chat-completion"]),
      priority: 5,
    });
    registry.register({
      provider: createStubProvider("anthropic", ["chat-completion"]),
      priority: 20,
    });

    const ids = registry.list().map((entry) => entry.provider.id);
    assert.deepEqual(ids, ["anthropic", "openai"]);
  });

  it("discovers providers by capability and tag without modifying registry code", () => {
    registry.register({
      provider: createStubProvider("openai", ["chat-completion", "streaming"]),
      tags: ["cloud"],
    });
    registry.register({
      provider: createStubProvider("local", ["chat-completion"]),
      tags: ["on-prem"],
    });
    registry.register({
      provider: createStubProvider("google", ["embeddings"]),
      tags: ["cloud"],
    });

    const streaming = registry.discover({ capability: "streaming" });
    assert.deepEqual(
      streaming.map((entry) => entry.provider.id),
      ["openai"],
    );

    const cloudChat = registry.discover({
      capability: "chat-completion",
      tag: "cloud",
    });
    assert.deepEqual(
      cloudChat.map((entry) => entry.provider.id),
      ["openai"],
    );
  });

  it("unregisters providers and clears tag index", () => {
    registry.register({
      provider: createStubProvider("grok", ["chat-completion"]),
      tags: ["cloud"],
    });

    assert.equal(registry.unregister("grok"), true);
    assert.equal(registry.unregister("grok"), false);
    assert.equal(registry.discover({ tag: "cloud" }).length, 0);
  });

  it("throws in strict mode on duplicate registration", () => {
    const strictRegistry = new ProviderRegistry({ strict: true });
    const provider = createStubProvider("openai", ["chat-completion"]);

    strictRegistry.register({ provider });
    assert.throws(
      () => strictRegistry.register({ provider }),
      /already registered/,
    );
  });

  it("require() throws LLMProviderNotFoundError for missing providers", () => {
    assert.throws(
      () => registry.require("missing-provider"),
      LLMProviderNotFoundError,
    );
  });
});

describe("default ProviderRegistry singleton", () => {
  beforeEach(() => {
    resetProviderRegistry();
  });

  it("returns a shared registry instance", () => {
    const a = getProviderRegistry();
    const b = getProviderRegistry();
    assert.equal(a, b);

    a.register({
      provider: createStubProvider("anthropic", ["chat-completion"]),
    });
    assert.equal(b.has("anthropic"), true);

    resetProviderRegistry();
    assert.equal(getProviderRegistry().has("anthropic"), false);
  });
});

describe("future provider extensibility", () => {
  it("accepts custom provider IDs without code changes", () => {
    const registry = new ProviderRegistry();
    const customId = "custom-llm-vendor" as LLMProviderId;
    const provider = createStubProvider(customId, ["text-generation"]);

    registry.register({ provider });
    assert.equal(registry.resolve(customId)?.id, customId);
  });
});

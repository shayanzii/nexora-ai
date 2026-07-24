/**
 * LLM configuration resolver tests.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  resolveGenerationOptions,
  resolveProviderMaxRetries,
  resolveProviderTimeoutMs,
  type LLMConfig,
} from "../config/llm-config";

const baseConfig: LLMConfig = {
  defaultProvider: "openai",
  defaultModel: "gpt-4o",
  timeoutMs: 30_000,
  maxRetries: 2,
  streaming: true,
  generation: {
    temperature: 0.5,
    maxTokens: 2048,
    topP: 0.9,
  },
  providers: {
    openai: {
      enabled: true,
      timeoutMs: 45_000,
      maxRetries: 3,
      generation: { temperature: 0.2 },
    },
    anthropic: {
      enabled: true,
      defaultModel: "claude-3-5-sonnet",
    },
  },
};

describe("LLM config resolvers", () => {
  it("merges global and request generation options", () => {
    const resolved = resolveGenerationOptions(baseConfig, {
      temperature: 0.8,
      maxTokens: 512,
    });

    assert.equal(resolved.temperature, 0.8);
    assert.equal(resolved.maxTokens, 512);
    assert.equal(resolved.topP, 0.9);
    assert.equal(resolved.stream, true);
  });

  it("allows request to disable streaming independently", () => {
    const resolved = resolveGenerationOptions(baseConfig, { stream: false });
    assert.equal(resolved.stream, false);
  });

  it("resolves provider-specific timeout and retries with fallbacks", () => {
    assert.equal(resolveProviderTimeoutMs(baseConfig, "openai"), 45_000);
    assert.equal(resolveProviderMaxRetries(baseConfig, "openai"), 3);
    assert.equal(resolveProviderTimeoutMs(baseConfig, "anthropic"), 30_000);
    assert.equal(resolveProviderMaxRetries(baseConfig, "anthropic"), 2);
  });
});

import type { GenerationOptions } from "../types/llm-request";
import type { LLMProviderId, ModelId } from "../types/model";

/** Per-provider configuration overrides. */
export interface ProviderConfig {
  enabled: boolean;
  defaultModel?: ModelId;
  apiKeyEnvVar?: string;
  timeoutMs?: number;
  maxRetries?: number;
  generation?: Partial<GenerationOptions>;
}

/** Top-level LLM gateway configuration. */
export interface LLMConfig {
  defaultProvider: LLMProviderId;
  defaultModel: ModelId;
  timeoutMs: number;
  maxRetries: number;
  streaming: boolean;
  generation: GenerationOptions;
  providers: Readonly<Partial<Record<LLMProviderId, ProviderConfig>>>;
}

/** Resolves effective generation options by merging config defaults with request overrides. */
export function resolveGenerationOptions(
  config: LLMConfig,
  overrides?: GenerationOptions,
): GenerationOptions {
  return {
    ...config.generation,
    ...overrides,
    stream: overrides?.stream ?? config.streaming,
  };
}

/** Resolves timeout for a specific provider, falling back to global config. */
export function resolveProviderTimeoutMs(
  config: LLMConfig,
  providerId: LLMProviderId,
): number {
  return config.providers[providerId]?.timeoutMs ?? config.timeoutMs;
}

/** Resolves retry count for a specific provider, falling back to global config. */
export function resolveProviderMaxRetries(
  config: LLMConfig,
  providerId: LLMProviderId,
): number {
  return config.providers[providerId]?.maxRetries ?? config.maxRetries;
}

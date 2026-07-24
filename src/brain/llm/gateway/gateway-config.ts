import type { GenerationOptions } from "../types/llm-request";
import type { LLMProviderId, ModelId } from "../types/model";
import { OPENAI_DEFAULT_MODEL, OPENAI_PROVIDER_ID } from "../providers/openai/OpenAIModels";

/** Configuration for the LLM gateway layer. */
export interface GatewayConfig {
  defaultProvider: LLMProviderId;
  defaultModel: ModelId;
  preferredProvider?: LLMProviderId;
  preferredModel?: ModelId;
  timeoutMs: number;
  maxRetries: number;
  streaming: boolean;
  generation: GenerationOptions;
}

/** Default gateway configuration — routes through OpenAI. */
export const DEFAULT_GATEWAY_CONFIG: GatewayConfig = {
  defaultProvider: OPENAI_PROVIDER_ID,
  defaultModel: OPENAI_DEFAULT_MODEL,
  timeoutMs: 30_000,
  maxRetries: 2,
  streaming: false,
  generation: {
    temperature: 0.7,
    maxTokens: 2048,
  },
};

/** Merges partial gateway configuration with defaults. */
export function resolveGatewayConfig(
  overrides: Partial<GatewayConfig> = {},
): GatewayConfig {
  return {
    ...DEFAULT_GATEWAY_CONFIG,
    ...overrides,
    generation: {
      ...DEFAULT_GATEWAY_CONFIG.generation,
      ...overrides.generation,
    },
  };
}

import type { LLMRequest } from "../types/llm-request";
import type {
  LLMHealthCheckResult,
  LLMResponse,
  LLMStreamChunk,
} from "../types/llm-response";
import type { LLMProviderId, ModelCapability, ModelDefinition } from "../types/model";

/**
 * Contract every LLM provider must implement.
 * Concrete API integrations (OpenAI, Anthropic, etc.) implement this interface
 * without modifying the registry or gateway code.
 */
export interface LLMProvider {
  readonly id: LLMProviderId;
  readonly name: string;
  readonly models: readonly ModelDefinition[];

  /** Returns true when the provider (and optional model) supports a capability. */
  supports(capability: ModelCapability, modelId?: string): boolean;

  /** Probes provider availability without performing generation. */
  healthCheck(): Promise<LLMHealthCheckResult>;

  /** Performs a single non-streaming completion. */
  generate(request: LLMRequest): Promise<LLMResponse>;

  /** Performs a streaming completion. Yields incremental chunks until done. */
  stream(request: LLMRequest): AsyncIterable<LLMStreamChunk>;
}

/** Registration metadata stored alongside a provider in the registry. */
export interface LLMProviderRegistration {
  provider: LLMProvider;
  priority?: number;
  tags?: readonly string[];
}

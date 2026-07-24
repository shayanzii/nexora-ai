import type { LLMProviderId, ModelId } from "./model";

/** Token accounting returned by providers after generation. */
export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

/** Reason generation stopped. */
export type LLMFinishReason =
  | "stop"
  | "length"
  | "content_filter"
  | "tool_calls"
  | "error"
  | "unknown";

/** Non-streaming completion result from a provider. */
export interface LLMResponse {
  id: string;
  provider: LLMProviderId;
  model: ModelId;
  content: string;
  finishReason: LLMFinishReason;
  usage: TokenUsage;
  metadata?: Readonly<Record<string, unknown>>;
}

/** Incremental chunk emitted during streaming generation. */
export interface LLMStreamChunk {
  id: string;
  delta: string;
  done: boolean;
  finishReason?: LLMFinishReason;
  usage?: TokenUsage;
}

/** Result of a provider health probe. */
export interface LLMHealthCheckResult {
  provider: LLMProviderId;
  healthy: boolean;
  latencyMs?: number;
  message?: string;
  checkedAt: string;
}

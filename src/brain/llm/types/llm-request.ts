import type { LLMProviderId, ModelId } from "./model";

/** Role of a message in a chat-style LLM request. */
export type LLMMessageRole = "system" | "user" | "assistant" | "tool";

/** Single message unit sent to an LLM provider. */
export interface LLMMessage {
  role: LLMMessageRole;
  content: string;
  name?: string;
  toolCallId?: string;
}

/** Controls applied to a single generation request. */
export interface GenerationOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stopSequences?: readonly string[];
  stream?: boolean;
  responseFormat?: "text" | "json";
  seed?: number;
}

/** Canonical request shape — the only input accepted by the LLM gateway. */
export interface LLMRequest {
  /** Optional client-side correlation ID. */
  id?: string;
  provider?: LLMProviderId;
  model: ModelId;
  messages: readonly LLMMessage[];
  options?: GenerationOptions;
  metadata?: Readonly<Record<string, unknown>>;
}

/**
 * Model identifiers and capability metadata for the LLM provider layer.
 * Provider-specific model strings remain opaque at this layer.
 */

/** Well-known provider identifiers. Additional providers register via string ID. */
export const KNOWN_LLM_PROVIDERS = [
  "openai",
  "anthropic",
  "google",
  "grok",
  "local",
] as const;

export type KnownLLMProviderId = (typeof KNOWN_LLM_PROVIDERS)[number];

/** Extensible provider identifier — known IDs plus custom registrations. */
export type LLMProviderId = KnownLLMProviderId | (string & {});

/** Opaque model identifier within a provider (e.g. gpt-4o, claude-3-5-sonnet). */
export type ModelId = string;

/** Capabilities a model or provider may expose. */
export type ModelCapability =
  | "text-generation"
  | "chat-completion"
  | "streaming"
  | "function-calling"
  | "vision"
  | "json-mode"
  | "embeddings";

/** Static metadata describing a model exposed by a provider. */
export interface ModelDefinition {
  id: ModelId;
  providerId: LLMProviderId;
  displayName: string;
  capabilities: readonly ModelCapability[];
  contextWindowTokens?: number;
  maxOutputTokens?: number;
}

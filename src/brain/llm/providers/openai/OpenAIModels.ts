import type { ModelCapability, ModelDefinition } from "../../types/model";

export const OPENAI_PROVIDER_ID = "openai" as const;

/** Canonical OpenAI model IDs supported by Nexora Brain. */
export const OPENAI_MODEL_IDS = ["gpt-5", "gpt-5-mini", "gpt-4.1"] as const;

export type OpenAIModelId = (typeof OPENAI_MODEL_IDS)[number];

const SHARED_CHAT_CAPABILITIES: readonly ModelCapability[] = [
  "text-generation",
  "chat-completion",
  "streaming",
  "json-mode",
];

const ADVANCED_CAPABILITIES: readonly ModelCapability[] = [
  ...SHARED_CHAT_CAPABILITIES,
  "function-calling",
  "vision",
];

const OPENAI_MODEL_REGISTRY: Record<OpenAIModelId, ModelDefinition> = {
  "gpt-5": {
    id: "gpt-5",
    providerId: OPENAI_PROVIDER_ID,
    displayName: "GPT-5",
    capabilities: ADVANCED_CAPABILITIES,
    contextWindowTokens: 256_000,
    maxOutputTokens: 32_768,
  },
  "gpt-5-mini": {
    id: "gpt-5-mini",
    providerId: OPENAI_PROVIDER_ID,
    displayName: "GPT-5 Mini",
    capabilities: SHARED_CHAT_CAPABILITIES,
    contextWindowTokens: 128_000,
    maxOutputTokens: 16_384,
  },
  "gpt-4.1": {
    id: "gpt-4.1",
    providerId: OPENAI_PROVIDER_ID,
    displayName: "GPT-4.1",
    capabilities: ADVANCED_CAPABILITIES,
    contextWindowTokens: 128_000,
    maxOutputTokens: 16_384,
  },
};

const MODEL_ALIASES: Record<string, OpenAIModelId> = {
  "gpt-5": "gpt-5",
  gpt5: "gpt-5",
  "gpt-5-mini": "gpt-5-mini",
  "gpt5-mini": "gpt-5-mini",
  "gpt-4.1": "gpt-4.1",
  gpt41: "gpt-4.1",
};

/** All supported OpenAI model definitions. */
export const OPENAI_MODELS: readonly ModelDefinition[] = OPENAI_MODEL_IDS.map(
  (id) => OPENAI_MODEL_REGISTRY[id],
);

/** Normalizes user-facing model names to canonical OpenAI model IDs. */
export function normalizeOpenAIModelId(modelId: string): string {
  const normalized = modelId.trim().toLowerCase().replace(/\s+/g, "-");
  return MODEL_ALIASES[normalized] ?? normalized;
}

/** Returns true when the model ID is supported by this provider. */
export function isSupportedOpenAIModel(modelId: string): modelId is OpenAIModelId {
  const normalized = normalizeOpenAIModelId(modelId);
  return OPENAI_MODEL_IDS.includes(normalized as OpenAIModelId);
}

/** Resolves a model definition or undefined when unsupported. */
export function resolveOpenAIModel(modelId: string): ModelDefinition | undefined {
  const normalized = normalizeOpenAIModelId(modelId);
  if (!isSupportedOpenAIModel(normalized)) {
    return undefined;
  }
  return OPENAI_MODEL_REGISTRY[normalized];
}

/** Default model when none is specified in configuration. */
export const OPENAI_DEFAULT_MODEL: OpenAIModelId = "gpt-5-mini";

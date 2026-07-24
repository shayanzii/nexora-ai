import { registerOpenAIProvider } from "./OpenAIProvider";

export {
  OpenAIProvider,
  createOpenAIProvider,
  registerOpenAIProvider,
  OPENAI_DEFAULT_MODEL,
} from "./OpenAIProvider";

export type {
  OpenAIProviderOptions,
  OpenAIClientLike,
  OpenAILogEvent,
  OpenAILogger,
} from "./OpenAIProvider";

export {
  mapLLMRequestToOpenAI,
  mapOpenAIResponseToLLM,
  mapOpenAIChunkToLLMStreamChunk,
} from "./OpenAIMapper";

export type { OpenAIChatCompletionParams } from "./OpenAIMapper";

export {
  OPENAI_MODELS,
  OPENAI_MODEL_IDS,
  OPENAI_PROVIDER_ID,
  normalizeOpenAIModelId,
  isSupportedOpenAIModel,
  resolveOpenAIModel,
} from "./OpenAIModels";

export type { OpenAIModelId } from "./OpenAIModels";

export { mapOpenAIError, configurationError } from "./OpenAIErrors";

export type { OpenAIErrorContext } from "./OpenAIErrors";

registerOpenAIProvider();

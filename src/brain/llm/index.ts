export type {
  LLMMessage,
  LLMMessageRole,
  LLMRequest,
  GenerationOptions,
} from "./types/llm-request";

export type {
  TokenUsage,
  LLMFinishReason,
  LLMResponse,
  LLMStreamChunk,
  LLMHealthCheckResult,
} from "./types/llm-response";

export type {
  KnownLLMProviderId,
  LLMProviderId,
  ModelId,
  ModelCapability,
  ModelDefinition,
} from "./types/model";

export { KNOWN_LLM_PROVIDERS } from "./types/model";

export type { LLMProvider, LLMProviderRegistration } from "./providers/base-provider";

export {
  ProviderRegistry,
  getProviderRegistry,
  resetProviderRegistry,
} from "./providers/provider-registry";

export type { ProviderRegistryOptions } from "./providers/provider-registry";

export type { LLMConfig, ProviderConfig } from "./config/llm-config";

export {
  resolveGenerationOptions,
  resolveProviderTimeoutMs,
  resolveProviderMaxRetries,
} from "./config/llm-config";

export type { LLMErrorCode, LLMErrorDetails } from "./errors/llm-errors";

export {
  LLMError,
  LLMProviderNotFoundError,
  LLMModelNotSupportedError,
  LLMCapabilityNotSupportedError,
} from "./errors/llm-errors";

export {
  OpenAIProvider,
  createOpenAIProvider,
  registerOpenAIProvider,
  OPENAI_DEFAULT_MODEL,
  OPENAI_MODELS,
  OPENAI_MODEL_IDS,
  OPENAI_PROVIDER_ID,
  mapLLMRequestToOpenAI,
  mapOpenAIResponseToLLM,
  mapOpenAIChunkToLLMStreamChunk,
  mapOpenAIError,
  normalizeOpenAIModelId,
  isSupportedOpenAIModel,
  resolveOpenAIModel,
} from "./providers/openai";

export type {
  OpenAIProviderOptions,
  OpenAIClientLike,
  OpenAILogEvent,
  OpenAILogger,
  OpenAIChatCompletionParams,
  OpenAIModelId,
  OpenAIErrorContext,
} from "./providers/openai";

export {
  LLMGateway,
  getLLMGateway,
  resetLLMGateway,
  DEFAULT_GATEWAY_CONFIG,
  resolveGatewayConfig,
  validateGatewayRequest,
  normalizeGatewayRequest,
  selectProviderAndModel,
  DefaultRoutingStrategy,
  GatewayValidationError,
  GatewayRoutingError,
} from "./gateway";

export type {
  GatewayConfig,
  GatewayLogEvent,
  GatewayLogger,
  LLMGatewayOptions,
  RoutingStrategy,
  RoutingStrategyId,
  RoutingDecision,
  ModelSelectionResult,
} from "./gateway";

export {
  LLMGateway,
  getLLMGateway,
  resetLLMGateway,
  DEFAULT_GATEWAY_CONFIG,
  resolveGatewayConfig,
} from "./LLMGateway";

export type {
  GatewayConfig,
  GatewayLogEvent,
  GatewayLogger,
  LLMGatewayOptions,
} from "./LLMGateway";

export {
  validateGatewayRequest,
  normalizeGatewayRequest,
} from "./RequestNormalizer";

export {
  normalizeGatewayResponse,
  normalizeGatewayStreamChunk,
} from "./ResponseNormalizer";

export type { ResponseNormalizationContext } from "./ResponseNormalizer";

export { selectProviderAndModel } from "./ModelSelector";

export type { ModelSelectionInput, ModelSelectionResult } from "./ModelSelector";

export {
  DefaultRoutingStrategy,
  resolveRoutingStrategy,
} from "./RoutingStrategy";

export type {
  RoutingStrategy,
  RoutingStrategyId,
  RoutingDecision,
  RoutingContext,
  CostRoutingStrategy,
  QualityRoutingStrategy,
  SpeedRoutingStrategy,
  FallbackRoutingStrategy,
} from "./RoutingStrategy";

export {
  GatewayValidationError,
  GatewayRoutingError,
  propagateGatewayError,
} from "./GatewayErrors";

import type { ProviderRegistry } from "../providers/provider-registry";
import type { LLMProviderId, ModelId } from "../types/model";
import type { LLMRequest } from "../types/llm-request";
import { GatewayRoutingError } from "./GatewayErrors";
import type { GatewayConfig } from "./gateway-config";
import { selectProviderAndModel } from "./ModelSelector";

/** Identifies a routing strategy implementation. */
export type RoutingStrategyId =
  | "default"
  | "cost"
  | "quality"
  | "speed"
  | "fallback";

/** Result of routing an LLM request to a provider and model. */
export interface RoutingDecision {
  providerId: LLMProviderId;
  modelId: ModelId;
  strategyId: RoutingStrategyId;
}

/** Context passed to routing strategies. */
export interface RoutingContext {
  request: LLMRequest;
  config: GatewayConfig;
}

/**
 * Routes LLM requests to providers.
 * Extension point for cost, quality, speed, fallback, and multi-provider routing.
 */
export interface RoutingStrategy {
  readonly id: RoutingStrategyId;
  resolve(context: RoutingContext, registry: ProviderRegistry): RoutingDecision;
}

/** Future extension point — routes by cost optimization. */
export interface CostRoutingStrategy extends RoutingStrategy {
  readonly id: "cost";
}

/** Future extension point — routes by output quality tier. */
export interface QualityRoutingStrategy extends RoutingStrategy {
  readonly id: "quality";
}

/** Future extension point — routes by latency targets. */
export interface SpeedRoutingStrategy extends RoutingStrategy {
  readonly id: "speed";
}

/** Future extension point — primary with fallback provider chain. */
export interface FallbackRoutingStrategy extends RoutingStrategy {
  readonly id: "fallback";
}

const OPENAI_PROVIDER_ID = "openai" as const;

/**
 * Default routing strategy.
 * Currently always routes through OpenAI via the provider registry.
 */
export class DefaultRoutingStrategy implements RoutingStrategy {
  readonly id = "default" as const;

  resolve(context: RoutingContext, registry: ProviderRegistry): RoutingDecision {
    const selection = selectProviderAndModel({
      request: context.request,
      config: context.config,
    });

    if (!registry.has(OPENAI_PROVIDER_ID)) {
      throw new GatewayRoutingError(
        "OpenAI provider is not registered. Import the OpenAI provider module before using the gateway.",
        OPENAI_PROVIDER_ID,
        context.request.id,
      );
    }

    return {
      providerId: OPENAI_PROVIDER_ID,
      modelId: selection.modelId,
      strategyId: this.id,
    };
  }
}

/** Returns the configured routing strategy or the default OpenAI strategy. */
export function resolveRoutingStrategy(
  strategy?: RoutingStrategy,
): RoutingStrategy {
  return strategy ?? new DefaultRoutingStrategy();
}

import type { LLMResponse, LLMStreamChunk } from "../types/llm-response";
import type { RoutingDecision } from "./RoutingStrategy";

export interface ResponseNormalizationContext {
  routing: RoutingDecision;
  latencyMs: number;
  retries: number;
  requestId?: string;
}

/** Enriches provider responses with gateway execution metadata. */
export function normalizeGatewayResponse(
  response: LLMResponse,
  context: ResponseNormalizationContext,
): LLMResponse {
  return {
    ...response,
    provider: context.routing.providerId,
    model: context.routing.modelId,
    metadata: {
      ...response.metadata,
      gateway: {
        routingStrategy: context.routing.strategyId,
        latencyMs: context.latencyMs,
        retries: context.retries,
        requestId: context.requestId,
      },
    },
  };
}

/** Pass-through normalizer for stream chunks — usage is forwarded unchanged. */
export function normalizeGatewayStreamChunk(
  chunk: LLMStreamChunk,
): LLMStreamChunk {
  return chunk;
}

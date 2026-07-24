import type { LLMProviderId, ModelId } from "../types/model";
import type { GatewayConfig } from "./gateway-config";
import type { LLMRequest } from "../types/llm-request";

export interface ModelSelectionInput {
  request: LLMRequest;
  config: GatewayConfig;
}

export interface ModelSelectionResult {
  providerId: LLMProviderId;
  modelId: ModelId;
}

/**
 * Resolves the effective provider and model from request hints and gateway config.
 * Supports defaultModel, preferredProvider, and preferredModel overrides.
 */
export function selectProviderAndModel(
  input: ModelSelectionInput,
): ModelSelectionResult {
  const { request, config } = input;

  const providerId =
    request.provider ?? config.preferredProvider ?? config.defaultProvider;

  const modelId = request.model?.trim()
    ? request.model.trim()
    : config.preferredModel ?? config.defaultModel;

  return { providerId, modelId };
}

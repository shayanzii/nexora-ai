import type { GenerationOptions, LLMRequest } from "../types/llm-request";
import type { GatewayConfig } from "./gateway-config";
import { GatewayValidationError } from "./GatewayErrors";

const MIN_TEMPERATURE = 0;
const MAX_TEMPERATURE = 2;
const MIN_MAX_TOKENS = 1;

const VALID_ROLES = new Set(["system", "user", "assistant", "tool"]);

/** Validates an LLM request before gateway routing and provider dispatch. */
export function validateGatewayRequest(request: LLMRequest): void {
  if (!request.messages || request.messages.length === 0) {
    throw new GatewayValidationError(
      "LLM request must include at least one message.",
      request.id,
      "messages",
    );
  }

  for (const [index, message] of request.messages.entries()) {
    if (!VALID_ROLES.has(message.role)) {
      throw new GatewayValidationError(
        `Invalid message role at index ${index}.`,
        request.id,
        `messages[${index}].role`,
      );
    }

    if (!message.content.trim()) {
      throw new GatewayValidationError(
        `Message content at index ${index} must not be empty.`,
        request.id,
        `messages[${index}].content`,
      );
    }
  }

  if (request.model != null && typeof request.model !== "string") {
    throw new GatewayValidationError(
      "Model must be a string when provided.",
      request.id,
      "model",
    );
  }

  const options = request.options;
  if (options?.temperature != null) {
    if (
      options.temperature < MIN_TEMPERATURE ||
      options.temperature > MAX_TEMPERATURE
    ) {
      throw new GatewayValidationError(
        `Temperature must be between ${MIN_TEMPERATURE} and ${MAX_TEMPERATURE}.`,
        request.id,
        "options.temperature",
      );
    }
  }

  if (options?.maxTokens != null) {
    if (!Number.isInteger(options.maxTokens) || options.maxTokens < MIN_MAX_TOKENS) {
      throw new GatewayValidationError(
        "maxTokens must be a positive integer when provided.",
        request.id,
        "options.maxTokens",
      );
    }
  }

  if (options?.stream != null && typeof options.stream !== "boolean") {
    throw new GatewayValidationError(
      "stream must be a boolean when provided.",
      request.id,
      "options.stream",
    );
  }
}

/** Applies gateway defaults and merges configuration into the request. */
export function normalizeGatewayRequest(
  request: LLMRequest,
  config: GatewayConfig,
): LLMRequest {
  const model = request.model?.trim()
    ? request.model.trim()
    : config.preferredModel ?? config.defaultModel;

  const options = resolveGatewayGenerationOptions(config, request.options);

  return {
    ...request,
    model,
    provider: request.provider ?? config.preferredProvider ?? config.defaultProvider,
    messages: request.messages.map((message) => ({
      ...message,
      content: message.content.trim(),
    })),
    options,
  };
}

function resolveGatewayGenerationOptions(
  config: GatewayConfig,
  overrides?: GenerationOptions,
): GenerationOptions {
  return {
    ...config.generation,
    ...overrides,
    stream: overrides?.stream ?? config.streaming,
  };
}

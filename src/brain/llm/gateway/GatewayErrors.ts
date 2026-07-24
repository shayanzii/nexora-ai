import { LLMError } from "../errors/llm-errors";

/** Gateway-specific validation failure. */
export class GatewayValidationError extends LLMError {
  constructor(message: string, requestId?: string, field?: string) {
    super(message, {
      code: "VALIDATION_ERROR",
      requestId,
      retryable: false,
      metadata: field ? { field } : undefined,
    });
    this.name = "GatewayValidationError";
  }
}

/** Gateway routing failure when no viable provider is available. */
export class GatewayRoutingError extends LLMError {
  constructor(message: string, providerId?: string, requestId?: string) {
    super(message, {
      code: "PROVIDER_NOT_FOUND",
      providerId,
      requestId,
      retryable: false,
      metadata: { layer: "gateway" },
    });
    this.name = "GatewayRoutingError";
  }
}

/** Wraps provider failures with gateway context for observability. */
export function propagateGatewayError(
  error: unknown,
  context: { requestId?: string; providerId?: string; modelId?: string },
): LLMError {
  if (error instanceof LLMError) {
    return error;
  }

  const cause = error instanceof Error ? error.message : String(error);
  return new LLMError("LLM gateway request failed.", {
    code: "GENERATION_FAILED",
    providerId: context.providerId,
    modelId: context.modelId,
    requestId: context.requestId,
    cause,
    retryable: false,
    metadata: { layer: "gateway" },
  });
}

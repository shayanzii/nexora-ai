/** Error codes for programmatic handling across the LLM layer. */
export type LLMErrorCode =
  | "PROVIDER_NOT_FOUND"
  | "MODEL_NOT_SUPPORTED"
  | "CAPABILITY_NOT_SUPPORTED"
  | "GENERATION_FAILED"
  | "STREAM_FAILED"
  | "HEALTH_CHECK_FAILED"
  | "TIMEOUT"
  | "RATE_LIMITED"
  | "CONFIGURATION_ERROR"
  | "VALIDATION_ERROR";

/** Structured error payload attached to LLM layer failures. */
export interface LLMErrorDetails {
  code: LLMErrorCode;
  providerId?: string;
  modelId?: string;
  requestId?: string;
  cause?: string;
  retryable?: boolean;
  metadata?: Readonly<Record<string, unknown>>;
}

/** Base error for all LLM gateway failures. */
export class LLMError extends Error {
  readonly code: LLMErrorCode;
  readonly providerId?: string;
  readonly modelId?: string;
  readonly requestId?: string;
  readonly retryable: boolean;
  readonly metadata?: Readonly<Record<string, unknown>>;

  constructor(message: string, details: LLMErrorDetails) {
    super(message);
    this.name = "LLMError";
    this.code = details.code;
    this.providerId = details.providerId;
    this.modelId = details.modelId;
    this.requestId = details.requestId;
    this.retryable = details.retryable ?? false;
    this.metadata = details.metadata;
  }
}

export class LLMProviderNotFoundError extends LLMError {
  constructor(providerId: string) {
    super(`LLM provider '${providerId}' is not registered.`, {
      code: "PROVIDER_NOT_FOUND",
      providerId,
      retryable: false,
    });
    this.name = "LLMProviderNotFoundError";
  }
}

export class LLMModelNotSupportedError extends LLMError {
  constructor(providerId: string, modelId: string) {
    super(`Model '${modelId}' is not supported by provider '${providerId}'.`, {
      code: "MODEL_NOT_SUPPORTED",
      providerId,
      modelId,
      retryable: false,
    });
    this.name = "LLMModelNotSupportedError";
  }
}

export class LLMCapabilityNotSupportedError extends LLMError {
  constructor(providerId: string, capability: string, modelId?: string) {
    super(
      `Capability '${capability}' is not supported${modelId ? ` for model '${modelId}'` : ""} by provider '${providerId}'.`,
      {
        code: "CAPABILITY_NOT_SUPPORTED",
        providerId,
        modelId,
        retryable: false,
        metadata: { capability },
      },
    );
    this.name = "LLMCapabilityNotSupportedError";
  }
}

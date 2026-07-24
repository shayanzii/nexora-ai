import OpenAI from "openai";

import { LLMError } from "../../errors/llm-errors";
import { OPENAI_PROVIDER_ID } from "./OpenAIModels";

export interface OpenAIErrorContext {
  operation: "generate" | "stream" | "healthCheck";
  modelId?: string;
  requestId?: string;
}

/** Maps OpenAI SDK errors into canonical LLM layer errors. */
export function mapOpenAIError(
  error: unknown,
  context: OpenAIErrorContext,
): LLMError {
  if (error instanceof LLMError) {
    return error;
  }

  if (error instanceof OpenAI.AuthenticationError) {
    return new LLMError("OpenAI authentication failed. Check OPENAI_API_KEY.", {
      code: "CONFIGURATION_ERROR",
      providerId: OPENAI_PROVIDER_ID,
      modelId: context.modelId,
      requestId: context.requestId,
      cause: error.message,
      retryable: false,
      metadata: { operation: context.operation, status: error.status },
    });
  }

  if (error instanceof OpenAI.RateLimitError) {
    return new LLMError("OpenAI rate limit exceeded.", {
      code: "RATE_LIMITED",
      providerId: OPENAI_PROVIDER_ID,
      modelId: context.modelId,
      requestId: context.requestId,
      cause: error.message,
      retryable: true,
      metadata: { operation: context.operation, status: error.status },
    });
  }

  if (error instanceof OpenAI.APIUserAbortError) {
    return new LLMError("OpenAI request timed out.", {
      code: "TIMEOUT",
      providerId: OPENAI_PROVIDER_ID,
      modelId: context.modelId,
      requestId: context.requestId,
      cause: error.message,
      retryable: true,
      metadata: { operation: context.operation },
    });
  }

  if (error instanceof OpenAI.APIConnectionError) {
    return new LLMError("OpenAI network connection failed.", {
      code: context.operation === "stream" ? "STREAM_FAILED" : "GENERATION_FAILED",
      providerId: OPENAI_PROVIDER_ID,
      modelId: context.modelId,
      requestId: context.requestId,
      cause: error.message,
      retryable: true,
      metadata: { operation: context.operation },
    });
  }

  if (error instanceof OpenAI.BadRequestError) {
    return new LLMError("Invalid OpenAI request.", {
      code: "VALIDATION_ERROR",
      providerId: OPENAI_PROVIDER_ID,
      modelId: context.modelId,
      requestId: context.requestId,
      cause: error.message,
      retryable: false,
      metadata: { operation: context.operation, status: error.status },
    });
  }

  if (error instanceof OpenAI.APIError) {
    const retryable = error.status != null && error.status >= 500;
    return new LLMError("OpenAI API request failed.", {
      code: context.operation === "stream" ? "STREAM_FAILED" : "GENERATION_FAILED",
      providerId: OPENAI_PROVIDER_ID,
      modelId: context.modelId,
      requestId: context.requestId,
      cause: error.message,
      retryable,
      metadata: { operation: context.operation, status: error.status },
    });
  }

  const cause = error instanceof Error ? error.message : String(error);
  return new LLMError("Unexpected OpenAI provider error.", {
    code: context.operation === "healthCheck"
      ? "HEALTH_CHECK_FAILED"
      : context.operation === "stream"
        ? "STREAM_FAILED"
        : "GENERATION_FAILED",
    providerId: OPENAI_PROVIDER_ID,
    modelId: context.modelId,
    requestId: context.requestId,
    cause,
    retryable: false,
    metadata: { operation: context.operation },
  });
}

export function configurationError(
  message: string,
  context: OpenAIErrorContext,
): LLMError {
  return new LLMError(message, {
    code: "CONFIGURATION_ERROR",
    providerId: OPENAI_PROVIDER_ID,
    modelId: context.modelId,
    requestId: context.requestId,
    retryable: false,
    metadata: { operation: context.operation },
  });
}

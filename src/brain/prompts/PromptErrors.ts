/** Error codes for programmatic handling across the prompt engine. */
export type PromptErrorCode =
  | "PROMPT_NOT_FOUND"
  | "INVALID_PROMPT_ID"
  | "INVALID_TEMPLATE"
  | "MISSING_VARIABLE"
  | "INVALID_VERSION"
  | "VALIDATION_FAILED";

/** Structured error payload for prompt engine failures. */
export interface PromptErrorDetails {
  code: PromptErrorCode;
  promptId?: string;
  version?: string;
  variable?: string;
  missingVariables?: readonly string[];
  metadata?: Readonly<Record<string, unknown>>;
}

/** Base error for all prompt engine failures. */
export class PromptError extends Error {
  readonly code: PromptErrorCode;
  readonly promptId?: string;
  readonly version?: string;
  readonly metadata?: Readonly<Record<string, unknown>>;

  constructor(message: string, details: PromptErrorDetails) {
    super(message);
    this.name = "PromptError";
    this.code = details.code;
    this.promptId = details.promptId;
    this.version = details.version;
    this.metadata = details.metadata;
  }
}

export class PromptNotFoundError extends PromptError {
  constructor(promptId: string, version?: string) {
    super(
      version
        ? `Prompt '${promptId}' version '${version}' was not found.`
        : `Prompt '${promptId}' was not found.`,
      {
        code: "PROMPT_NOT_FOUND",
        promptId,
        version,
      },
    );
    this.name = "PromptNotFoundError";
  }
}

export class PromptValidationError extends PromptError {
  constructor(message: string, promptId?: string, metadata?: Record<string, unknown>) {
    super(message, {
      code: "VALIDATION_FAILED",
      promptId,
      metadata,
    });
    this.name = "PromptValidationError";
  }
}

export class PromptRenderError extends PromptError {
  constructor(
    message: string,
    promptId: string,
    missingVariables: readonly string[] = [],
  ) {
    super(message, {
      code: "MISSING_VARIABLE",
      promptId,
      missingVariables,
      metadata: { missingVariables },
    });
    this.name = "PromptRenderError";
  }
}

export class InvalidPromptIdError extends PromptError {
  constructor(promptId: string) {
    super(`Invalid prompt id '${promptId}'.`, {
      code: "INVALID_PROMPT_ID",
      promptId,
    });
    this.name = "InvalidPromptIdError";
  }
}

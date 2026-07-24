/** Error codes for the Website Execution Agent. */
export type WebsiteExecutionErrorCode =
  | "VALIDATION_ERROR"
  | "PLANNING_ERROR"
  | "MISSING_WEBSITE_TASK";

export class WebsiteExecutionError extends Error {
  constructor(
    message: string,
    readonly code: WebsiteExecutionErrorCode,
    readonly details?: Readonly<Record<string, unknown>>,
  ) {
    super(message);
    this.name = "WebsiteExecutionError";
  }
}

export class WebsiteExecutionValidationError extends WebsiteExecutionError {
  constructor(message: string, details?: Readonly<Record<string, unknown>>) {
    super(message, "VALIDATION_ERROR", details);
    this.name = "WebsiteExecutionValidationError";
  }
}

export class WebsiteExecutionPlanningError extends WebsiteExecutionError {
  constructor(message: string, details?: Readonly<Record<string, unknown>>) {
    super(message, "PLANNING_ERROR", details);
    this.name = "WebsiteExecutionPlanningError";
  }
}

export class WebsiteTaskNotFoundError extends WebsiteExecutionError {
  constructor() {
    super("Project execution plan does not include a website department task.", "MISSING_WEBSITE_TASK");
    this.name = "WebsiteTaskNotFoundError";
  }
}

/** Error severity for department failures. */
export type DepartmentErrorSeverity = "low" | "medium" | "high" | "critical";

/** Error codes for programmatic handling. */
export type DepartmentErrorCode =
  | "VALIDATION_FAILED"
  | "PLANNER_FAILED"
  | "EXECUTION_FAILED"
  | "KNOWLEDGE_UNAVAILABLE"
  | "DEPARTMENT_ERROR"
  | "CONTEXT_BUILD_FAILED"
  | "LIFECYCLE_ABORTED";

/** Structured error payload attached to department errors. */
export interface DepartmentErrorDetails {
  code: DepartmentErrorCode;
  severity: DepartmentErrorSeverity;
  departmentId?: string;
  step?: string;
  field?: string;
  cause?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Base error for all department SDK errors.
 */
export class DepartmentError extends Error {
  readonly code: DepartmentErrorCode;
  readonly severity: DepartmentErrorSeverity;
  readonly departmentId?: string;
  readonly step?: string;
  readonly field?: string;
  readonly metadata?: Record<string, unknown>;

  constructor(message: string, details: DepartmentErrorDetails) {
    super(message);
    this.name = "DepartmentError";
    this.code = details.code;
    this.severity = details.severity;
    this.departmentId = details.departmentId;
    this.step = details.step;
    this.field = details.field;
    this.metadata = details.metadata;
  }

  toJSON(): DepartmentErrorDetails & { message: string; name: string } {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      severity: this.severity,
      departmentId: this.departmentId,
      step: this.step,
      field: this.field,
      metadata: this.metadata,
    };
  }
}

export class ValidationError extends DepartmentError {
  constructor(message: string, details: Omit<DepartmentErrorDetails, "code">) {
    super(message, { ...details, code: "VALIDATION_FAILED" });
    this.name = "ValidationError";
  }
}

export class PlannerError extends DepartmentError {
  constructor(message: string, details: Omit<DepartmentErrorDetails, "code">) {
    super(message, { ...details, code: "PLANNER_FAILED" });
    this.name = "PlannerError";
  }
}

export class ExecutionError extends DepartmentError {
  constructor(message: string, details: Omit<DepartmentErrorDetails, "code">) {
    super(message, { ...details, code: "EXECUTION_FAILED" });
    this.name = "ExecutionError";
  }
}

export class KnowledgeError extends DepartmentError {
  constructor(message: string, details: Omit<DepartmentErrorDetails, "code">) {
    super(message, { ...details, code: "KNOWLEDGE_UNAVAILABLE" });
    this.name = "KnowledgeError";
  }
}

export class ContextBuildError extends DepartmentError {
  constructor(message: string, details: Omit<DepartmentErrorDetails, "code">) {
    super(message, { ...details, code: "CONTEXT_BUILD_FAILED" });
    this.name = "ContextBuildError";
  }
}

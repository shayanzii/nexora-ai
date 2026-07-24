/** Error codes for the Sales Agent department. */
export type SalesErrorCode =
  | "VALIDATION_ERROR"
  | "TASK_NOT_FOUND"
  | "WRONG_DEPARTMENT"
  | "PROPOSAL_ERROR";

export class SalesError extends Error {
  constructor(
    message: string,
    readonly code: SalesErrorCode,
    readonly details?: Readonly<Record<string, unknown>>,
  ) {
    super(message);
    this.name = "SalesError";
  }
}

export class SalesValidationError extends SalesError {
  constructor(message: string, details?: Readonly<Record<string, unknown>>) {
    super(message, "VALIDATION_ERROR", details);
    this.name = "SalesValidationError";
  }
}

export class SalesTaskNotFoundError extends SalesError {
  constructor(taskId: string) {
    super(`Sales task '${taskId}' was not found in the execution plan.`, "TASK_NOT_FOUND", {
      taskId,
    });
    this.name = "SalesTaskNotFoundError";
  }
}

export class SalesWrongDepartmentError extends SalesError {
  constructor(taskId: string, department: string) {
    super(
      `Task '${taskId}' belongs to department '${department}', not sales.`,
      "WRONG_DEPARTMENT",
      { taskId, department },
    );
    this.name = "SalesWrongDepartmentError";
  }
}

export class SalesProposalError extends SalesError {
  constructor(message: string, details?: Readonly<Record<string, unknown>>) {
    super(message, "PROPOSAL_ERROR", details);
    this.name = "SalesProposalError";
  }
}

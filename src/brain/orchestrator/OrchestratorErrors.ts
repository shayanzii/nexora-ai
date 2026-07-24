/** Error codes for orchestrator failures. */
export type OrchestratorErrorCode =
  | "INVALID_INPUT"
  | "DEPARTMENT_NOT_FOUND"
  | "CYCLIC_DEPENDENCY"
  | "TASK_NOT_FOUND"
  | "SCHEDULING_FAILED"
  | "PLANNING_FAILED";

/** Base error for orchestrator layer failures. */
export class OrchestratorError extends Error {
  readonly code: OrchestratorErrorCode;
  readonly metadata?: Readonly<Record<string, unknown>>;

  constructor(
    message: string,
    code: OrchestratorErrorCode,
    metadata?: Readonly<Record<string, unknown>>,
  ) {
    super(message);
    this.name = "OrchestratorError";
    this.code = code;
    this.metadata = metadata;
  }
}

export class OrchestratorValidationError extends OrchestratorError {
  constructor(message: string, metadata?: Readonly<Record<string, unknown>>) {
    super(message, "INVALID_INPUT", metadata);
    this.name = "OrchestratorValidationError";
  }
}

export class CyclicDependencyError extends OrchestratorError {
  constructor(message: string, metadata?: Readonly<Record<string, unknown>>) {
    super(message, "CYCLIC_DEPENDENCY", metadata);
    this.name = "CyclicDependencyError";
  }
}

export class TaskNotFoundError extends OrchestratorError {
  constructor(taskId: string) {
    super(`Orchestrator task '${taskId}' was not found.`, "TASK_NOT_FOUND", { taskId });
    this.name = "TaskNotFoundError";
  }
}

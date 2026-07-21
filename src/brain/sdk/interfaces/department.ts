import type { DepartmentContext } from "../context/department-context";
import type { DepartmentTelemetry } from "../telemetry/types";
import type { ValidationReport } from "../validation/types";
import type { DepartmentError } from "./errors";

/** Confidence level for department output quality. */
export type DepartmentConfidence = "low" | "medium" | "high";

/** Execution options passed to department lifecycle. */
export interface DepartmentExecutionOptions {
  /** Abort execution when validation produces errors. Default true. */
  stopOnValidationError?: boolean;
  /** Collect per-planner telemetry. Default true. */
  collectTelemetry?: boolean;
  /** Arbitrary runtime options for downstream planners. */
  runtime?: Record<string, unknown>;
}

/** Human-readable summary produced after execution. */
export interface DepartmentSummary {
  departmentId: string;
  requestId: string;
  headline: string;
  nextStep: string;
  warnings: string[];
  confidence: DepartmentConfidence;
}

/**
 * Standard result wrapper returned by department lifecycle.
 */
export interface DepartmentRunResult<TResult> {
  departmentId: string;
  requestId: string;
  success: boolean;
  status: "complete" | "partial" | "failed";
  result?: TResult;
  summary?: DepartmentSummary;
  validation: ValidationReport;
  telemetry: DepartmentTelemetry;
  error?: DepartmentError;
}

/**
 * Generic department contract.
 * All current and future departments should implement this interface.
 */
export interface Department<TRequest = unknown, TResult = unknown> {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly version: string;

  /** Validates incoming request before execution. */
  validate(request: TRequest): ValidationReport;

  /** Builds immutable department context from request. */
  buildContext(
    request: TRequest,
    options?: DepartmentExecutionOptions,
  ): DepartmentContext;

  /** Executes department business logic. */
  execute(context: DepartmentContext, request: TRequest): Promise<TResult>;

  /** Produces human-readable summary from result. */
  summarize(context: DepartmentContext, result: TResult): DepartmentSummary;

  /**
   * Runs the full lifecycle:
   * Validate → Build Context → Execute → Summarize → Telemetry → Return
   */
  run(
    request: TRequest,
    options?: DepartmentExecutionOptions,
  ): Promise<DepartmentRunResult<TResult>>;
}

/** Metadata registered alongside a department instance. */
export interface DepartmentRegistration<TRequest = unknown, TResult = unknown> {
  department: Department<TRequest, TResult>;
  tags: string[];
  supportedTaskTypes: string[];
  priority: number;
}

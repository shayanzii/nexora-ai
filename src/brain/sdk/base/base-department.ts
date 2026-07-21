import type {
  Department,
  DepartmentExecutionOptions,
  DepartmentRunResult,
  DepartmentSummary,
} from "../interfaces/department";
import {
  DepartmentError,
  ExecutionError,
  ValidationError,
} from "../interfaces/errors";
import {
  buildDepartmentContext,
  resolveRequestId,
  type BuildDepartmentContextParams,
  type DepartmentContext,
} from "../context/department-context";
import { TelemetryCollector } from "../telemetry/collector";
import type { ValidationReport } from "../validation/types";
import { emptyValidationReport } from "../validation/validator";

/**
 * Abstract base class for Nexora Brain departments.
 * Implements the standard lifecycle; subclasses provide business logic only.
 */
export abstract class BaseDepartment<TRequest = unknown, TResult = unknown>
  implements Department<TRequest, TResult>
{
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly description: string;
  readonly version: string = "1.0.0";

  /** Override to provide request validation rules. */
  protected abstract validateRequest(request: TRequest): ValidationReport;

  /** Override to map request into context build parameters. */
  protected abstract createContextParams(
    request: TRequest,
    options?: DepartmentExecutionOptions,
  ): BuildDepartmentContextParams;

  /** Core business logic — implemented by each department. */
  protected abstract executeDepartment(
    context: DepartmentContext,
    request: TRequest,
  ): Promise<TResult>;

  /** Builds summary from execution result. */
  protected abstract buildSummary(
    context: DepartmentContext,
    result: TResult,
  ): DepartmentSummary;

  validate(request: TRequest): ValidationReport {
    return this.validateRequest(request);
  }

  buildContext(
    request: TRequest,
    options?: DepartmentExecutionOptions,
  ): DepartmentContext {
    const params = this.createContextParams(request, options);
    return buildDepartmentContext(params);
  }

  async execute(context: DepartmentContext, request: TRequest): Promise<TResult> {
    return this.executeDepartment(context, request);
  }

  summarize(context: DepartmentContext, result: TResult): DepartmentSummary {
    return this.buildSummary(context, result);
  }

  /**
   * Standard lifecycle:
   * Validate → Build Context → Execute → Summarize → Telemetry → Return
   */
  async run(
    request: TRequest,
    options: DepartmentExecutionOptions = {},
  ): Promise<DepartmentRunResult<TResult>> {
    const stopOnValidationError = options.stopOnValidationError ?? true;
    const collectTelemetry = options.collectTelemetry ?? true;

    const requestId = this.extractRequestId(request);
    const telemetry = new TelemetryCollector(this.id, requestId);

    let validation: ValidationReport = emptyValidationReport();

    // ── Validate ──────────────────────────────────────────────────────
    const validateStart = Date.now();
    try {
      validation = this.validate(request);
      for (const warning of validation.warnings) {
        telemetry.addWarning(warning.message);
      }
      telemetry.recordLifecycleStep("validate", validateStart, validation.valid);

      if (!validation.valid && stopOnValidationError) {
        const error = new ValidationError(
          validation.errors[0]?.message ?? "Validation failed.",
          {
            severity: "high",
            departmentId: this.id,
            step: "validate",
            field: validation.errors[0]?.field,
          },
        );
        telemetry.recordFailure("validate", error.message, error.code);
        return this.buildRunResult({
          requestId,
          success: false,
          status: "failed",
          validation,
          telemetry: telemetry.complete(false),
          error,
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Validation error.";
      telemetry.recordLifecycleStep("validate", validateStart, false, message);
      telemetry.recordFailure("validate", message);
      return this.buildRunResult({
        requestId,
        success: false,
        status: "failed",
        validation,
        telemetry: telemetry.complete(false),
        error:
          error instanceof DepartmentError
            ? error
            : new ValidationError(message, {
                severity: "high",
                departmentId: this.id,
                step: "validate",
              }),
      });
    }

    // ── Build Context ─────────────────────────────────────────────────
    const contextStart = Date.now();
    let context: DepartmentContext;
    try {
      context = this.buildContext(request, options);
      telemetry.recordLifecycleStep("build-context", contextStart, true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Context build failed.";
      telemetry.recordLifecycleStep("build-context", contextStart, false, message);
      telemetry.recordFailure("build-context", message);
      return this.buildRunResult({
        requestId,
        success: false,
        status: "failed",
        validation,
        telemetry: telemetry.complete(false),
        error:
          error instanceof DepartmentError
            ? error
            : new ExecutionError(message, {
                severity: "high",
                departmentId: this.id,
                step: "build-context",
              }),
      });
    }

    // ── Execute ───────────────────────────────────────────────────────
    const executeStart = Date.now();
    try {
      const result = await this.execute(context, request);
      telemetry.recordLifecycleStep("execute", executeStart, true);

      // ── Summarize ───────────────────────────────────────────────────
      const summarizeStart = Date.now();
      const summary = this.summarize(context, result);
      telemetry.recordLifecycleStep("summarize", summarizeStart, true);

      if (!collectTelemetry) {
        telemetry.recordLifecycleStep("telemetry", Date.now(), true, "skipped");
      }

      const hasWarnings = validation.warnings.length > 0;
      return this.buildRunResult({
        requestId,
        success: true,
        status: hasWarnings ? "partial" : "complete",
        result,
        summary,
        validation,
        telemetry: telemetry.complete(true),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Execution failed.";
      telemetry.recordLifecycleStep("execute", executeStart, false, message);
      telemetry.recordFailure("execute", message);

      return this.buildRunResult({
        requestId,
        success: false,
        status: "failed",
        validation,
        telemetry: telemetry.complete(false),
        error:
          error instanceof DepartmentError
            ? error
            : new ExecutionError(message, {
                severity: "high",
                departmentId: this.id,
                step: "execute",
              }),
      });
    }
  }

  /** Exposes telemetry collector helper for sub-planners. */
  protected createTelemetry(requestId: string): TelemetryCollector {
    return new TelemetryCollector(this.id, requestId);
  }

  /** Override when request carries requestId in a custom shape. */
  protected extractRequestId(request: TRequest): string {
    if (
      request !== null &&
      typeof request === "object" &&
      "requestId" in request &&
      typeof (request as { requestId: unknown }).requestId === "string"
    ) {
      return (request as { requestId: string }).requestId;
    }
    return resolveRequestId(undefined);
  }

  private buildRunResult(params: {
    requestId: string;
    success: boolean;
    status: DepartmentRunResult<TResult>["status"];
    result?: TResult;
    summary?: DepartmentSummary;
    validation: ValidationReport;
    telemetry: ReturnType<TelemetryCollector["complete"]>;
    error?: DepartmentError;
  }): DepartmentRunResult<TResult> {
    return {
      departmentId: this.id,
      requestId: params.requestId,
      success: params.success,
      status: params.status,
      result: params.result,
      summary: params.summary,
      validation: params.validation,
      telemetry: params.telemetry,
      error: params.error,
    };
  }
}

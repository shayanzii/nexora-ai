import type {
  DepartmentTelemetry,
  StepTiming,
  TelemetryFailure,
} from "./types";

/**
 * In-process telemetry collector for department lifecycle runs.
 * No external providers — internal diagnostics only.
 */
export class TelemetryCollector {
  private readonly departmentId: string;
  private readonly requestId: string;
  private readonly startedAt: string;
  private readonly lifecycleSteps: StepTiming[] = [];
  private readonly plannerTimings: StepTiming[] = [];
  private readonly warnings: string[] = [];
  private readonly failures: TelemetryFailure[] = [];
  private completedAt: string | null = null;

  constructor(departmentId: string, requestId: string) {
    this.departmentId = departmentId;
    this.requestId = requestId;
    this.startedAt = new Date().toISOString();
  }

  /** Records a lifecycle step timing. */
  recordLifecycleStep(
    step: string,
    startedAtMs: number,
    success: boolean,
    message?: string,
  ): void {
    const completedAtMs = Date.now();
    this.lifecycleSteps.push({
      step,
      startedAt: new Date(startedAtMs).toISOString(),
      completedAt: new Date(completedAtMs).toISOString(),
      durationMs: completedAtMs - startedAtMs,
      success,
      message,
    });
  }

  /** Records a planner/sub-engine timing. */
  recordPlannerTiming(
    plannerId: string,
    startedAtMs: number,
    success: boolean,
    message?: string,
  ): void {
    const completedAtMs = Date.now();
    this.plannerTimings.push({
      step: plannerId,
      startedAt: new Date(startedAtMs).toISOString(),
      completedAt: new Date(completedAtMs).toISOString(),
      durationMs: completedAtMs - startedAtMs,
      success,
      message,
    });
  }

  addWarning(message: string): void {
    this.warnings.push(message);
  }

  recordFailure(step: string, message: string, code?: string): void {
    this.failures.push({
      step,
      message,
      code,
      timestamp: new Date().toISOString(),
    });
  }

  complete(success: boolean): DepartmentTelemetry {
    this.completedAt = new Date().toISOString();
    const completedMs = Date.parse(this.completedAt);

    return {
      departmentId: this.departmentId,
      requestId: this.requestId,
      startedAt: this.startedAt,
      completedAt: this.completedAt,
      totalDurationMs: completedMs - Date.parse(this.startedAt),
      lifecycleSteps: [...this.lifecycleSteps],
      plannerTimings: [...this.plannerTimings],
      warnings: [...this.warnings],
      failures: [...this.failures],
      success,
    };
  }

  /** Wraps a planner call with automatic timing. */
  async trackPlanner<T>(
    plannerId: string,
    fn: () => Promise<T>,
  ): Promise<T> {
    const start = Date.now();
    try {
      const result = await fn();
      this.recordPlannerTiming(plannerId, start, true);
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Planner failed.";
      this.recordPlannerTiming(plannerId, start, false, message);
      throw error;
    }
  }
}

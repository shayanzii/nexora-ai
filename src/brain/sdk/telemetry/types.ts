/** Lifecycle step identifiers for telemetry. */
export type DepartmentLifecycleStep =
  | "validate"
  | "build-context"
  | "execute"
  | "summarize"
  | "telemetry";

/** Timing record for a lifecycle step or planner. */
export interface StepTiming {
  step: string;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  success: boolean;
  message?: string;
}

/** Failure record captured during department execution. */
export interface TelemetryFailure {
  step: string;
  message: string;
  code?: string;
  timestamp: string;
}

/** Complete telemetry snapshot for a department run. */
export interface DepartmentTelemetry {
  departmentId: string;
  requestId: string;
  startedAt: string;
  completedAt: string;
  totalDurationMs: number;
  lifecycleSteps: StepTiming[];
  plannerTimings: StepTiming[];
  warnings: string[];
  failures: TelemetryFailure[];
  success: boolean;
}

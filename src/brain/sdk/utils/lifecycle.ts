import type {
  Department,
  DepartmentExecutionOptions,
  DepartmentRunResult,
} from "../interfaces/department";

/**
 * Executes a department through its standard lifecycle.
 * Convenience wrapper around Department.run().
 */
export async function runDepartmentLifecycle<TRequest, TResult>(
  department: Department<TRequest, TResult>,
  request: TRequest,
  options?: DepartmentExecutionOptions,
): Promise<DepartmentRunResult<TResult>> {
  return department.run(request, options);
}

/** Returns lifecycle step names in execution order. */
export function getLifecycleSteps(): readonly string[] {
  return ["validate", "build-context", "execute", "summarize", "telemetry"] as const;
}

/** Maps validation confidence to department summary confidence. */
export function mapValidationConfidence(
  score: number,
): "low" | "medium" | "high" {
  if (score >= 75) return "high";
  if (score >= 45) return "medium";
  return "low";
}

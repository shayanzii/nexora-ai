/** Lifecycle states for orchestrator tasks. */
export type TaskStatus =
  | "pending"
  | "ready"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export const TASK_STATUSES: readonly TaskStatus[] = [
  "pending",
  "ready",
  "running",
  "completed",
  "failed",
  "cancelled",
];

/** Returns true when a task status is terminal. */
export function isTerminalTaskStatus(status: TaskStatus): boolean {
  return status === "completed" || status === "failed" || status === "cancelled";
}

/** Returns true when a task can be scheduled for execution. */
export function isExecutableTaskStatus(status: TaskStatus): boolean {
  return status === "ready" || status === "running";
}

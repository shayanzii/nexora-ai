import type { AgentResult } from "./project";

export type ExecutionStatus = "pending" | "running" | "completed" | "failed";

/**
 * Execution mode for the runtime engine.
 * Parallel mode is reserved for future DAG-based execution.
 */
export type ExecutionMode = "sequential" | "parallel";

/**
 * Merged outcome of a full project plan execution.
 */
export interface ExecutionResult {
  requestId: string;
  status: ExecutionStatus;
  mode: ExecutionMode;
  agentResults: AgentResult[];
  mergedOutput: Record<string, unknown>;
  tasksCompleted: number;
  tasksTotal: number;
  startedAt: string;
  completedAt: string;
  failedTaskId?: string;
  error?: string;
}

/**
 * A task waiting in the execution queue.
 */
export interface QueuedTask {
  sequence: number;
  taskId: string;
  taskType: string;
  agentId: string;
  description: string;
}

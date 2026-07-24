import type { TaskStatus } from "./TaskStatus";

/** Priority levels for orchestrator tasks. */
export type TaskPriority = "critical" | "high" | "medium" | "low";

export const TASK_PRIORITIES: readonly TaskPriority[] = [
  "critical",
  "high",
  "medium",
  "low",
];

/** Numeric sort weight — lower runs sooner within the same dependency wave. */
export const TASK_PRIORITY_WEIGHT: Record<TaskPriority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

/** Department work unit managed by the orchestrator. */
export interface OrchestratorTask {
  id: string;
  department: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dependencies: readonly string[];
  estimatedDuration: number;
  createdAt: string;
  metadata?: Readonly<Record<string, unknown>>;
}

/** Input required to create orchestrator tasks. */
export interface TaskCreationInput {
  requestId: string;
  department: string;
  title: string;
  description: string;
  priority?: TaskPriority;
  dependencies?: readonly string[];
  estimatedDuration?: number;
  metadata?: Readonly<Record<string, unknown>>;
}

/** Creates a new orchestrator task with defaults. */
export function createOrchestratorTask(input: TaskCreationInput): OrchestratorTask {
  return {
    id: `${input.requestId}-${input.department}-${slugify(input.title)}`,
    department: input.department,
    title: input.title,
    description: input.description,
    priority: input.priority ?? "medium",
    status: "pending",
    dependencies: input.dependencies ?? [],
    estimatedDuration: input.estimatedDuration ?? 8,
    createdAt: new Date().toISOString(),
    metadata: input.metadata,
  };
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

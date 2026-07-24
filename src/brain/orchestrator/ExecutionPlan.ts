import type { OrchestratorTask } from "./TaskTypes";

/** Graph node representing a department stage in the execution plan. */
export interface ExecutionGraphNode {
  id: string;
  department: string;
  taskIds: readonly string[];
}

/** Directed edge between department stages or tasks. */
export interface ExecutionGraphEdge {
  from: string;
  to: string;
}

/** Dependency graph describing department and task ordering. */
export interface ExecutionGraph {
  nodes: readonly ExecutionGraphNode[];
  edges: readonly ExecutionGraphEdge[];
}

/** Full project execution plan produced by the orchestrator. */
export interface ProjectExecutionPlan {
  requestId: string;
  business: string;
  industry: string;
  goals: readonly string[];
  departments: readonly string[];
  departmentOrder: readonly string[];
  tasks: readonly OrchestratorTask[];
  executionGraph: ExecutionGraph;
  estimatedTotalDuration: number;
  summary: string;
  createdAt: string;
  metadata?: Readonly<Record<string, unknown>>;
}

/** Computes total estimated duration along the department order (conservative sequential estimate). */
export function estimateCriticalPathDuration(
  tasks: readonly OrchestratorTask[],
  departmentOrder: readonly string[],
): number {
  const taskByDept = new Map<string, OrchestratorTask>();
  for (const task of tasks) {
    taskByDept.set(task.department, task);
  }

  return departmentOrder.reduce((total, department) => {
    const task = taskByDept.get(department);
    return total + (task?.estimatedDuration ?? 0);
  }, 0);
}

/** Builds a human-readable execution chain (e.g. Sales → Website → QA). */
export function formatDepartmentChain(departments: readonly string[]): string {
  return departments
    .map((department) => department.charAt(0).toUpperCase() + department.slice(1))
    .join(" → ");
}

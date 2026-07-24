import { CyclicDependencyError } from "./OrchestratorErrors";
import type { OrchestratorTask } from "./TaskTypes";
import type { TaskStatus } from "./TaskStatus";

/** Returns true when all dependency tasks are completed. */
export function areDependenciesMet(
  task: OrchestratorTask,
  tasksById: ReadonlyMap<string, OrchestratorTask>,
): boolean {
  return task.dependencies.every((dependencyId) => {
    const dependency = tasksById.get(dependencyId);
    return dependency?.status === "completed";
  });
}

/** Topologically sorts tasks — throws on cycles. */
export function sortTasksByDependencies(tasks: readonly OrchestratorTask[]): OrchestratorTask[] {
  const taskMap = new Map(tasks.map((task) => [task.id, task]));
  const visited = new Set<string>();
  const visiting = new Set<string>();
  const sorted: OrchestratorTask[] = [];

  const visit = (taskId: string): void => {
    if (visited.has(taskId)) return;
    if (visiting.has(taskId)) {
      throw new CyclicDependencyError(`Cyclic dependency detected at task '${taskId}'.`, {
        taskId,
      });
    }

    visiting.add(taskId);
    const task = taskMap.get(taskId);
    if (task) {
      for (const dependencyId of task.dependencies) {
        visit(dependencyId);
      }
    }
    visiting.delete(taskId);
    visited.add(taskId);
    if (task) sorted.push(task);
  };

  for (const task of tasks) {
    visit(task.id);
  }

  return sorted;
}

/** Assigns initial pending/ready statuses based on dependency satisfaction. */
export function assignInitialTaskStatuses(tasks: readonly OrchestratorTask[]): OrchestratorTask[] {
  const taskMap = new Map(tasks.map((task) => [task.id, { ...task }]));

  for (const task of taskMap.values()) {
    task.status = resolveReadyStatus(task, taskMap);
  }

  return [...taskMap.values()];
}

/** Returns tasks that are ready to run. */
export function getReadyTasks(tasks: readonly OrchestratorTask[]): OrchestratorTask[] {
  const taskMap = new Map(tasks.map((task) => [task.id, task]));
  return tasks.filter((task) => task.status === "ready" && areDependenciesMet(task, taskMap));
}

/** Produces department order from scheduled tasks. */
export function deriveDepartmentOrder(tasks: readonly OrchestratorTask[]): string[] {
  const sorted = sortTasksByDependencies(tasks);
  const seen = new Set<string>();
  const order: string[] = [];

  for (const task of sorted) {
    if (!seen.has(task.department)) {
      seen.add(task.department);
      order.push(task.department);
    }
  }

  return order;
}

function resolveReadyStatus(
  task: OrchestratorTask,
  tasksById: ReadonlyMap<string, OrchestratorTask>,
): TaskStatus {
  if (task.dependencies.length === 0) {
    return "ready";
  }

  return areDependenciesMet(task, tasksById) ? "ready" : "pending";
}

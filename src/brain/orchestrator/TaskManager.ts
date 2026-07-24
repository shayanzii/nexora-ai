import { TaskNotFoundError } from "./OrchestratorErrors";
import type { OrchestratorTask, TaskPriority } from "./TaskTypes";
import type { TaskStatus } from "./TaskStatus";
import { assignInitialTaskStatuses, getReadyTasks } from "./TaskScheduler";

export interface TaskManagerLogEvent {
  level: "info" | "error";
  action: "create" | "schedule" | "update" | "summary";
  taskId?: string;
  department?: string;
  message: string;
}

export type TaskManagerLogger = (event: TaskManagerLogEvent) => void;

/** Manages orchestrator task lifecycle and status transitions. */
export class TaskManager {
  private tasks: OrchestratorTask[];
  private readonly logger: TaskManagerLogger;

  constructor(tasks: readonly OrchestratorTask[], logger: TaskManagerLogger = defaultLogger) {
    this.tasks = assignInitialTaskStatuses(tasks);
    this.logger = logger;
    this.logCreatedTasks();
  }

  getTasks(): readonly OrchestratorTask[] {
    return this.tasks;
  }

  getTask(taskId: string): OrchestratorTask {
    const task = this.tasks.find((entry) => entry.id === taskId);
    if (!task) {
      throw new TaskNotFoundError(taskId);
    }
    return task;
  }

  getReadyTasks(): OrchestratorTask[] {
    return getReadyTasks(this.tasks);
  }

  updateStatus(taskId: string, status: TaskStatus): OrchestratorTask {
    const index = this.tasks.findIndex((task) => task.id === taskId);
    if (index < 0) {
      throw new TaskNotFoundError(taskId);
    }

    this.tasks[index] = { ...this.tasks[index], status };
    this.refreshReadyStates();
    this.logger({
      level: "info",
      action: "update",
      taskId,
      department: this.tasks[index].department,
      message: `Task status updated to ${status}.`,
    });
    return this.tasks[index];
  }

  markCompleted(taskId: string): OrchestratorTask {
    return this.updateStatus(taskId, "completed");
  }

  getSummary(): {
    total: number;
    byStatus: Record<TaskStatus, number>;
    byDepartment: Record<string, number>;
    ready: number;
  } {
    const byStatus = Object.fromEntries(
      (["pending", "ready", "running", "completed", "failed", "cancelled"] as TaskStatus[]).map(
        (status) => [status, 0],
      ),
    ) as Record<TaskStatus, number>;

    const byDepartment: Record<string, number> = {};

    for (const task of this.tasks) {
      byStatus[task.status] += 1;
      byDepartment[task.department] = (byDepartment[task.department] ?? 0) + 1;
    }

    const summary = {
      total: this.tasks.length,
      byStatus,
      byDepartment,
      ready: byStatus.ready,
    };

    this.logger({
      level: "info",
      action: "summary",
      message: `Task summary: ${summary.total} total, ${summary.ready} ready.`,
    });

    return summary;
  }

  sortByPriority(): OrchestratorTask[] {
    const priorityWeight: Record<TaskPriority, number> = {
      critical: 0,
      high: 1,
      medium: 2,
      low: 3,
    };

    return [...this.tasks].sort(
      (a, b) => priorityWeight[a.priority] - priorityWeight[b.priority],
    );
  }

  private refreshReadyStates(): void {
    const taskMap = new Map(this.tasks.map((task) => [task.id, task]));
    this.tasks = this.tasks.map((task) => {
      if (task.status !== "pending") {
        return task;
      }

      const depsMet = task.dependencies.every(
        (depId) => taskMap.get(depId)?.status === "completed",
      );
      return depsMet ? { ...task, status: "ready" } : task;
    });
  }

  private logCreatedTasks(): void {
    for (const task of this.tasks) {
      this.logger({
        level: "info",
        action: "create",
        taskId: task.id,
        department: task.department,
        message: `Created task '${task.title}' (${task.status}).`,
      });
    }
  }
}

function defaultLogger(event: TaskManagerLogEvent): void {
  console.info(
    "[orchestrator:tasks]",
    JSON.stringify({ ...event, timestamp: new Date().toISOString() }),
  );
}

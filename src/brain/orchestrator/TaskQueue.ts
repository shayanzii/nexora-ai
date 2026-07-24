import type { OrchestratorTask } from "./TaskTypes";
import { getReadyTasks, sortTasksByDependencies } from "./TaskScheduler";

/** FIFO queue for orchestrator tasks respecting dependency order. */
export class TaskQueue {
  private readonly items: OrchestratorTask[];
  private cursor = 0;

  constructor(tasks: readonly OrchestratorTask[]) {
    this.items = sortTasksByDependencies([...tasks]);
  }

  /** Returns tasks currently ready for execution. */
  getReady(): OrchestratorTask[] {
    return getReadyTasks(this.items);
  }

  /** Dequeues the next ready task in priority order. */
  dequeueReady(): OrchestratorTask | undefined {
    const ready = this.getReady();
    if (ready.length === 0) {
      return undefined;
    }

    const next = ready[0];
    const index = this.items.findIndex((task) => task.id === next.id);
    if (index >= 0) {
      this.items[index] = { ...this.items[index], status: "running" };
    }
    return next;
  }

  peek(): OrchestratorTask | undefined {
    return this.getReady()[0];
  }

  isEmpty(): boolean {
    return this.getReady().length === 0;
  }

  remaining(): number {
    return this.items.filter((task) => task.status !== "completed").length;
  }

  size(): number {
    return this.items.length;
  }

  getAll(): readonly OrchestratorTask[] {
    return this.items;
  }

  resetCursor(): void {
    this.cursor = 0;
  }

  /** @deprecated Sequential cursor — prefer getReady() for dependency-aware scheduling. */
  dequeue(): OrchestratorTask | undefined {
    if (this.cursor >= this.items.length) {
      return undefined;
    }
    const item = this.items[this.cursor];
    this.cursor += 1;
    return item;
  }
}

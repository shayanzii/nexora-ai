import type { AgentRegistry } from "../registry/agent-registry";
import type { QueuedTask } from "../types/execution";
import type { AgentTask, ProjectPlan } from "../types/project";

export interface TaskQueueOptions {
  /** When true, tasks are ordered strictly by plan.executionOrder agent grouping. */
  respectAgentOrder?: boolean;
}

/**
 * FIFO task queue built from a ProjectPlan.
 * Tasks are ordered by priority; agent assignment comes from the plan or registry.
 */
export class TaskQueue {
  private readonly items: QueuedTask[];
  private cursor = 0;

  constructor(items: QueuedTask[]) {
    this.items = items;
  }

  static fromPlan(
    plan: ProjectPlan,
    registry: AgentRegistry,
    options: TaskQueueOptions = {},
  ): TaskQueue {
    const taskAgentMap = buildTaskAgentMap(plan, registry);
    const sortedTasks = sortTasksForExecution(plan.tasks, plan.executionOrder, options);

    const items: QueuedTask[] = [];

    for (const task of sortedTasks) {
      const agentId = taskAgentMap.get(task.id);

      if (!agentId) {
        continue;
      }

      items.push({
        sequence: items.length,
        taskId: task.id,
        taskType: task.type,
        agentId,
        description: task.description,
      });
    }

    return new TaskQueue(items);
  }

  enqueue(item: QueuedTask): void {
    this.items.push({ ...item, sequence: this.items.length });
  }

  dequeue(): QueuedTask | undefined {
    if (this.isEmpty()) {
      return undefined;
    }

    const item = this.items[this.cursor];
    this.cursor += 1;
    return item;
  }

  peek(): QueuedTask | undefined {
    return this.items[this.cursor];
  }

  isEmpty(): boolean {
    return this.cursor >= this.items.length;
  }

  remaining(): number {
    return Math.max(0, this.items.length - this.cursor);
  }

  size(): number {
    return this.items.length;
  }

  /** Returns all queued tasks (including already dequeued). */
  getAll(): readonly QueuedTask[] {
    return this.items;
  }

  /** Resets cursor for re-execution. */
  reset(): void {
    this.cursor = 0;
  }
}

function buildTaskAgentMap(
  plan: ProjectPlan,
  registry: AgentRegistry,
): Map<string, string> {
  const map = new Map<string, string>();

  for (const assignment of plan.assignedAgents) {
    for (const taskId of assignment.taskIds) {
      map.set(taskId, assignment.agentId);
    }
  }

  for (const task of plan.tasks) {
    if (map.has(task.id)) {
      continue;
    }

    const agent = registry.findCompatibleAgents(task)[0];
    if (agent) {
      map.set(task.id, agent.id);
    }
  }

  return map;
}

function sortTasksForExecution(
  tasks: AgentTask[],
  _executionOrder: string[],
  _options: TaskQueueOptions,
): AgentTask[] {
  return [...tasks].sort((a, b) => a.priority - b.priority);
}

/**
 * Groups tasks that could run in parallel in a future DAG executor.
 * Currently each group contains one task (sequential baseline).
 */
export function buildExecutionBatches(queue: TaskQueue): QueuedTask[][] {
  return queue.getAll().map((task) => [task]);
}

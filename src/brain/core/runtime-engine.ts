import { mergeAgentOutputs } from "./merge-outputs";
import { TaskQueue } from "./task-queue";
import { SharedMemory } from "../memory/shared-memory";
import type { AgentRegistry } from "../registry/agent-registry";
import { createProjectContext } from "../types/context";
import type {
  ExecutionMode,
  ExecutionResult,
  QueuedTask,
} from "../types/execution";
import type { AgentResult } from "../types/project";
import type { ProjectPlan } from "../types/project";

export interface RuntimeEngineOptions {
  /** Sequential is the default; parallel reserved for future DAG execution. */
  mode?: ExecutionMode;
  /** Stop processing the queue when an agent returns success: false. */
  stopOnFailure?: boolean;
}

const DEFAULT_OPTIONS: Required<RuntimeEngineOptions> = {
  mode: "sequential",
  stopOnFailure: true,
};

/**
 * Executes project plans by running agents against a shared task queue.
 */
export class RuntimeEngine {
  private readonly options: Required<RuntimeEngineOptions>;

  constructor(
    private readonly registry: AgentRegistry,
    options: RuntimeEngineOptions = {},
  ) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Executes all tasks in a plan and returns a merged ExecutionResult.
   */
  async execute(plan: ProjectPlan): Promise<ExecutionResult> {
    const queue = TaskQueue.fromPlan(plan, this.registry);
    const memory = new SharedMemory();
    const context = createProjectContext(plan, memory);

    return this.executeQueue(queue, context, plan);
  }

  /**
   * Executes a pre-built queue with shared context and memory.
   */
  async executeQueue(
    queue: TaskQueue,
    context: ReturnType<typeof createProjectContext>,
    plan: ProjectPlan,
  ): Promise<ExecutionResult> {
    const startedAt = new Date().toISOString();

    if (this.options.mode === "parallel") {
      return this.executeParallel(queue, context, plan, startedAt);
    }

    return this.executeSequential(queue, context, plan, startedAt);
  }

  getMode(): ExecutionMode {
    return this.options.mode;
  }

  private async executeSequential(
    queue: TaskQueue,
    context: ReturnType<typeof createProjectContext>,
    plan: ProjectPlan,
    startedAt: string,
  ): Promise<ExecutionResult> {
    const agentResults: AgentResult[] = [];
    let status: ExecutionResult["status"] = "running";
    let failedTaskId: string | undefined;
    let error: string | undefined;

    while (!queue.isEmpty()) {
      const queued = queue.dequeue()!;
      const result = await this.runTask(queued, context);

      context.memory.record(result);
      agentResults.push(result);

      if (!result.success && this.options.stopOnFailure) {
        status = "failed";
        failedTaskId = queued.taskId;
        error = result.message ?? `Task '${queued.taskType}' failed.`;
        break;
      }
    }

    if (status !== "failed") {
      status = agentResults.length === queue.size() ? "completed" : "failed";
      if (status === "failed" && !error) {
        error = "Not all queued tasks were executed.";
      }
    }

    return this.buildResult({
      plan,
      mode: "sequential",
      status,
      agentResults,
      startedAt,
      failedTaskId,
      error,
      tasksTotal: queue.size(),
    });
  }

  /**
   * Parallel execution placeholder — batches are currently size 1.
   * Extend with DAG dependency resolution for true parallelism.
   */
  private async executeParallel(
    queue: TaskQueue,
    context: ReturnType<typeof createProjectContext>,
    plan: ProjectPlan,
    startedAt: string,
  ): Promise<ExecutionResult> {
    const agentResults: AgentResult[] = [];
    const workingQueue = TaskQueue.fromPlan(plan, this.registry);
    workingQueue.reset();

    while (!workingQueue.isEmpty()) {
      const batch: QueuedTask[] = [];
      const next = workingQueue.dequeue();

      if (next) {
        batch.push(next);
      }

      const batchResults = await Promise.all(
        batch.map((queued) => this.runTask(queued, context)),
      );

      for (const result of batchResults) {
        context.memory.record(result);
        agentResults.push(result);
      }

      const failed = batchResults.find((r) => !r.success);
      if (failed && this.options.stopOnFailure) {
        return this.buildResult({
          plan,
          mode: "parallel",
          status: "failed",
          agentResults,
          startedAt,
          failedTaskId: failed.taskId,
          error: failed.message ?? "Parallel batch task failed.",
          tasksTotal: queue.size(),
        });
      }
    }

    return this.buildResult({
      plan,
      mode: "parallel",
      status: "completed",
      agentResults,
      startedAt,
      tasksTotal: queue.size(),
    });
  }

  private async runTask(
    queued: QueuedTask,
    context: ReturnType<typeof createProjectContext>,
  ): Promise<AgentResult> {
    const agent = this.registry.get(queued.agentId);
    const task = context.plan.tasks.find((t) => t.id === queued.taskId);

    if (!agent) {
      return {
        agentId: queued.agentId,
        taskId: queued.taskId,
        success: false,
        output: {},
        message: `Agent '${queued.agentId}' is not registered.`,
      };
    }

    if (!task) {
      return {
        agentId: queued.agentId,
        taskId: queued.taskId,
        success: false,
        output: {},
        message: `Task '${queued.taskId}' was not found in the plan.`,
      };
    }

    if (!agent.canHandle(task)) {
      return {
        agentId: queued.agentId,
        taskId: queued.taskId,
        success: false,
        output: {},
        message: `Agent '${queued.agentId}' cannot handle task type '${task.type}'.`,
      };
    }

    try {
      return await agent.execute(task, context);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected execution error.";
      return {
        agentId: queued.agentId,
        taskId: queued.taskId,
        success: false,
        output: {},
        message,
      };
    }
  }

  private buildResult(params: {
    plan: ProjectPlan;
    mode: ExecutionMode;
    status: ExecutionResult["status"];
    agentResults: AgentResult[];
    startedAt: string;
    failedTaskId?: string;
    error?: string;
    tasksTotal: number;
  }): ExecutionResult {
    return {
      requestId: params.plan.requestId,
      status: params.status,
      mode: params.mode,
      agentResults: params.agentResults,
      mergedOutput: mergeAgentOutputs(params.agentResults, params.plan.tasks),
      tasksCompleted: params.agentResults.filter((r) => r.success).length,
      tasksTotal: params.tasksTotal,
      startedAt: params.startedAt,
      completedAt: new Date().toISOString(),
      failedTaskId: params.failedTaskId,
      error: params.error,
    };
  }
}

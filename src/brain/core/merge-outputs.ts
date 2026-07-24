import type { AgentResult, AgentTask } from "../types/project";

/**
 * Merges individual agent outputs into a single project-level result object.
 */
export function mergeAgentOutputs(
  results: AgentResult[],
  tasks: AgentTask[] = [],
): Record<string, unknown> {
  const typeByTaskId = new Map(tasks.map((task) => [task.id, task.type]));
  const tasksOutput: Record<string, unknown> = {};
  const byAgent: Record<string, unknown[]> = {};
  const byType: Record<string, unknown> = {};

  for (const result of results) {
    const taskType = typeByTaskId.get(result.taskId);

    tasksOutput[result.taskId] = {
      success: result.success,
      output: result.output,
      message: result.message,
      agentId: result.agentId,
      taskType,
    };

    if (!byAgent[result.agentId]) {
      byAgent[result.agentId] = [];
    }

    byAgent[result.agentId].push({
      taskId: result.taskId,
      taskType,
      success: result.success,
      output: result.output,
      message: result.message,
    });

    if (taskType) {
      byType[taskType] = result.output;
    }
  }

  const allSuccessful = results.length > 0 && results.every((r) => r.success);

  return {
    summary: {
      totalTasks: results.length,
      successfulTasks: results.filter((r) => r.success).length,
      allSuccessful,
    },
    tasks: tasksOutput,
    byAgent,
    byType,
  };
}

import type { Agent, AgentContext } from "../types/agent";
import type { AgentResult, AgentTask } from "../types/project";

/**
 * Abstract base class providing common agent utilities.
 * Extend this when creating new specialist agents.
 */
export abstract class BaseAgent implements Agent {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly description: string;

  abstract canHandle(task: AgentTask): boolean;
  abstract execute(task: AgentTask, context: AgentContext): Promise<AgentResult>;

  protected success(
    task: AgentTask,
    output: Record<string, unknown>,
    message?: string,
  ): AgentResult {
    return {
      agentId: this.id,
      taskId: task.id,
      success: true,
      output,
      message,
    };
  }

  protected failure(task: AgentTask, message: string): AgentResult {
    return {
      agentId: this.id,
      taskId: task.id,
      success: false,
      output: {},
      message,
    };
  }
}

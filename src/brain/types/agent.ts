import type { AgentResult, AgentTask, ProjectRequest } from "./project";

/**
 * Shared context passed to agents during task execution.
 */
export interface AgentContext {
  request: ProjectRequest;
  requestId: string;
}

/**
 * Contract every Nexora Brain agent must fulfill.
 */
export interface Agent {
  readonly id: string;
  readonly name: string;
  readonly description: string;

  /** Returns true when this agent is capable of handling the given task. */
  canHandle(task: AgentTask): boolean;

  /** Executes a single task and returns structured output. */
  execute(task: AgentTask, context: AgentContext): Promise<AgentResult>;
}

/**
 * Optional metadata describing agent capabilities for registry lookups.
 */
export interface AgentCapability {
  agentId: string;
  tags: string[];
  supportedTaskTypes: string[];
  supportedServices: string[];
}

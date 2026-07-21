/**
 * Incoming project brief from clients or internal systems.
 */
export interface ProjectRequest {
  industry: string;
  goal: string;
  budget: number;
  services: string[];
  metadata?: Record<string, unknown>;
}

export type ComplexityLevel = "low" | "medium" | "high" | "enterprise";

export type NextActionType =
  | "review_plan"
  | "execute_task"
  | "await_input"
  | "complete";

/**
 * Describes the immediate step the orchestrator should take.
 */
export interface NextAction {
  type: NextActionType;
  agentId?: string;
  taskId?: string;
  description: string;
}

/**
 * Unit of work assigned to a single agent.
 */
export interface AgentTask {
  id: string;
  type: string;
  description: string;
  requiredCapabilities: string[];
  priority: number;
  service?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Outcome returned after an agent executes a task.
 */
export interface AgentResult {
  agentId: string;
  taskId: string;
  success: boolean;
  output: Record<string, unknown>;
  message?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Agent assignment within a project plan.
 */
export interface AssignedAgent {
  agentId: string;
  agentName: string;
  role: string;
  taskIds: string[];
}

/**
 * Full orchestration plan produced by the WorkflowEngine.
 */
export interface ProjectPlan {
  requestId: string;
  industry: string;
  goal: string;
  budget: number;
  services: string[];
  /** Client discovery metadata propagated from ProjectRequest. */
  metadata?: Record<string, unknown>;
  assignedAgents: AssignedAgent[];
  executionOrder: string[];
  tasks: AgentTask[];
  estimatedComplexity: ComplexityLevel;
  complexityScore: number;
  nextAction: NextAction;
  summary: string;
  createdAt: string;
}

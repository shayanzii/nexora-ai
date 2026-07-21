import { randomUUID } from "crypto";

import { CEOAgent } from "../agents/ceo-agent";
import { estimateComplexity } from "./complexity-estimator";
import type { AgentRegistry } from "../registry/agent-registry";
import type {
  AssignedAgent,
  NextAction,
  ProjectPlan,
  ProjectRequest,
} from "../types/project";

/**
 * Orchestrates project requests through the CEO Agent and registry.
 */
export class WorkflowEngine {
  private readonly ceoAgent: CEOAgent;

  constructor(private readonly registry: AgentRegistry) {
    this.ceoAgent = new CEOAgent(registry);
  }

  /**
   * Processes a project request and returns a full execution plan.
   */
  plan(request: ProjectRequest, requestId: string = randomUUID()): ProjectPlan {
    const analysis = this.ceoAgent.analyze(request, requestId);
    const complexity = estimateComplexity(request);
    const assignedAgents = this.buildAssignedAgents(analysis.executionOrder, analysis.tasks);
    const nextAction = this.buildNextAction(analysis.executionOrder, analysis.tasks);

    return {
      requestId,
      industry: request.industry,
      goal: request.goal,
      budget: request.budget,
      services: request.services,
      metadata: request.metadata,
      assignedAgents,
      executionOrder: analysis.executionOrder,
      tasks: analysis.tasks,
      estimatedComplexity: complexity.level,
      complexityScore: complexity.score,
      nextAction,
      summary: analysis.summary,
      createdAt: new Date().toISOString(),
    };
  }

  getCEOAgent(): CEOAgent {
    return this.ceoAgent;
  }

  private buildAssignedAgents(
    executionOrder: string[],
    tasks: ProjectPlan["tasks"],
  ): AssignedAgent[] {
    return executionOrder
      .map((agentId) => {
        const agent = this.registry.get(agentId);
        if (!agent) return null;

        const taskIds = tasks
          .filter((task) => agent.canHandle(task))
          .map((task) => task.id);

        return {
          agentId: agent.id,
          agentName: agent.name,
          role: agent.description,
          taskIds,
        };
      })
      .filter((entry): entry is AssignedAgent => entry !== null);
  }

  private buildNextAction(
    executionOrder: string[],
    tasks: ProjectPlan["tasks"],
  ): NextAction {
    const firstAgentId = executionOrder[0];

    if (!firstAgentId) {
      return {
        type: "complete",
        description: "No agents available for this request.",
      };
    }

    const firstAgent = this.registry.get(firstAgentId);
    const firstTask = tasks.find((task) => firstAgent?.canHandle(task));

    if (!firstTask) {
      return {
        type: "review_plan",
        description: "Review the generated plan before execution.",
      };
    }

    return {
      type: "execute_task",
      agentId: firstAgentId,
      taskId: firstTask.id,
      description: `Execute '${firstTask.type}' with ${firstAgent?.name ?? firstAgentId}.`,
    };
  }
}

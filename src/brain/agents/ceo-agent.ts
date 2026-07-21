import { randomUUID } from "crypto";

import type { AgentRegistry } from "../registry/agent-registry";
import {
  AGENT_CAPABILITIES,
  CEO_AGENT_ID,
  SERVICE_CAPABILITY_MAP,
} from "../prompts/ceo-analysis";
import type { CEOAnalysis } from "../prompts/ceo-analysis";
import { getKnowledgeRegistry } from "../knowledge";
import { BaseAgent } from "./base-agent";
import type { AgentContext } from "../types/agent";
import type { AgentTask, ProjectRequest } from "../types/project";

/**
 * CEO Agent — orchestrates specialist agents without generating deliverables.
 */
export class CEOAgent extends BaseAgent {
  readonly id = CEO_AGENT_ID;
  readonly name = "CEO Agent";
  readonly description =
    "Receives project requests, analyzes requirements, selects agents, and builds execution plans.";

  constructor(private readonly registry: AgentRegistry) {
    super();
  }

  canHandle(task: AgentTask): boolean {
    return task.type === "orchestrate_project";
  }

  async execute(task: AgentTask, context: AgentContext) {
    const analysis = this.analyze(context.request, context.requestId);

    return this.success(task, {
      analysis,
      assignedAgentIds: analysis.recommendedAgentIds,
      executionOrder: analysis.executionOrder,
      taskCount: analysis.tasks.length,
    }, "Project analysis and execution plan created.");
  }

  /**
   * Analyzes a project request and returns a structured orchestration plan.
   */
  analyze(request: ProjectRequest, requestId: string = randomUUID()): CEOAnalysis {
    const serviceCapabilities = this.mapServiceCapabilities(request.services);
    const requiredCapabilities = this.collectRequiredCapabilities(serviceCapabilities);
    const complexityFactors = this.identifyComplexityFactors(request);
    const tasks = this.buildTasks(request, requestId);
    const recommendedAgentIds = this.selectAgents(tasks);
    const executionOrder = this.buildExecutionOrder(recommendedAgentIds, tasks);

    return {
      requestId,
      request,
      requiredCapabilities,
      serviceCapabilities,
      complexityFactors,
      recommendedAgentIds,
      tasks,
      executionOrder,
      summary: this.buildSummary(request, recommendedAgentIds, complexityFactors),
    };
  }

  private mapServiceCapabilities(services: string[]): Record<string, string[]> {
    return Object.fromEntries(
      services.map((service) => [
        service,
        SERVICE_CAPABILITY_MAP[service] ?? ["general-planning"],
      ]),
    );
  }

  private collectRequiredCapabilities(
    serviceCapabilities: Record<string, string[]>,
  ): string[] {
    return [...new Set(Object.values(serviceCapabilities).flat())];
  }

  private identifyComplexityFactors(request: ProjectRequest): string[] {
    const factors: string[] = [];

    if (request.services.length >= 4) {
      factors.push("Multi-service scope");
    }

    if (request.budget >= 5000) {
      factors.push("High budget engagement");
    } else if (request.budget < 1000) {
      factors.push("Constrained budget");
    }

    if (getKnowledgeRegistry().isRegulatedIndustry(request.industry)) {
      factors.push("Regulated industry compliance considerations");
    }

    const unknownServices = request.services.filter((s) => !(s in SERVICE_CAPABILITY_MAP));
    if (unknownServices.length > 0) {
      factors.push(`Custom services: ${unknownServices.join(", ")}`);
    }

    if (factors.length === 0) {
      factors.push("Standard scope");
    }

    return factors;
  }

  private buildTasks(request: ProjectRequest, requestId: string): AgentTask[] {
    const tasks: AgentTask[] = [
      {
        id: `${requestId}-task-sales`,
        type: "qualify_client",
        description: `Run Sales Department qualification for ${request.industry}: ${request.goal}`,
        requiredCapabilities: ["sales", "qualification", "discovery", "department"],
        priority: 0,
      },
      {
        id: `${requestId}-task-requirements`,
        type: "analyze_requirements",
        description: `Analyze requirements for ${request.industry}: ${request.goal}`,
        requiredCapabilities: ["analysis", "discovery"],
        priority: 1,
      },
      {
        id: `${requestId}-task-budget`,
        type: "validate_budget",
        description: `Validate budget of $${request.budget} against requested services`,
        requiredCapabilities: ["budget", "scoping"],
        priority: 2,
      },
    ];

    request.services.forEach((service, index) => {
      tasks.push({
        id: `${requestId}-task-service-${service}`,
        type: "plan_service",
        description: `Architect delivery plan for '${service}' service`,
        requiredCapabilities: SERVICE_CAPABILITY_MAP[service] ?? ["general-planning"],
        priority: 3 + index,
        service,
      });
    });

    tasks.push({
      id: `${requestId}-task-delivery`,
      type: "plan_delivery",
      description: "Sequence delivery milestones and define handoff plan",
      requiredCapabilities: ["delivery", "timeline"],
      priority: 100,
    });

    return tasks;
  }

  private selectAgents(tasks: AgentTask[]): string[] {
    const agentIds = new Set<string>();

    for (const task of tasks) {
      const compatible = this.registry.findCompatibleAgents(task);
      for (const agent of compatible) {
        agentIds.add(agent.id);
      }
    }

    return [...agentIds];
  }

  private buildExecutionOrder(agentIds: string[], tasks: AgentTask[]): string[] {
    const taskAgentMap = new Map<string, string>();

    for (const task of tasks) {
      const agent = this.registry.findCompatibleAgents(task)[0];
      if (agent) {
        taskAgentMap.set(task.id, agent.id);
      }
    }

    const orderedAgentIds: string[] = [];
    const sortedTasks = [...tasks].sort((a, b) => a.priority - b.priority);

    for (const task of sortedTasks) {
      const agentId = taskAgentMap.get(task.id);
      if (agentId && !orderedAgentIds.includes(agentId)) {
        orderedAgentIds.push(agentId);
      }
    }

    for (const agentId of agentIds) {
      if (!orderedAgentIds.includes(agentId)) {
        orderedAgentIds.push(agentId);
      }
    }

    return orderedAgentIds;
  }

  private buildSummary(
    request: ProjectRequest,
    agentIds: string[],
    complexityFactors: string[],
  ): string {
    const agentNames = agentIds
      .map((id) => this.registry.get(id)?.name ?? id)
      .join(", ");

    return (
      `Orchestration plan for ${request.industry} project targeting "${request.goal}" ` +
      `with services [${request.services.join(", ")}]. ` +
      `Assigned agents: ${agentNames}. ` +
      `Complexity factors: ${complexityFactors.join("; ")}.`
    );
  }

  /** Returns capability metadata for all registered specialist agents. */
  getCapabilityCatalog() {
    return AGENT_CAPABILITIES;
  }
}

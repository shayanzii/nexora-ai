import { randomUUID } from "crypto";

import { BaseAgent } from "../../base-agent";
import { SharedMemory } from "../../../memory/shared-memory";
import { createProjectContext } from "../../../types/context";
import type { Agent } from "../../../types/agent";
import type { AgentContext } from "../../../types/agent";
import type { ProjectContext } from "../../../types/context";
import type { AgentResult, AgentTask, ProjectPlan } from "../../../types/project";
import type {
  BusinessAnalysisOutput,
  SalesDepartmentAgents,
  SalesDepartmentResult,
  SalesDepartmentStepResult,
} from "../../../types/sales";
import {
  SALES_DEPARTMENT_ID,
  SALES_TASK_TYPE,
} from "../../../types/sales";
import { shouldRequireFollowUp } from "../shared/follow-up";
import {
  BUSINESS_ANALYSIS_AGENT_ID,
  DISCOVERY_AGENT_ID,
  FOLLOW_UP_AGENT_ID,
  LEAD_QUALIFICATION_AGENT_ID,
  PRICING_AGENT_ID,
  PROPOSAL_ENGINE_AGENT_ID,
  SALES_BUSINESS_ANALYSIS_TASK,
  SALES_DISCOVERY_TASK,
  SALES_FOLLOW_UP_TASK,
  SALES_LEAD_QUALIFICATION_TASK,
  SALES_PRICING_TASK,
  SALES_PROPOSAL_ENGINE_TASK,
} from "../shared/constants";
import { BusinessAnalysisAgent } from "./business-analysis-agent";
import { DiscoveryAgent } from "./discovery-agent";
import { FollowUpAgent } from "./follow-up-agent";
import { LeadQualificationAgent } from "./lead-qualification-agent";
import { PricingAgent } from "./pricing-agent";
import { ProposalEngineAgent } from "./proposal-engine-agent";
import type {
  DiscoveryOutput,
  FollowUpOutput,
  LeadQualificationOutput,
  PricingOutput,
  ProposalEngineOutput,
} from "../../../types/sales";

export interface SalesDepartmentOptions {
  agents?: Partial<SalesDepartmentAgents>;
}

interface PipelineStep {
  agentId: string;
  taskType: string;
  description: string;
  skipWhen?: (lead: LeadQualificationOutput | undefined) => boolean;
}

const QUALIFIED_PIPELINE: PipelineStep[] = [
  {
    agentId: LEAD_QUALIFICATION_AGENT_ID,
    taskType: SALES_LEAD_QUALIFICATION_TASK,
    description: "Validate required client fields",
  },
  {
    agentId: DISCOVERY_AGENT_ID,
    taskType: SALES_DISCOVERY_TASK,
    description: "Perform business discovery",
    skipWhen: (lead) => !lead?.isQualified,
  },
  {
    agentId: BUSINESS_ANALYSIS_AGENT_ID,
    taskType: SALES_BUSINESS_ANALYSIS_TASK,
    description: "Perform business analysis and scope outline",
    skipWhen: (lead) => !lead?.isQualified,
  },
  {
    agentId: PRICING_AGENT_ID,
    taskType: SALES_PRICING_TASK,
    description: "Estimate pricing and risks",
    skipWhen: (lead) => !lead?.isQualified,
  },
  {
    agentId: PROPOSAL_ENGINE_AGENT_ID,
    taskType: SALES_PROPOSAL_ENGINE_TASK,
    description: "Generate structured proposal document",
    skipWhen: (lead) => !lead?.isQualified,
  },
];

/**
 * Sales Department — orchestrates lead qualification through proposal generation.
 * Registered as a single agent in the main AgentRegistry.
 */
export class SalesDepartment extends BaseAgent {
  readonly id = SALES_DEPARTMENT_ID;
  readonly name = "Sales Department";
  readonly description =
    "Orchestrates lead qualification, discovery, business analysis, pricing, proposal engine, and follow-up.";

  private readonly agents: SalesDepartmentAgents;

  constructor(options: SalesDepartmentOptions = {}) {
    super();
    this.agents = {
      leadQualification:
        options.agents?.leadQualification ?? new LeadQualificationAgent(),
      discovery: options.agents?.discovery ?? new DiscoveryAgent(),
      businessAnalysis:
        options.agents?.businessAnalysis ??
        options.agents?.proposal ??
        new BusinessAnalysisAgent(),
      pricing: options.agents?.pricing ?? new PricingAgent(),
      proposalEngine: options.agents?.proposalEngine ?? new ProposalEngineAgent(),
      followUp: options.agents?.followUp ?? new FollowUpAgent(),
    };
  }

  canHandle(task: AgentTask): boolean {
    return task.type === SALES_TASK_TYPE;
  }

  async execute(task: AgentTask, context: AgentContext): Promise<AgentResult> {
    const projectContext = this.ensureProjectContext(context, task);
    const departmentResult = await this.runDepartment(task, projectContext);

    return this.success(
      task,
      departmentResult as unknown as Record<string, unknown>,
      departmentResult.summary,
    );
  }

  /**
   * Runs the full sales pipeline and returns a unified department result.
   */
  async runDepartment(
    parentTask: AgentTask,
    context: ProjectContext,
  ): Promise<SalesDepartmentResult> {
    const stepResults: SalesDepartmentStepResult[] = [];
    const stepsExecuted: string[] = [];
    const stepsSkipped: string[] = [];

    let leadOutput: LeadQualificationOutput | undefined;
    let discoveryOutput: DiscoveryOutput | undefined;
    let businessAnalysisOutput: BusinessAnalysisOutput | undefined;
    let pricingOutput: PricingOutput | undefined;
    let proposalEngineOutput: ProposalEngineOutput | undefined;
    let followUpOutput: FollowUpOutput | undefined;

    for (const step of QUALIFIED_PIPELINE) {
      if (step.skipWhen?.(leadOutput)) {
        stepsSkipped.push(step.agentId);
        continue;
      }

      const agent = this.getAgent(step.agentId);
      const subTask = this.createSubTask(parentTask, step.taskType, step.description);
      const result = await agent.execute(subTask, context);

      context.memory.record(result);
      stepResults.push(this.toStepResult(agent, step.taskType, result));
      stepsExecuted.push(step.agentId);

      if (step.agentId === LEAD_QUALIFICATION_AGENT_ID) {
        leadOutput = result.output as unknown as LeadQualificationOutput;
        if (!leadOutput.isQualified) {
          break;
        }
      }

      if (step.agentId === DISCOVERY_AGENT_ID) {
        discoveryOutput = result.output as unknown as DiscoveryOutput;
      }

      if (step.agentId === BUSINESS_ANALYSIS_AGENT_ID) {
        businessAnalysisOutput = result.output as unknown as BusinessAnalysisOutput;
      }

      if (step.agentId === PRICING_AGENT_ID) {
        pricingOutput = result.output as unknown as PricingOutput;
      }

      if (step.agentId === PROPOSAL_ENGINE_AGENT_ID) {
        proposalEngineOutput = result.output as unknown as ProposalEngineOutput;
      }

      if (!result.success) {
        break;
      }
    }

    const needsFollowUp = shouldRequireFollowUp({
      needsClarification: !leadOutput?.isQualified,
      clarificationQuestions: leadOutput?.clarificationQuestions,
      budgetAligned: pricingOutput?.budgetAligned,
      projectRisks: pricingOutput?.projectRisks,
    });

    if (needsFollowUp) {
      const followUpAgent = this.agents.followUp;
      const subTask = this.createSubTask(
        parentTask,
        SALES_FOLLOW_UP_TASK,
        "Generate follow-up actions",
      );
      const result = await followUpAgent.execute(subTask, context);

      context.memory.record(result);
      stepResults.push(this.toStepResult(followUpAgent, SALES_FOLLOW_UP_TASK, result));
      stepsExecuted.push(FOLLOW_UP_AGENT_ID);
      followUpOutput = result.output as unknown as FollowUpOutput;
    } else {
      stepsSkipped.push(FOLLOW_UP_AGENT_ID);
    }

    const status = leadOutput?.isQualified ? "qualified" : "needs_clarification";

    return {
      departmentId: this.id,
      status,
      stepsExecuted,
      stepsSkipped,
      stepResults,
      completenessScore: leadOutput?.completenessScore ?? 0,
      fieldsPresent: leadOutput?.fieldsPresent ?? [],
      fieldsMissing: leadOutput?.fieldsMissing ?? [],
      clarificationQuestions: leadOutput?.clarificationQuestions,
      leadQualification: leadOutput,
      discovery: discoveryOutput,
      proposal: businessAnalysisOutput,
      businessAnalysis: businessAnalysisOutput,
      pricing: pricingOutput,
      proposalDocument: proposalEngineOutput?.proposal,
      followUp: followUpOutput,
      summary: this.buildSummary(status, leadOutput, proposalEngineOutput, followUpOutput),
      nextStep: this.buildNextStep(
        status,
        businessAnalysisOutput,
        followUpOutput,
        pricingOutput,
        proposalEngineOutput,
      ),
    };
  }

  getAgents(): SalesDepartmentAgents {
    return this.agents;
  }

  private getAgent(agentId: string): Agent {
    switch (agentId) {
      case LEAD_QUALIFICATION_AGENT_ID:
        return this.agents.leadQualification;
      case DISCOVERY_AGENT_ID:
        return this.agents.discovery;
      case BUSINESS_ANALYSIS_AGENT_ID:
        return this.agents.businessAnalysis;
      case PRICING_AGENT_ID:
        return this.agents.pricing;
      case PROPOSAL_ENGINE_AGENT_ID:
        return this.agents.proposalEngine;
      case FOLLOW_UP_AGENT_ID:
        return this.agents.followUp;
      default:
        throw new Error(`Unknown sales department agent: ${agentId}`);
    }
  }

  private ensureProjectContext(context: AgentContext, task: AgentTask): ProjectContext {
    if ("memory" in context && "plan" in context) {
      return context as ProjectContext;
    }

    const memory = new SharedMemory();
    const plan = this.buildMinimalPlan(context, task);

    return createProjectContext(plan, memory);
  }

  private buildMinimalPlan(context: AgentContext, task: AgentTask): ProjectPlan {
    const { request, requestId } = context;

    return {
      requestId,
      industry: request.industry,
      goal: request.goal,
      budget: request.budget,
      services: request.services,
      metadata: request.metadata,
      assignedAgents: [],
      executionOrder: [this.id],
      tasks: [task],
      estimatedComplexity: "low",
      complexityScore: 0,
      nextAction: {
        type: "execute_task",
        agentId: this.id,
        taskId: task.id,
        description: "Execute sales department pipeline",
      },
      summary: "Minimal plan for sales department execution",
      createdAt: new Date().toISOString(),
    };
  }

  private createSubTask(
    parentTask: AgentTask,
    taskType: string,
    description: string,
  ): AgentTask {
    return {
      id: `${parentTask.id}-${taskType}-${randomUUID().slice(0, 8)}`,
      type: taskType,
      description,
      requiredCapabilities: [],
      priority: parentTask.priority,
    };
  }

  private toStepResult(
    agent: Agent,
    taskType: string,
    result: AgentResult,
  ): SalesDepartmentStepResult {
    return {
      agentId: agent.id,
      agentName: agent.name,
      taskType,
      success: result.success,
      output: result.output,
      message: result.message,
    };
  }

  private buildSummary(
    status: SalesDepartmentResult["status"],
    lead?: LeadQualificationOutput,
    proposalEngine?: ProposalEngineOutput,
    followUp?: FollowUpOutput,
  ): string {
    if (status === "needs_clarification") {
      return (
        `Sales Department: ${lead?.fieldsMissing.length ?? 0} required field(s) missing. ` +
        `${followUp?.actions.length ?? 0} follow-up action(s) defined.`
      );
    }

    const proposalNote = proposalEngine?.proposal
      ? ` Proposal ${proposalEngine.proposal.id} generated.`
      : "";

    return (
      `Sales Department: Client qualified at ${lead?.completenessScore ?? 0}% completeness.` +
      proposalNote +
      (followUp ? ` Follow-up: ${followUp.summary}` : "")
    );
  }

  private buildNextStep(
    status: SalesDepartmentResult["status"],
    businessAnalysis?: BusinessAnalysisOutput,
    followUp?: FollowUpOutput,
    pricing?: PricingOutput,
    proposalEngine?: ProposalEngineOutput,
  ): string {
    if (status === "needs_clarification") {
      return followUp?.actions[0] ?? "Collect missing client information.";
    }

    if (pricing && !pricing.budgetAligned) {
      return "Review scope and budget alignment with the client.";
    }

    if (proposalEngine?.proposal) {
      return proposalEngine.proposal.nextSteps[0] ?? "Review generated proposal with client.";
    }

    return businessAnalysis?.nextStep ?? "Proceed to requirements analysis.";
  }
}

/** @deprecated Use SalesDepartment */
export { SalesDepartment as SalesAgent };

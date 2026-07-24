import { ProposalEngine } from "../../../departments/sales/proposal";
import { BaseAgent } from "../../base-agent";
import {
  BUSINESS_ANALYSIS_AGENT_ID,
  DISCOVERY_AGENT_ID,
  LEAD_QUALIFICATION_AGENT_ID,
  PRICING_AGENT_ID,
  PROPOSAL_ENGINE_AGENT_ID,
  SALES_PROPOSAL_ENGINE_TASK,
} from "../shared/constants";
import type { AgentContext } from "../../../types/agent";
import type { ProjectContext } from "../../../types/context";
import type { AgentTask } from "../../../types/project";
import type {
  BusinessAnalysisOutput,
  DiscoveryOutput,
  LeadQualificationOutput,
  PricingOutput,
  ProposalEngineOutput,
} from "../../../types/sales";

export class ProposalEngineAgent extends BaseAgent {
  readonly id = PROPOSAL_ENGINE_AGENT_ID;
  readonly name = "Proposal Engine Agent";
  readonly description =
    "Generates structured JSON proposals from qualification, discovery, analysis, and pricing outputs.";

  constructor(private readonly engine: ProposalEngine = new ProposalEngine()) {
    super();
  }

  canHandle(task: AgentTask): boolean {
    return task.type === SALES_PROPOSAL_ENGINE_TASK;
  }

  async execute(task: AgentTask, context: AgentContext) {
    if (!("memory" in context)) {
      return this.failure(task, "Proposal engine requires ProjectContext with shared memory.");
    }

    const projectContext = context as ProjectContext;
    const lead = this.readOutput<LeadQualificationOutput>(
      projectContext,
      LEAD_QUALIFICATION_AGENT_ID,
    );
    const discovery = this.readOutput<DiscoveryOutput>(
      projectContext,
      DISCOVERY_AGENT_ID,
    );
    const businessAnalysis = this.readOutput<BusinessAnalysisOutput>(
      projectContext,
      BUSINESS_ANALYSIS_AGENT_ID,
    );
    const pricing = this.readOutput<PricingOutput>(projectContext, PRICING_AGENT_ID);

    if (!lead?.isQualified) {
      return this.failure(task, "Proposal engine requires a qualified lead.");
    }

    if (!discovery || !businessAnalysis || !pricing) {
      return this.failure(
        task,
        "Proposal engine requires discovery, business analysis, and pricing outputs.",
      );
    }

    const engineInput = this.engine.buildInput({
      requestId: context.requestId,
      leadQualification: lead,
      discovery,
      businessAnalysis,
      pricing,
    });

    if (!engineInput) {
      return this.failure(task, "Insufficient client data to generate proposal.");
    }

    const result = this.engine.generate(engineInput);

    if (!result.success || !result.proposal) {
      return this.failure(task, result.error ?? "Proposal generation failed.");
    }

    const output: ProposalEngineOutput = {
      proposal: result.proposal,
      generatedAt: result.proposal.generatedAt,
    };

    return this.success(
      task,
      output as unknown as Record<string, unknown>,
      "Structured proposal generated.",
    );
  }

  private readOutput<T>(context: ProjectContext, agentId: string): T | undefined {
    const record = context.memory.getByAgent(agentId).at(-1);
    return record ? (record.output as unknown as T) : undefined;
  }
}

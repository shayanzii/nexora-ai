import { BaseAgent } from "../../base-agent";
import { buildProjectSummary, recommendServices } from "../shared/analysis";
import {
  BUSINESS_ANALYSIS_AGENT_ID,
  LEAD_QUALIFICATION_AGENT_ID,
  SALES_BUSINESS_ANALYSIS_TASK,
} from "../shared/constants";
import type { AgentContext } from "../../../types/agent";
import type { ProjectContext } from "../../../types/context";
import type { AgentTask } from "../../../types/project";
import type {
  BusinessAnalysisOutput,
  LeadQualificationOutput,
} from "../../../types/sales";

export class BusinessAnalysisAgent extends BaseAgent {
  readonly id = BUSINESS_ANALYSIS_AGENT_ID;
  readonly name = "Business Analysis Agent";
  readonly description =
    "Produces structured business analysis and scope outline from discovery findings.";

  canHandle(task: AgentTask): boolean {
    return task.type === SALES_BUSINESS_ANALYSIS_TASK;
  }

  async execute(task: AgentTask, context: AgentContext) {
    const leadOutput = this.resolveLeadOutput(context);

    if (!leadOutput?.isQualified || !leadOutput.profile) {
      return this.failure(task, "Business analysis requires a qualified lead profile.");
    }

    const profile = leadOutput.profile;
    const recommendedServices = recommendServices(profile);

    const output: BusinessAnalysisOutput = {
      projectSummary: buildProjectSummary(profile),
      recommendedServices,
      proposedScope: profile.services,
      deliverableOutline: recommendedServices.map(
        (s) => `${s.service}: ${s.rationale}`,
      ),
      nextStep:
        "Review business analysis with client before pricing and proposal generation.",
    };

    return this.success(
      task,
      output as unknown as Record<string, unknown>,
      "Business analysis complete.",
    );
  }

  private resolveLeadOutput(context: AgentContext): LeadQualificationOutput | undefined {
    if ("memory" in context) {
      const fromMemory = (context as ProjectContext).memory
        .getByAgent(LEAD_QUALIFICATION_AGENT_ID)
        .at(-1);

      if (fromMemory) {
        return fromMemory.output as unknown as LeadQualificationOutput;
      }
    }

    return undefined;
  }
}

/** @deprecated Use BusinessAnalysisAgent */
export { BusinessAnalysisAgent as ProposalAgent };

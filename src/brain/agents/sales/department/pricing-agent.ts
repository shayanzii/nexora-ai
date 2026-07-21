import { BaseAgent } from "../../base-agent";
import { buildPricingSummary } from "../shared/pricing";
import {
  LEAD_QUALIFICATION_AGENT_ID,
  PRICING_AGENT_ID,
  SALES_PRICING_TASK,
} from "../shared/constants";
import type { AgentContext } from "../../../types/agent";
import type { ProjectContext } from "../../../types/context";
import type { AgentTask } from "../../../types/project";
import type { LeadQualificationOutput, PricingOutput } from "../../../types/sales";

export class PricingAgent extends BaseAgent {
  readonly id = PRICING_AGENT_ID;
  readonly name = "Pricing Agent";
  readonly description =
    "Estimates project pricing, timeline, complexity, and delivery risks.";

  canHandle(task: AgentTask): boolean {
    return task.type === SALES_PRICING_TASK;
  }

  async execute(task: AgentTask, context: AgentContext) {
    const leadOutput = this.resolveLeadOutput(context);

    if (!leadOutput?.isQualified || !leadOutput.profile) {
      return this.failure(task, "Pricing requires a qualified lead profile.");
    }

    const profile = leadOutput.profile;
    const pricing = buildPricingSummary(profile, context.request);

    const output: PricingOutput = {
      estimatedPriceRange: pricing.estimatedPriceRange,
      estimatedTimeline: pricing.estimatedTimeline,
      estimatedComplexity: pricing.estimatedComplexity,
      complexityScore: pricing.complexityScore,
      projectRisks: pricing.projectRisks,
      budgetAligned: pricing.budgetAligned,
    };

    return this.success(
      task,
      output as unknown as Record<string, unknown>,
      "Pricing analysis complete.",
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

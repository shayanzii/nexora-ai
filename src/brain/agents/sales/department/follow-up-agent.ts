import { BaseAgent } from "../../base-agent";
import {
  buildFollowUpActions,
  buildFollowUpSummary,
} from "../shared/follow-up";
import {
  FOLLOW_UP_AGENT_ID,
  LEAD_QUALIFICATION_AGENT_ID,
  PRICING_AGENT_ID,
  SALES_FOLLOW_UP_TASK,
} from "../shared/constants";
import type { AgentContext } from "../../../types/agent";
import type { ProjectContext } from "../../../types/context";
import type { AgentTask } from "../../../types/project";
import type {
  FollowUpOutput,
  LeadQualificationOutput,
  PricingOutput,
} from "../../../types/sales";

export class FollowUpAgent extends BaseAgent {
  readonly id = FOLLOW_UP_AGENT_ID;
  readonly name = "Follow-Up Agent";
  readonly description =
    "Determines required follow-up actions for sales when qualification or pricing needs attention.";

  canHandle(task: AgentTask): boolean {
    return task.type === SALES_FOLLOW_UP_TASK;
  }

  async execute(task: AgentTask, context: AgentContext) {
    const leadOutput = this.resolveLeadOutput(context);
    const pricingOutput = this.resolvePricingOutput(context);

    const needsClarification = !leadOutput?.isQualified;

    const actions = buildFollowUpActions({
      needsClarification,
      clarificationQuestions: leadOutput?.clarificationQuestions,
      budgetAligned: pricingOutput?.budgetAligned,
      projectRisks: pricingOutput?.projectRisks,
    });

    const output: FollowUpOutput = {
      required: true,
      summary: buildFollowUpSummary({
        needsClarification,
        budgetAligned: pricingOutput?.budgetAligned,
        projectRisks: pricingOutput?.projectRisks,
      }),
      actions,
      recommendedContactWindow: needsClarification ? "Within 24 hours" : "Within 48 hours",
    };

    return this.success(
      task,
      output as unknown as Record<string, unknown>,
      "Follow-up plan generated.",
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

  private resolvePricingOutput(context: AgentContext): PricingOutput | undefined {
    if ("memory" in context) {
      const fromMemory = (context as ProjectContext).memory
        .getByAgent(PRICING_AGENT_ID)
        .at(-1);

      if (fromMemory) {
        return fromMemory.output as unknown as PricingOutput;
      }
    }

    return undefined;
  }
}

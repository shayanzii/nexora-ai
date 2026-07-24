import { BaseAgent } from "../../base-agent";
import { buildBusinessAnalysis, buildDiscoveryNotes } from "../shared/analysis";
import {
  DISCOVERY_AGENT_ID,
  LEAD_QUALIFICATION_AGENT_ID,
  SALES_DISCOVERY_TASK,
} from "../shared/constants";
import type { AgentContext } from "../../../types/agent";
import type { ProjectContext } from "../../../types/context";
import type { AgentTask } from "../../../types/project";
import type { DiscoveryOutput, LeadQualificationOutput } from "../../../types/sales";

export class DiscoveryAgent extends BaseAgent {
  readonly id = DISCOVERY_AGENT_ID;
  readonly name = "Discovery Agent";
  readonly description =
    "Performs structured business discovery based on a qualified client profile.";

  canHandle(task: AgentTask): boolean {
    return task.type === SALES_DISCOVERY_TASK;
  }

  async execute(task: AgentTask, context: AgentContext) {
    const leadOutput = this.resolveLeadOutput(context);

    if (!leadOutput?.isQualified || !leadOutput.profile) {
      return this.failure(task, "Discovery requires a qualified lead profile.");
    }

    const profile = leadOutput.profile;

    const output: DiscoveryOutput = {
      businessAnalysis: buildBusinessAnalysis(profile),
      discoveryNotes: buildDiscoveryNotes(profile),
      industry: profile.industry!,
      targetAudience: profile.targetAudience!,
      operatingCountry: profile.country!,
    };

    return this.success(
      task,
      output as unknown as Record<string, unknown>,
      "Business discovery complete.",
    );
  }

  private resolveLeadOutput(context: AgentContext): LeadQualificationOutput | undefined {
    if ("memory" in context) {
      const projectContext = context as ProjectContext;
      const fromMemory = projectContext.memory
        .getByAgent(LEAD_QUALIFICATION_AGENT_ID)
        .at(-1);

      if (fromMemory) {
        return fromMemory.output as unknown as LeadQualificationOutput;
      }
    }

    return undefined;
  }
}

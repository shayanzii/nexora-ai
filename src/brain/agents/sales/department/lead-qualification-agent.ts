import { BaseAgent } from "../../base-agent";
import {
  calculateCompletenessScore,
  detectMissingFields,
  generateClarificationQuestions,
  listPresentFields,
  parseClientDiscoveryProfile,
} from "../shared/profile";
import {
  LEAD_QUALIFICATION_AGENT_ID,
  SALES_LEAD_QUALIFICATION_TASK,
} from "../shared/constants";
import type { AgentContext } from "../../../types/agent";
import type { AgentTask } from "../../../types/project";
import type { LeadQualificationOutput } from "../../../types/sales";

export class LeadQualificationAgent extends BaseAgent {
  readonly id = LEAD_QUALIFICATION_AGENT_ID;
  readonly name = "Lead Qualification Agent";
  readonly description =
    "Validates required client fields and determines whether a lead is ready for discovery.";

  canHandle(task: AgentTask): boolean {
    return task.type === SALES_LEAD_QUALIFICATION_TASK;
  }

  async execute(task: AgentTask, context: AgentContext) {
    const profile = parseClientDiscoveryProfile(context.request);
    const missingFieldReports = detectMissingFields(profile);
    const fieldsMissing = missingFieldReports.map((m) => m.field);
    const fieldsPresent = listPresentFields(profile);
    const completenessScore = calculateCompletenessScore(profile);
    const isQualified = missingFieldReports.length === 0;

    const output: LeadQualificationOutput = {
      isQualified,
      completenessScore,
      fieldsPresent,
      fieldsMissing,
      missingFieldReports,
      profile,
      clarificationQuestions: isQualified
        ? undefined
        : generateClarificationQuestions(missingFieldReports),
    };

    const message = isQualified
      ? "Lead qualified — all required fields present."
      : `${fieldsMissing.length} required field(s) missing.`;

    return this.success(task, output as unknown as Record<string, unknown>, message);
  }
}

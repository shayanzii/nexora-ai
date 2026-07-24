import type {
  ClarificationQuestion,
  ProjectRisk,
} from "../../../types/sales";

export interface FollowUpDecisionInput {
  needsClarification: boolean;
  clarificationQuestions?: ClarificationQuestion[];
  budgetAligned?: boolean;
  projectRisks?: ProjectRisk[];
}

export function shouldRequireFollowUp(input: FollowUpDecisionInput): boolean {
  if (input.needsClarification) {
    return true;
  }

  if (input.budgetAligned === false) {
    return true;
  }

  if (input.projectRisks?.some((risk) => risk.severity === "high")) {
    return true;
  }

  if (input.projectRisks?.some((risk) => risk.id === "regulated-industry")) {
    return true;
  }

  return false;
}

export function buildFollowUpActions(input: FollowUpDecisionInput): string[] {
  if (input.needsClarification && input.clarificationQuestions) {
    return input.clarificationQuestions.map(
      (q, index) => `${index + 1}. Collect ${q.field}: ${q.question}`,
    );
  }

  const actions: string[] = [];

  if (input.budgetAligned === false) {
    actions.push("Schedule budget alignment call to review scope vs. investment.");
  }

  if (input.projectRisks?.some((r) => r.id === "regulated-industry")) {
    actions.push("Send compliance checklist and schedule regulatory scoping session.");
  }

  if (input.projectRisks?.some((r) => r.severity === "high")) {
    actions.push("Escalate to senior sales lead for risk review before proposal finalization.");
  }

  if (actions.length === 0) {
    actions.push("Send project summary to client and confirm kickoff availability.");
  }

  return actions;
}

export function buildFollowUpSummary(input: FollowUpDecisionInput): string {
  if (input.needsClarification) {
    return "Follow-up required to collect missing client information before qualification.";
  }

  if (input.budgetAligned === false) {
    return "Follow-up required to align budget and scope before proceeding.";
  }

  return "Follow-up recommended to confirm next steps with the client.";
}

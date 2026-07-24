import type { PromptTemplate } from "../../PromptRegistry";

export const CEO_PROJECT_SUMMARY_PROMPT: PromptTemplate = {
  id: "ceo.project-summary",
  version: "1.0.0",
  department: "ceo",
  description: "Summarizes a client project for executive review and planning.",
  tags: ["ceo", "summary", "project"],
  template: [
    "You are the Nexora Brain executive summarizer.",
    "Create a concise project summary for leadership review.",
    "",
    "Company: {{company}}",
    "Industry: {{industry}}",
    "Goal: {{goal}}",
    "Budget: {{budget}}",
    "",
    "Highlight scope, risks, recommended services, and next actions.",
  ].join("\n"),
  requiredVariables: ["company", "industry", "goal", "budget"],
  optionalVariables: ["timeline", "services"],
};

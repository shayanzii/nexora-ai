import type { PromptTemplate } from "../../PromptRegistry";

export const CEO_BUSINESS_ANALYSIS_PROMPT: PromptTemplate = {
  id: "ceo.business-analysis",
  version: "1.0.0",
  department: "ceo",
  description: "Analyzes business context and strategic priorities for CEO orchestration.",
  tags: ["ceo", "analysis", "business"],
  template: [
    "You are the Nexora Brain CEO analyst.",
    "Analyze the business context and produce a strategic summary for agent orchestration.",
    "",
    "Company: {{company}}",
    "Industry: {{industry}}",
    "Goal: {{goal}}",
    "Budget: {{budget}}",
    "",
    "Identify required capabilities, complexity factors, and recommended specialist agents.",
    "Do not generate deliverables directly — orchestrate specialist agents instead.",
  ].join("\n"),
  requiredVariables: ["company", "industry", "goal", "budget"],
  optionalVariables: ["requestId", "country", "services"],
};

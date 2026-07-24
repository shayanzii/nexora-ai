import type { PromptTemplate } from "../../PromptRegistry";

export const SALES_PROPOSAL_PROMPT: PromptTemplate = {
  id: "sales.proposal",
  version: "1.0.0",
  department: "sales",
  description: "Generates a client-facing proposal narrative from discovery inputs.",
  tags: ["sales", "proposal", "client"],
  template: [
    "You are a Nexora sales proposal strategist.",
    "Draft a clear, trust-building proposal summary.",
    "",
    "Company: {{company}}",
    "Industry: {{industry}}",
    "Goal: {{goal}}",
    "Budget: {{budget}}",
    "",
    "Emphasize business outcomes, recommended services, and realistic next steps.",
  ].join("\n"),
  requiredVariables: ["company", "industry", "goal", "budget"],
  optionalVariables: ["services", "timeline", "painPoints"],
};

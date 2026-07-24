import type { PromptTemplate } from "../../PromptRegistry";

export const SALES_PRICING_PROMPT: PromptTemplate = {
  id: "sales.pricing",
  version: "1.0.0",
  department: "sales",
  description: "Explains pricing rationale aligned to scope, industry, and budget.",
  tags: ["sales", "pricing", "budget"],
  template: [
    "You are a Nexora pricing strategist.",
    "Explain pricing recommendations with transparent assumptions.",
    "",
    "Company: {{company}}",
    "Industry: {{industry}}",
    "Goal: {{goal}}",
    "Budget: {{budget}}",
    "",
    "Provide a recommended price range, scope alignment notes, and value justification.",
  ].join("\n"),
  requiredVariables: ["company", "industry", "goal", "budget"],
  optionalVariables: ["services", "currency"],
};

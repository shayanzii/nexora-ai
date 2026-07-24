import type { PromptEngine } from "../../prompts/PromptEngine";
import { getPromptEngine } from "../../prompts";
import type { CEOAgentConfig } from "./CEOAgentConfig";
import type { CEOContext } from "./CEOContext";

const JSON_OUTPUT_INSTRUCTIONS = [
  "Return ONLY valid JSON with no markdown or commentary.",
  "Use this exact shape:",
  "{",
  '  "business": "string",',
  '  "industry": "string",',
  '  "goals": ["string"],',
  '  "requirements": ["string"],',
  '  "missingInformation": ["string"],',
  '  "recommendedDepartments": ["sales" | "website"],',
  '  "estimatedComplexity": "low" | "medium" | "high" | "enterprise",',
  '  "estimatedBudget": { "min": number, "max": number, "currency": "CAD", "rationale": "string" },',
  '  "estimatedTimeline": { "minWeeks": number, "maxWeeks": number, "summary": "string" },',
  '  "confidence": number',
  "}",
].join("\n");

/** Builds LLM messages for CEO business analysis using the Prompt Engine. */
export function buildCEOAnalysisMessages(
  context: CEOContext,
  config: CEOAgentConfig,
  promptEngine: PromptEngine = getPromptEngine(),
): { system: string; user: string } {
  const rendered = promptEngine.render(
    config.promptId,
    {
      company: context.company,
      industry: context.industry,
      goal: context.goal,
      budget: formatBudget(context.budget),
      requestId: context.requestId,
      country: context.country ?? "Not specified",
      services: context.services.join(", ") || "Not specified",
    },
    { version: config.promptVersion },
  );

  const system = [
    rendered.content,
    "",
    JSON_OUTPUT_INSTRUCTIONS,
  ].join("\n");

  const user = [
    "Analyze this customer request and produce the JSON business analysis.",
    "",
    `Request ID: ${context.requestId}`,
    `Company: ${context.company}`,
    `Industry: ${context.industry}`,
    `Goal: ${context.goal}`,
    `Budget: ${formatBudget(context.budget)}`,
    `Services: ${context.services.join(", ") || "None specified"}`,
    `Country: ${context.country ?? "Not specified"}`,
    `Target audience: ${context.targetAudience ?? "Not specified"}`,
    `Timeline preference: ${context.timeline ?? "Not specified"}`,
    `Regulated industry: ${context.regulated ? "yes" : "no"}`,
  ].join("\n");

  return { system, user };
}

function formatBudget(budget: number): string {
  return `$${budget.toLocaleString("en-CA")} CAD`;
}

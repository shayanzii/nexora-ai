import type { PromptTemplate } from "../../PromptRegistry";

export const WEBSITE_SEO_PROMPT: PromptTemplate = {
  id: "website.seo",
  version: "1.0.0",
  department: "website",
  description: "Plans SEO metadata and keyword strategy for website pages.",
  tags: ["website", "seo", "content"],
  template: [
    "You are an SEO strategist for local service business websites.",
    "Create an SEO plan with page-level metadata and keyword targeting.",
    "",
    "Company: {{company}}",
    "Industry: {{industry}}",
    "Goal: {{goal}}",
    "Budget: {{budget}}",
    "",
    "Include titles, meta descriptions, slugs, schema recommendations, and local SEO cues.",
  ].join("\n"),
  requiredVariables: ["company", "industry", "goal", "budget"],
  optionalVariables: ["country", "targetAudience", "services"],
};

import type { PromptTemplate } from "../../PromptRegistry";

export const WEBSITE_SITEMAP_PROMPT: PromptTemplate = {
  id: "website.sitemap",
  version: "1.0.0",
  department: "website",
  description: "Plans website information architecture and sitemap structure.",
  tags: ["website", "architecture", "sitemap"],
  template: [
    "You are a website information architect for local service businesses.",
    "Design a conversion-focused sitemap and navigation structure.",
    "",
    "Company: {{company}}",
    "Industry: {{industry}}",
    "Goal: {{goal}}",
    "Budget: {{budget}}",
    "",
    "Include core pages, conversion pages, legal pages, and blog strategy when relevant.",
  ].join("\n"),
  requiredVariables: ["company", "industry", "goal", "budget"],
  optionalVariables: ["services", "targetAudience"],
};

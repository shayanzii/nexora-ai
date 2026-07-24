import { CEO_BUSINESS_ANALYSIS_PROMPT } from "./ceo/business-analysis";
import { CEO_PROJECT_SUMMARY_PROMPT } from "./ceo/project-summary";
import { SALES_PRICING_PROMPT } from "./sales/pricing";
import { SALES_PROPOSAL_PROMPT } from "./sales/proposal";
import { WEBSITE_BRAND_ANALYSIS_PROMPT } from "./website/brand-analysis";
import { WEBSITE_SEO_PROMPT } from "./website/seo";
import { WEBSITE_SITEMAP_PROMPT } from "./website/sitemap";

/** All built-in Nexora Brain prompt templates. */
export const BUILTIN_PROMPT_TEMPLATES = [
  CEO_BUSINESS_ANALYSIS_PROMPT,
  CEO_PROJECT_SUMMARY_PROMPT,
  SALES_PROPOSAL_PROMPT,
  SALES_PRICING_PROMPT,
  WEBSITE_BRAND_ANALYSIS_PROMPT,
  WEBSITE_SITEMAP_PROMPT,
  WEBSITE_SEO_PROMPT,
] as const;

export { CEO_BUSINESS_ANALYSIS_PROMPT } from "./ceo/business-analysis";
export { CEO_PROJECT_SUMMARY_PROMPT } from "./ceo/project-summary";
export { SALES_PROPOSAL_PROMPT } from "./sales/proposal";
export { SALES_PRICING_PROMPT } from "./sales/pricing";
export { WEBSITE_BRAND_ANALYSIS_PROMPT } from "./website/brand-analysis";
export { WEBSITE_SITEMAP_PROMPT } from "./website/sitemap";
export { WEBSITE_SEO_PROMPT } from "./website/seo";

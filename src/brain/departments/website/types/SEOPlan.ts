/**
 * Planner output model for website SEO planning.
 * Distinct from the v1.1 WebsitePlan `SEOPlan` schema in `../schema.ts`.
 */

export type SeoPagePriority = "critical" | "high" | "medium" | "low";

/** Per-page SEO plan produced by SEOPlanner. */
export interface SeoPagePlan {
  slug: string;
  title: string;
  metaDescription: string;
  focusKeyword: string;
  secondaryKeywords: string[];
  headingSuggestions: string[];
  internalLinks: string[];
  schemaType: string;
  canonicalUrl: string;
  priority: SeoPagePriority;
}

/** Full SEO plan with per-page entries. */
export interface SEOPlan {
  pages: SeoPagePlan[];
}

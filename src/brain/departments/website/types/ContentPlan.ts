/**
 * Planner output model for website content planning.
 * Distinct from v1.1 WebsitePlan schema types in `../schema.ts`.
 */

export type ContentSectionPriority = "required" | "recommended" | "optional";

/** Hero block content for a page. */
export interface ContentHero {
  headline: string;
  subheadline: string;
  cta: string;
}

/** Section-level content plan with guidelines and components. */
export interface ContentSectionPlan {
  sectionName: string;
  purpose: string;
  contentGuidelines: string;
  recommendedComponents: string[];
  priority: ContentSectionPriority;
}

/** Per-page content plan produced by ContentPlanner. */
export interface ContentPagePlan {
  slug: string;
  hero: ContentHero;
  headline: string;
  subheadline: string;
  cta: string;
  sections: ContentSectionPlan[];
  faq: string[];
  trustSignals: string[];
  testimonials: string[];
  serviceHighlights: string[];
  contactStrategy: string;
}

/** Full content plan with per-page entries. */
export interface ContentPlan {
  pages: ContentPagePlan[];
}

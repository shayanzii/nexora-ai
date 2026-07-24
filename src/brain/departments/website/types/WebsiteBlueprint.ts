/**
 * Website blueprint model — aggregated planner output for downstream build.
 * Distinct from the v1.1 WebsitePlan schema in `../schema.ts`.
 */

import type { ContentHero, ContentSectionPlan } from "./ContentPlan";

export type BlueprintPagePriority = "required" | "recommended" | "optional" | "critical" | "high" | "medium" | "low";

/** Site-wide metadata derived from brand and request context. */
export interface BlueprintSiteMetadata {
  requestId: string;
  businessName: string;
  industry: string;
  industryId: string;
  country: string;
  targetAudience: string;
  primaryGoal: string;
  generatedAt: string;
  brandPersonality: string[];
  toneOfVoice: string;
  valueProposition: string;
  visualStyle: string;
  colorPalette: string[];
  typography: string[];
}

/** Header or footer navigation item in the blueprint. */
export interface BlueprintNavigationItem {
  label: string;
  slug: string;
  priority: number;
  isCta: boolean;
}

/** Navigation structure for the blueprint. */
export interface BlueprintNavigation {
  header: BlueprintNavigationItem[];
  footer: BlueprintNavigationItem[];
  mobileStrategy: string;
  stickyElements: string[];
}

/** SEO metadata for a blueprint page. */
export interface BlueprintPageSeo {
  title: string;
  metaDescription: string;
  focusKeyword: string;
  secondaryKeywords: string[];
  headingSuggestions: string[];
  schemaType: string;
  canonicalUrl: string;
  priority: BlueprintPagePriority;
}

/** Content payload for a blueprint page. */
export interface BlueprintPageContent {
  hero: ContentHero;
  headline: string;
  subheadline: string;
  sections: ContentSectionPlan[];
  faq: string[];
  trustSignals: string[];
  testimonials: string[];
  serviceHighlights: string[];
  contactStrategy: string;
}

/** CTA definition on a blueprint page. */
export interface BlueprintPageCta {
  label: string;
  placement: string;
  slug: string;
}

/** Full page specification in the website blueprint. */
export interface BlueprintPage {
  slug: string;
  title: string;
  sections: string[];
  components: string[];
  seo: BlueprintPageSeo;
  content: BlueprintPageContent;
  cta: BlueprintPageCta;
  priority: BlueprintPagePriority;
}

/** Site-wide SEO aggregation. */
export interface BlueprintSeo {
  primaryKeywords: string[];
  pageIndexStrategy: string;
  pages: BlueprintPageSeo[];
}

/** Registered form in the blueprint. */
export interface BlueprintForm {
  id: string;
  slug: string;
  pageTitle: string;
  formType: "contact" | "quote" | "booking" | "callback" | "newsletter" | "chat";
  fields: string[];
  purpose: string;
}

/** CTA placement across the site. */
export interface BlueprintCtaLocation {
  label: string;
  slug: string;
  placement: string;
  scope: "site" | "page";
}

/** Footer configuration. */
export interface BlueprintFooter {
  items: BlueprintNavigationItem[];
  legalPageSlugs: string[];
}

/** Blog strategy from information architecture. */
export interface BlueprintBlogStrategy {
  enabled: boolean;
  rationale: string;
  recommendedTopics: string[];
  parentSlug: string | null;
}

/** Analytics tracking recommendation. */
export interface BlueprintAnalyticsRecommendation {
  id: string;
  event: string;
  trigger: string;
  pages: string[];
  tooling: "ga4";
  kpiMapping: string;
}

/** Aggregated website blueprint produced by WebsiteGenerator. */
export interface WebsiteBlueprint {
  siteMetadata: BlueprintSiteMetadata;
  navigation: BlueprintNavigation;
  pages: BlueprintPage[];
  pageContent: Record<string, BlueprintPageContent>;
  seo: BlueprintSeo;
  components: string[];
  forms: BlueprintForm[];
  ctaLocations: BlueprintCtaLocation[];
  footer: BlueprintFooter;
  blogStrategy: BlueprintBlogStrategy;
  analyticsRecommendations: BlueprintAnalyticsRecommendation[];
}

import type { CEOBusinessAnalysis } from "../../agents/ceo/CEOOutput";
import type { ProjectExecutionPlan } from "../../orchestrator/ExecutionPlan";
import type { SalesResult } from "../sales/SalesTypes";
import type { PricingResult } from "../../pricing/PricingTypes";

/** Supported website type classifications. */
export const WEBSITE_TYPES = [
  "business-website",
  "landing-page",
  "e-commerce",
  "restaurant",
  "dental-clinic",
  "medical",
  "law-firm",
  "real-estate",
  "portfolio",
  "saas",
  "corporate",
] as const;

export type WebsiteType = (typeof WEBSITE_TYPES)[number];

export interface RecommendedStack {
  framework: string;
  styling: string;
  language: string;
  hosting: string;
  cms?: string;
  analytics?: string;
  rationale: string;
}

export interface SiteArchitecturePlan {
  model: "single-page" | "multi-page" | "hybrid";
  primaryPages: readonly string[];
  conversionPages: readonly string[];
  legalPages: readonly string[];
  blogEnabled: boolean;
  hierarchy: readonly { slug: string; children: readonly string[] }[];
}

export interface BlueprintPage {
  slug: string;
  title: string;
  purpose: string;
  priority: "required" | "recommended" | "optional";
  inHeaderNav: boolean;
  inFooterNav: boolean;
  conversionPage: boolean;
}

export interface NavigationPlan {
  header: readonly { label: string; slug: string; isCta: boolean }[];
  footer: readonly { label: string; slug: string; isCta: boolean }[];
  mobileStrategy: string;
  stickyElements: readonly string[];
}

export interface PageSectionPlan {
  pageSlug: string;
  sections: readonly string[];
}

export interface ComponentPlan {
  id: string;
  name: string;
  usedOnPages: readonly string[];
  purpose: string;
}

export interface SeoPageMeta {
  slug: string;
  title: string;
  metaDescription: string;
}

export interface SeoPlan {
  primaryKeywords: readonly string[];
  secondaryKeywords: readonly string[];
  pageTitles: readonly SeoPageMeta[];
  metaDescriptions: readonly SeoPageMeta[];
  internalLinkingStrategy: readonly string[];
  schemaRecommendations: readonly string[];
  localSeoRecommendations: readonly string[];
}

export interface PageContentPlan {
  slug: string;
  title: string;
  purpose: string;
  targetAudience: string;
  mainMessage: string;
  requiredContent: readonly string[];
  callsToAction: readonly string[];
}

export interface ContentPlan {
  pages: readonly PageContentPlan[];
  toneOfVoice: string;
  contentPillars: readonly string[];
}

export interface DesignSystemPlan {
  colorPalette: readonly string[];
  typography: readonly string[];
  spacing: string;
  borderRadius: string;
  iconStyle: string;
  visualStyle: string;
}

export interface ResponsiveStrategy {
  desktop: string;
  tablet: string;
  mobile: string;
}

export interface PerformanceStrategy {
  lighthouseTarget: number;
  imageOptimization: readonly string[];
  lazyLoading: readonly string[];
  caching: readonly string[];
  accessibility: readonly string[];
  coreWebVitals: readonly string[];
}

export interface DeploymentPlan {
  platform: string;
  hostingRequirements: readonly string[];
  domainStrategy: string;
  analytics: readonly string[];
  searchConsole: readonly string[];
}

export interface EstimatedTimeline {
  minWeeks: number;
  maxWeeks: number;
  summary: string;
}

/**
 * Sprint 9.4 website execution blueprint — foundation for future AI website generation.
 * Distinct from the legacy generator blueprint in `types/WebsiteBlueprint.ts`.
 */
export interface WebsiteExecutionBlueprint {
  requestId: string;
  projectSummary: string;
  websiteType: WebsiteType;
  websiteTypeLabel: string;
  recommendedStack: RecommendedStack;
  siteArchitecture: SiteArchitecturePlan;
  pages: readonly BlueprintPage[];
  navigation: NavigationPlan;
  pageSections: readonly PageSectionPlan[];
  components: readonly ComponentPlan[];
  seoPlan: SeoPlan;
  contentPlan: ContentPlan;
  designSystem: DesignSystemPlan;
  responsiveStrategy: ResponsiveStrategy;
  performanceStrategy: PerformanceStrategy;
  deploymentPlan: DeploymentPlan;
  estimatedTimeline: EstimatedTimeline;
  confidenceScore: number;
  generatedAt: string;
}

/** Input to the Website Execution Agent. */
export interface WebsiteExecutionAgentInput {
  analysis: CEOBusinessAnalysis;
  plan: ProjectExecutionPlan;
  salesResult: SalesResult;
  pricingResult: PricingResult;
  metadata?: Readonly<Record<string, unknown>>;
}

export interface WebsiteExecutionAgentLogEvent {
  level: "info" | "error";
  action: "blueprint" | "pages" | "seo" | "design" | "complete";
  message: string;
}

export type WebsiteExecutionAgentLogger = (event: WebsiteExecutionAgentLogEvent) => void;

export interface WebsiteExecutionAgentOptions {
  logger?: WebsiteExecutionAgentLogger;
  city?: string;
  country?: string;
}

/** Industry → website type mapping rules. */
export const INDUSTRY_WEBSITE_TYPE_MAP: Readonly<Record<string, WebsiteType>> = {
  "dental-clinic": "dental-clinic",
  dentist: "dental-clinic",
  dental: "dental-clinic",
  restaurant: "restaurant",
  "law-firm": "law-firm",
  legal: "law-firm",
  "real-estate": "real-estate",
  realestate: "real-estate",
  medical: "medical",
  healthcare: "medical",
  saas: "saas",
  software: "saas",
  portfolio: "portfolio",
  corporate: "corporate",
  ecommerce: "e-commerce",
  "e-commerce": "e-commerce",
};

export const WEBSITE_TYPE_LABELS: Readonly<Record<WebsiteType, string>> = {
  "business-website": "Business Website",
  "landing-page": "Landing Page",
  "e-commerce": "E-Commerce Website",
  restaurant: "Restaurant Website",
  "dental-clinic": "Dental Clinic Website",
  medical: "Medical Website",
  "law-firm": "Law Firm Website",
  "real-estate": "Real Estate Website",
  portfolio: "Portfolio Website",
  saas: "SaaS Website",
  corporate: "Corporate Website",
};

export const STANDARD_COMPONENTS = [
  "Navbar",
  "Footer",
  "Hero",
  "Cards",
  "Forms",
  "Buttons",
  "Pricing Cards",
  "Testimonials",
  "FAQ",
  "Booking Form",
  "Contact Form",
  "Chat Widget",
] as const;

export type StandardComponent = (typeof STANDARD_COMPONENTS)[number];

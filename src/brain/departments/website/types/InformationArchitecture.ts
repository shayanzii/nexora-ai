/**
 * Planner output model for website information architecture planning.
 * Distinct from v1.1 WebsitePlan schema types in `../schema.ts`.
 */

export type ArchitecturePagePriority = "required" | "recommended" | "optional";

export type ArchitectureSeoImportance = "critical" | "high" | "medium" | "low";

/** Single page definition in the information architecture model. */
export interface ArchitecturePage {
  title: string;
  slug: string;
  purpose: string;
  priority: ArchitecturePagePriority;
  requiredSections: string[];
  recommendedComponents: string[];
  seoImportance: ArchitectureSeoImportance;
}

export type ArchitectureNavLocation = "header" | "footer" | "cta";

/** Navigation item in the planner architecture model. */
export interface ArchitectureNavigationItem {
  label: string;
  slug: string;
  location: ArchitectureNavLocation;
  priority: number;
}

export type ArchitectureCtaPlacement = "header" | "hero" | "inline" | "footer" | "sticky";

/** CTA placement definition in the planner architecture model. */
export interface ArchitectureCtaLocation {
  label: string;
  slug: string;
  placement: ArchitectureCtaPlacement;
}

/** Blog strategy recommendation for the site architecture. */
export interface ArchitectureBlogStrategy {
  enabled: boolean;
  rationale: string;
  recommendedTopics: string[];
  parentSlug: string | null;
}

/** Parent-child page relationship in the site hierarchy. */
export interface ArchitecturePageHierarchyNode {
  slug: string;
  children: string[];
}

/** Full information architecture produced by InformationArchitecturePlanner. */
export interface InformationArchitecture {
  pages: ArchitecturePage[];
  navigation: ArchitectureNavigationItem[];
  footerNavigation: ArchitectureNavigationItem[];
  primaryCTA: ArchitectureCtaLocation;
  secondaryCTA: ArchitectureCtaLocation;
  conversionPages: string[];
  legalPages: string[];
  blogStrategy: ArchitectureBlogStrategy;
  pageHierarchy: ArchitecturePageHierarchyNode[];
}

import type { DepartmentContext } from "../../../sdk";
import type { ProjectRequest } from "../../../types/project";
import type { BrandIdentity } from "../types/BrandIdentity";
import type {
  ArchitectureBlogStrategy,
  ArchitectureCtaLocation,
  ArchitectureNavigationItem,
  ArchitecturePage,
  InformationArchitecture,
} from "../types/InformationArchitecture";
import type { UserJourney } from "../types/UserJourney";
import {
  resolveArchitectureStrategy,
  type ArchitecturePageRule,
  type ArchitectureStrategyRule,
} from "./architecture-strategy";
import { titleToSlug } from "./architecture-utils";

/** Full planner input — upstream brand and journey context for architecture planning. */
export interface InformationArchitecturePlannerParams {
  request: ProjectRequest;
  brandIdentity: BrandIdentity;
  userJourney: UserJourney;
  context: DepartmentContext;
}

/** Result wrapper for information architecture planning execution. */
export interface InformationArchitecturePlannerResult {
  success: boolean;
  data?: InformationArchitecture;
  error?: string;
}

/**
 * Information Architecture Planner — deterministic rule-based site structure engine.
 * Uses industry strategies enriched by brand identity and user journey context.
 */
export class InformationArchitecturePlanner {
  readonly id = "information-architecture-planner";
  readonly version = "1.0.0";

  /** Runs deterministic information architecture planning for the given context. */
  plan(
    params: InformationArchitecturePlannerParams,
  ): InformationArchitecturePlannerResult {
    try {
      const industryId = params.context.knowledge.resolveIndustryId(params.request.industry);
      const strategy = resolveArchitectureStrategy(industryId);
      const data = this.buildInformationArchitecture(params, strategy);

      return { success: true, data };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Information architecture planning failed.";
      return { success: false, error: message };
    }
  }

  private buildInformationArchitecture(
    params: InformationArchitecturePlannerParams,
    strategy: ArchitectureStrategyRule,
  ): InformationArchitecture {
    const pages = strategy.pages.map((rule) => this.buildPage(params, rule));
    const navigation = this.buildHeaderNavigation(strategy, pages);
    const footerNavigation = this.buildFooterNavigation(strategy, pages);
    const conversionPages = this.resolveConversionPages(params, strategy, pages);
    const legalPages = strategy.pages
      .filter((rule) => rule.legalPage)
      .map((rule) => titleToSlug(rule.title));
    const blogStrategy = this.buildBlogStrategy(strategy);
    const pageHierarchy = strategy.hierarchy.map((node) => ({
      slug: node.slug,
      children: [...node.children],
    }));
    const primaryCTA = this.buildPrimaryCta(params, strategy, pages);
    const secondaryCTA = this.buildSecondaryCta(params, strategy, pages);

    return {
      pages,
      navigation,
      footerNavigation,
      primaryCTA,
      secondaryCTA,
      conversionPages,
      legalPages,
      blogStrategy,
      pageHierarchy,
    };
  }

  private buildPage(
    params: InformationArchitecturePlannerParams,
    rule: ArchitecturePageRule,
  ): ArchitecturePage {
    const audience = params.brandIdentity.targetAudience;
    const slug = titleToSlug(rule.title);

    return {
      title: rule.title,
      slug,
      purpose: `${rule.purpose} Target audience: ${audience}.`,
      priority: rule.priority,
      requiredSections: [...rule.requiredSections],
      recommendedComponents: [...rule.recommendedComponents],
      seoImportance: rule.seoImportance,
    };
  }

  private buildHeaderNavigation(
    strategy: ArchitectureStrategyRule,
    pages: ArchitecturePage[],
  ): ArchitectureNavigationItem[] {
    let priority = 1;

    return strategy.pages
      .filter((rule) => rule.headerNav)
      .map((rule) => {
        const slug = titleToSlug(rule.title);
        const page = pages.find((entry) => entry.slug === slug);
        if (!page) {
          throw new Error(`Missing architecture page for navigation slug: ${slug}`);
        }

        return {
          label: page.title,
          slug,
          location: "header" as const,
          priority: priority++,
        };
      });
  }

  private buildFooterNavigation(
    strategy: ArchitectureStrategyRule,
    pages: ArchitecturePage[],
  ): ArchitectureNavigationItem[] {
    let priority = 1;

    return strategy.pages
      .filter((rule) => rule.footerNav)
      .map((rule) => {
        const slug = titleToSlug(rule.title);
        const page = pages.find((entry) => entry.slug === slug);
        if (!page) {
          throw new Error(`Missing architecture page for footer slug: ${slug}`);
        }

        return {
          label: page.title,
          slug,
          location: "footer" as const,
          priority: priority++,
        };
      });
  }

  private resolveConversionPages(
    params: InformationArchitecturePlannerParams,
    strategy: ArchitectureStrategyRule,
    pages: ArchitecturePage[],
  ): string[] {
    const fromStrategy = strategy.pages
      .filter((rule) => rule.conversionPage)
      .map((rule) => titleToSlug(rule.title));

    const fromJourney = params.userJourney.conversion.recommendedPages
      .map((label) => this.matchPageSlug(label, pages))
      .filter((slug): slug is string => Boolean(slug));

    return [...new Set([...fromStrategy, ...fromJourney])];
  }

  private matchPageSlug(label: string, pages: ArchitecturePage[]): string | undefined {
    const normalizedLabel = label.toLowerCase().trim();
    const directSlug = titleToSlug(label);

    const exact = pages.find(
      (page) =>
        page.slug === directSlug || page.title.toLowerCase() === normalizedLabel,
    );
    if (exact) {
      return exact.slug;
    }

    return pages.find(
      (page) =>
        page.slug.startsWith(directSlug) ||
        directSlug.startsWith(page.slug) ||
        page.title.toLowerCase().includes(normalizedLabel) ||
        normalizedLabel.includes(page.title.toLowerCase()),
    )?.slug;
  }

  private buildBlogStrategy(strategy: ArchitectureStrategyRule): ArchitectureBlogStrategy {
    return {
      enabled: strategy.blogEnabled,
      rationale: strategy.blogRationale,
      recommendedTopics: [...strategy.blogTopics],
      parentSlug: strategy.blogParentSlug,
    };
  }

  private buildPrimaryCta(
    params: InformationArchitecturePlannerParams,
    strategy: ArchitectureStrategyRule,
    pages: ArchitecturePage[],
  ): ArchitectureCtaLocation {
    const slug = strategy.primaryCtaSlug;
    const page = pages.find((entry) => entry.slug === slug);
    const label = params.userJourney.conversion.recommendedCTA || params.brandIdentity.ctaStrategy;

    return {
      label,
      slug: page?.slug ?? slug,
      placement: strategy.primaryCtaPlacement,
    };
  }

  private buildSecondaryCta(
    params: InformationArchitecturePlannerParams,
    strategy: ArchitectureStrategyRule,
    pages: ArchitecturePage[],
  ): ArchitectureCtaLocation {
    const slug = strategy.secondaryCtaSlug;
    const page = pages.find((entry) => entry.slug === slug);
    const label =
      params.userJourney.awareness.recommendedCTA ||
      params.userJourney.consideration.recommendedCTA;

    return {
      label,
      slug: page?.slug ?? slug,
      placement: strategy.secondaryCtaPlacement,
    };
  }
}

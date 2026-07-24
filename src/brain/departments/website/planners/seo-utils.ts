import { readClientDiscoveryMetadata } from "../utils";
import type { BrandIdentity } from "../types/BrandIdentity";
import type { InformationArchitecture } from "../types/InformationArchitecture";
import type { SeoPagePlan, SEOPlan } from "../types/SEOPlan";
import type { UserJourney } from "../types/UserJourney";
import { slugToPath } from "./architecture-utils";
import {
  applySeoTemplate,
  type SeoPageTemplate,
  type SeoStrategyRule,
} from "./seo-strategy";

/** Token context for deterministic SEO template rendering. */
export interface SeoTemplateContext extends Record<string, string> {
  business: string;
  industry: string;
  country: string;
  audience: string;
  valueProposition: string;
  goal: string;
}

/** Builds a deterministic domain slug from a business name. */
export function businessNameToDomainSlug(businessName: string): string {
  const normalized = businessName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized || "local-business";
}

/** Builds a canonical URL for a page slug and business name. */
export function buildCanonicalUrl(businessName: string, slug: string): string {
  const domain = businessNameToDomainSlug(businessName);
  const path = slugToPath(slug);

  return `https://www.${domain}.com${path === "/" ? "" : path}`;
}

/** Builds internal link slugs for a page based on site hierarchy. */
export function buildInternalLinkSlugs(
  slug: string,
  architecture: InformationArchitecture,
): string[] {
  const links = new Set<string>(["home"]);

  if (architecture.primaryCTA.slug !== slug) {
    links.add(architecture.primaryCTA.slug);
  }

  if (architecture.secondaryCTA.slug !== slug) {
    links.add(architecture.secondaryCTA.slug);
  }

  const parentNode = architecture.pageHierarchy.find((node) =>
    node.children.includes(slug),
  );

  if (parentNode && parentNode.slug !== slug) {
    links.add(parentNode.slug);
  }

  if (parentNode) {
    for (const sibling of parentNode.children) {
      if (sibling !== slug) {
        links.add(sibling);
      }
    }
  }

  return [...links].filter((linkSlug) => linkSlug !== slug).slice(0, 6);
}

/** Builds SEO template tokens from planner context. */
export function buildSeoTemplateContext(
  brandIdentity: BrandIdentity,
  industry: string,
  metadata: ReturnType<typeof readClientDiscoveryMetadata>,
  goal: string,
): SeoTemplateContext {
  return {
    business: metadata.businessName ?? "Local Business",
    industry,
    country: metadata.country ?? "Canada",
    audience: brandIdentity.targetAudience,
    valueProposition: brandIdentity.valueProposition,
    goal: goal.trim() || "grow online",
  };
}

/** Builds a single page SEO plan from a template and architecture context. */
export function buildSeoPagePlan(
  template: SeoPageTemplate,
  architecture: InformationArchitecture,
  tokens: SeoTemplateContext,
  userJourney: UserJourney,
): SeoPagePlan {
  const architecturePage = architecture.pages.find((page) => page.slug === template.slug);
  const business = tokens.business;

  const title = `${business} | ${template.titleLabel} in ${tokens.country}`;
  const metaDescription = applySeoTemplate(template.metaDescriptionPattern, tokens);
  const focusKeyword = applySeoTemplate(template.focusKeywordPattern, tokens);
  const secondaryKeywords = template.secondaryKeywordPatterns.map((pattern) =>
    applySeoTemplate(pattern, tokens),
  );
  const headingSuggestions = [
    ...template.headingPatterns.map((pattern) => applySeoTemplate(pattern, tokens)),
    ...(architecturePage?.requiredSections.slice(0, 2) ?? []),
  ];
  const journeyKeyword = userJourney.conversion.recommendedCTA.toLowerCase();
  if (!secondaryKeywords.some((keyword) => keyword.toLowerCase().includes(journeyKeyword))) {
    secondaryKeywords.push(`${business} ${journeyKeyword}`);
  }

  return {
    slug: template.slug,
    title,
    metaDescription,
    focusKeyword,
    secondaryKeywords: [...new Set(secondaryKeywords.filter(Boolean))],
    headingSuggestions: [...new Set(headingSuggestions.filter(Boolean))],
    internalLinks: buildInternalLinkSlugs(template.slug, architecture),
    schemaType: template.schemaType,
    canonicalUrl: buildCanonicalUrl(business, template.slug),
    priority: template.priority,
  };
}

/** Builds the full planner SEO plan for a strategy and architecture. */
export function buildSeoPlanFromStrategy(
  strategy: SeoStrategyRule,
  architecture: InformationArchitecture,
  brandIdentity: BrandIdentity,
  userJourney: UserJourney,
  tokens: SeoTemplateContext,
): SEOPlan {
  const pages = strategy.pageTemplates
    .filter((template) => architecture.pages.some((page) => page.slug === template.slug))
    .map((template) => buildSeoPagePlan(template, architecture, tokens, userJourney));

  return { pages };
}

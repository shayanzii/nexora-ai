import { readClientDiscoveryMetadata } from "../utils";
import type { BrandIdentity } from "../types/BrandIdentity";
import type {
  ContentHero,
  ContentPagePlan,
  ContentPlan,
  ContentSectionPlan,
} from "../types/ContentPlan";
import type { InformationArchitecture } from "../types/InformationArchitecture";
import type { SEOPlan } from "../types/SEOPlan";
import type { UserJourney, UserJourneyStageName } from "../types/UserJourney";
import { applySeoTemplate } from "./seo-strategy";
import { buildSeoTemplateContext, type SeoTemplateContext } from "./seo-utils";
import {
  findContentPageTemplate,
  type ContentPageTemplate,
  type ContentSectionTemplate,
  type ContentStrategyRule,
} from "./content-strategy";

function journeyCtaForStage(userJourney: UserJourney, stage: UserJourneyStageName): string {
  return userJourney[stage].recommendedCTA;
}

function applyTemplateTokens(pattern: string, tokens: SeoTemplateContext): string {
  return applySeoTemplate(pattern, tokens).replace(/\s+/g, " ").trim();
}

function buildSectionPlan(
  template: ContentSectionTemplate,
  tokens: SeoTemplateContext,
): ContentSectionPlan {
  return {
    sectionName: template.sectionName,
    purpose: applyTemplateTokens(template.purposePattern, tokens),
    contentGuidelines: applyTemplateTokens(template.contentGuidelinesPattern, tokens),
    recommendedComponents: [...template.recommendedComponents],
    priority: template.priority,
  };
}

function buildFallbackPageTemplate(slug: string, strategy: ContentStrategyRule): ContentPageTemplate {
  return {
    slug,
    heroHeadlinePattern: `{business} ${slug.replace(/-/g, " ")}`,
    heroSubheadlinePattern: "{valueProposition}",
    headlinePattern: `{business} | ${slug.replace(/-/g, " ")}`,
    subheadlinePattern: "Professional content for {audience} in {country}.",
    ctaFromJourneyStage: "conversion",
    sectionTemplates: [
      {
        sectionName: "Main Content",
        purposePattern: `Deliver ${strategy.contentFocus} for ${slug}.`,
        contentGuidelinesPattern:
          "Use clear headings, scannable paragraphs, and brand-aligned tone for {audience}.",
        recommendedComponents: ["ContentBlock", "PrimaryCTA"],
        priority: "required",
      },
    ],
    faqTopics: [`What should I know about ${slug.replace(/-/g, " ")}?`],
    trustSignals: ["Professional presentation", "Clear next steps"],
    testimonialPrompts: ["Customer satisfaction highlights"],
    serviceHighlights: ["Core offering summary"],
    contactStrategyPattern: "Guide visitors to contact or conversion pages.",
  };
}

function buildHero(
  template: ContentPageTemplate,
  tokens: SeoTemplateContext,
  cta: string,
): ContentHero {
  return {
    headline: applyTemplateTokens(template.heroHeadlinePattern, tokens),
    subheadline: applyTemplateTokens(template.heroSubheadlinePattern, tokens),
    cta,
  };
}

function buildContentPagePlan(
  template: ContentPageTemplate,
  tokens: SeoTemplateContext,
  userJourney: UserJourney,
  architecture: InformationArchitecture,
): ContentPagePlan {
  const architecturePage = architecture.pages.find((page) => page.slug === template.slug);
  const cta = journeyCtaForStage(userJourney, template.ctaFromJourneyStage);
  const sections = template.sectionTemplates.map((sectionTemplate) =>
    buildSectionPlan(sectionTemplate, tokens),
  );

  if (architecturePage) {
    for (const sectionName of architecturePage.requiredSections) {
      const exists = sections.some(
        (entry) => entry.sectionName.toLowerCase() === sectionName.toLowerCase(),
      );
      if (!exists) {
        sections.push({
          sectionName,
          purpose: `Support ${architecturePage.title} with ${sectionName.toLowerCase()} content.`,
          contentGuidelines: `Follow ${tokens.business} brand tone: ${tokens.valueProposition}`,
          recommendedComponents: architecturePage.recommendedComponents.slice(0, 2),
          priority: "recommended",
        });
      }
    }
  }

  return {
    slug: template.slug,
    hero: buildHero(template, tokens, cta),
    headline: applyTemplateTokens(template.headlinePattern, tokens),
    subheadline: applyTemplateTokens(template.subheadlinePattern, tokens),
    cta,
    sections,
    faq: template.faqTopics.map((topic) => applyTemplateTokens(topic, tokens)),
    trustSignals: template.trustSignals.map((signal) => applyTemplateTokens(signal, tokens)),
    testimonials: template.testimonialPrompts.map((prompt) => applyTemplateTokens(prompt, tokens)),
    serviceHighlights: template.serviceHighlights.map((highlight) =>
      applyTemplateTokens(highlight, tokens),
    ),
    contactStrategy: applyTemplateTokens(template.contactStrategyPattern, tokens),
  };
}

/** Builds the full planner content plan for a strategy and SEO page list. */
export function buildContentPlanFromStrategy(
  strategy: ContentStrategyRule,
  seoPlan: SEOPlan,
  architecture: InformationArchitecture,
  brandIdentity: BrandIdentity,
  userJourney: UserJourney,
  industry: string,
  metadata: ReturnType<typeof readClientDiscoveryMetadata>,
  goal: string,
): ContentPlan {
  const tokens = buildSeoTemplateContext(brandIdentity, industry, metadata, goal);
  const pages = seoPlan.pages.map((seoPage) => {
    const template =
      findContentPageTemplate(strategy, seoPage.slug) ??
      buildFallbackPageTemplate(seoPage.slug, strategy);

    return buildContentPagePlan(template, tokens, userJourney, architecture);
  });

  return { pages };
}

export { buildSeoTemplateContext };

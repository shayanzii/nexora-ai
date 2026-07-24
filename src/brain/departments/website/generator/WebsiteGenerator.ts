import { readClientDiscoveryMetadata } from "../utils";
import type { BrandIdentity } from "../types/BrandIdentity";
import type { ContentPlan } from "../types/ContentPlan";
import type { InformationArchitecture } from "../types/InformationArchitecture";
import type { SEOPlan } from "../types/SEOPlan";
import type { UserJourney } from "../types/UserJourney";
import type { WebsiteExecutionInput } from "../types";
import type {
  BlueprintAnalyticsRecommendation,
  BlueprintBlogStrategy,
  BlueprintCtaLocation,
  BlueprintFooter,
  BlueprintForm,
  BlueprintNavigation,
  BlueprintNavigationItem,
  BlueprintPage,
  BlueprintPageContent,
  BlueprintPageCta,
  BlueprintPagePriority,
  BlueprintPageSeo,
  BlueprintSeo,
  BlueprintSiteMetadata,
  WebsiteBlueprint,
} from "../types/WebsiteBlueprint";

/** Aggregated planner outputs consumed by WebsiteGenerator. */
export interface WebsiteGeneratorInput {
  input: WebsiteExecutionInput;
  brandIdentity: BrandIdentity;
  userJourney: UserJourney;
  informationArchitecture: InformationArchitecture;
  seoPlan: SEOPlan;
  contentPlan: ContentPlan;
}

function resolvePagePriority(
  architecturePriority: string | undefined,
  seoPriority: string | undefined,
): BlueprintPagePriority {
  if (seoPriority === "critical") return "critical";
  if (architecturePriority === "required") return "required";
  if (seoPriority === "high") return "high";
  if (architecturePriority === "recommended") return "recommended";
  if (seoPriority === "medium") return "medium";
  if (architecturePriority === "optional") return "optional";
  return "low";
}

function buildSiteMetadata(generatorInput: WebsiteGeneratorInput): BlueprintSiteMetadata {
  const { input, brandIdentity } = generatorInput;
  const metadata = readClientDiscoveryMetadata(input.context.request.metadata);

  return {
    requestId: input.request.requestId,
    businessName: metadata.businessName ?? input.request.clientName,
    industry: input.request.industry,
    industryId: input.industryId,
    country: metadata.country ?? input.request.country,
    targetAudience: brandIdentity.targetAudience,
    primaryGoal: input.request.goals[0] ?? input.context.request.goal,
    generatedAt: input.context.createdAt,
    brandPersonality: [...brandIdentity.personality],
    toneOfVoice: brandIdentity.toneOfVoice,
    valueProposition: brandIdentity.valueProposition,
    visualStyle: brandIdentity.visualStyle,
    colorPalette: [...brandIdentity.colorPalette],
    typography: [...brandIdentity.typography],
  };
}

function buildNavigation(architecture: InformationArchitecture): BlueprintNavigation {
  const header: BlueprintNavigationItem[] = architecture.navigation.map((item) => ({
    label: item.label,
    slug: item.slug,
    priority: item.priority,
    isCta: item.location === "cta" || item.slug === architecture.primaryCTA.slug,
  }));

  const footer: BlueprintNavigationItem[] = architecture.footerNavigation.map((item) => ({
    label: item.label,
    slug: item.slug,
    priority: item.priority,
    isCta: false,
  }));

  return {
    header,
    footer,
    mobileStrategy: "Hamburger menu with sticky primary CTA on mobile.",
    stickyElements: ["primary-cta"],
  };
}

function buildPageSeo(seoPage: SEOPlan["pages"][number]): BlueprintPageSeo {
  return {
    title: seoPage.title,
    metaDescription: seoPage.metaDescription,
    focusKeyword: seoPage.focusKeyword,
    secondaryKeywords: [...seoPage.secondaryKeywords],
    headingSuggestions: [...seoPage.headingSuggestions],
    schemaType: seoPage.schemaType,
    canonicalUrl: seoPage.canonicalUrl,
    priority: seoPage.priority,
  };
}

function buildPageContent(contentPage: ContentPlan["pages"][number]): BlueprintPageContent {
  return {
    hero: { ...contentPage.hero },
    headline: contentPage.headline,
    subheadline: contentPage.subheadline,
    sections: contentPage.sections.map((section) => ({
      ...section,
      recommendedComponents: [...section.recommendedComponents],
    })),
    faq: [...contentPage.faq],
    trustSignals: [...contentPage.trustSignals],
    testimonials: [...contentPage.testimonials],
    serviceHighlights: [...contentPage.serviceHighlights],
    contactStrategy: contentPage.contactStrategy,
  };
}

function buildPageCta(
  contentPage: ContentPlan["pages"][number],
  architecture: InformationArchitecture,
): BlueprintPageCta {
  const isPrimaryConversion = architecture.conversionPages.includes(contentPage.slug);

  return {
    label: contentPage.cta,
    placement: isPrimaryConversion
      ? architecture.primaryCTA.placement
      : architecture.secondaryCTA.placement,
    slug: isPrimaryConversion ? architecture.primaryCTA.slug : contentPage.slug,
  };
}

function buildBlueprintPage(
  slug: string,
  architecture: InformationArchitecture,
  seoPlan: SEOPlan,
  contentPlan: ContentPlan,
): BlueprintPage {
  const architecturePage = architecture.pages.find((page) => page.slug === slug);
  const seoPage = seoPlan.pages.find((page) => page.slug === slug);
  const contentPage = contentPlan.pages.find((page) => page.slug === slug);

  if (!seoPage || !contentPage) {
    throw new Error(`Missing SEO or content plan for blueprint page: ${slug}`);
  }

  const title = architecturePage?.title ?? seoPage.title.split("|")[0]?.trim() ?? slug;
  const components = [
    ...new Set([
      ...contentPage.sections.flatMap((section) => section.recommendedComponents),
      ...(architecturePage?.recommendedComponents ?? []),
    ]),
  ];

  return {
    slug,
    title,
    sections: contentPage.sections.map((section) => section.sectionName),
    components,
    seo: buildPageSeo(seoPage),
    content: buildPageContent(contentPage),
    cta: buildPageCta(contentPage, architecture),
    priority: resolvePagePriority(architecturePage?.priority, seoPage.priority),
  };
}

function buildPages(generatorInput: WebsiteGeneratorInput): BlueprintPage[] {
  const { seoPlan, informationArchitecture, contentPlan } = generatorInput;

  return seoPlan.pages.map((seoPage) =>
    buildBlueprintPage(seoPage.slug, informationArchitecture, seoPlan, contentPlan),
  );
}

function buildPageContentMap(pages: BlueprintPage[]): Record<string, BlueprintPageContent> {
  return Object.fromEntries(pages.map((page) => [page.slug, page.content]));
}

function buildSeoAggregation(pages: BlueprintPage[]): BlueprintSeo {
  const homeSeo = pages.find((page) => page.slug === "home")?.seo;

  return {
    primaryKeywords: homeSeo
      ? [homeSeo.focusKeyword, ...homeSeo.secondaryKeywords.slice(0, 2)]
      : pages[0]?.seo.focusKeyword
        ? [pages[0].seo.focusKeyword]
        : [],
    pageIndexStrategy: `Index ${pages.length} blueprint pages with canonical URLs and schema markup.`,
    pages: pages.map((page) => page.seo),
  };
}

function collectComponents(pages: BlueprintPage[]): string[] {
  return [...new Set(pages.flatMap((page) => page.components))].sort();
}

function resolveFormType(slug: string): BlueprintForm["formType"] {
  if (slug.includes("book") || slug.includes("appointment") || slug.includes("reservation")) {
    return "booking";
  }

  if (slug.includes("quote")) {
    return "quote";
  }

  if (slug.includes("newsletter") || slug.includes("blog")) {
    return "newsletter";
  }

  return "contact";
}

function buildForms(pages: BlueprintPage[], architecture: InformationArchitecture): BlueprintForm[] {
  return architecture.conversionPages.map((slug) => {
    const page = pages.find((entry) => entry.slug === slug);

    return {
      id: `form-${slug}`,
      slug,
      pageTitle: page?.title ?? slug.replace(/-/g, " "),
      formType: resolveFormType(slug),
      fields:
        resolveFormType(slug) === "booking"
          ? ["name", "email", "phone", "date", "message"]
          : resolveFormType(slug) === "quote"
            ? ["name", "email", "phone", "service", "message"]
            : ["name", "email", "phone", "message"],
      purpose: page?.content.contactStrategy ?? `Capture leads on ${slug}.`,
    };
  });
}

function buildCtaLocations(
  architecture: InformationArchitecture,
  pages: BlueprintPage[],
): BlueprintCtaLocation[] {
  const siteLevel: BlueprintCtaLocation[] = [
    {
      label: architecture.primaryCTA.label,
      slug: architecture.primaryCTA.slug,
      placement: architecture.primaryCTA.placement,
      scope: "site",
    },
    {
      label: architecture.secondaryCTA.label,
      slug: architecture.secondaryCTA.slug,
      placement: architecture.secondaryCTA.placement,
      scope: "site",
    },
  ];

  const pageLevel: BlueprintCtaLocation[] = pages.map((page) => ({
    label: page.cta.label,
    slug: page.slug,
    placement: page.cta.placement,
    scope: "page",
  }));

  return [...siteLevel, ...pageLevel];
}

function buildFooter(architecture: InformationArchitecture): BlueprintFooter {
  return {
    items: architecture.footerNavigation.map((item) => ({
      label: item.label,
      slug: item.slug,
      priority: item.priority,
      isCta: false,
    })),
    legalPageSlugs: [...architecture.legalPages],
  };
}

function buildBlogStrategy(architecture: InformationArchitecture): BlueprintBlogStrategy {
  return {
    enabled: architecture.blogStrategy.enabled,
    rationale: architecture.blogStrategy.rationale,
    recommendedTopics: [...architecture.blogStrategy.recommendedTopics],
    parentSlug: architecture.blogStrategy.parentSlug,
  };
}

function buildAnalyticsRecommendations(
  pages: BlueprintPage[],
  architecture: InformationArchitecture,
  userJourney: UserJourney,
): BlueprintAnalyticsRecommendation[] {
  const conversionSlugs = architecture.conversionPages;

  return [
    {
      id: "analytics-page-view",
      event: "page_view",
      trigger: "Page load",
      pages: pages.map((page) => page.slug),
      tooling: "ga4",
      kpiMapping: "kpi-awareness",
    },
    {
      id: "analytics-journey-awareness",
      event: "journey_stage_view",
      trigger: userJourney.awareness.recommendedCTA,
      pages: [pages[0]?.slug ?? "home"],
      tooling: "ga4",
      kpiMapping: "kpi-awareness",
    },
    {
      id: "analytics-journey-consideration",
      event: "journey_stage_view",
      trigger: userJourney.consideration.recommendedCTA,
      pages: [architecture.secondaryCTA.slug],
      tooling: "ga4",
      kpiMapping: "kpi-consideration",
    },
    {
      id: "analytics-cta-click",
      event: "cta_click",
      trigger: architecture.primaryCTA.label,
      pages: conversionSlugs,
      tooling: "ga4",
      kpiMapping: "kpi-conversion",
    },
    {
      id: "analytics-form-submit",
      event: "form_submit",
      trigger: userJourney.conversion.recommendedCTA,
      pages: conversionSlugs,
      tooling: "ga4",
      kpiMapping: "kpi-conversion",
    },
  ];
}

/**
 * Website Generator — deterministic aggregation of all website planner outputs.
 */
export class WebsiteGenerator {
  readonly id = "website-generator";
  readonly version = "1.0.0";

  /** Generates a strongly typed WebsiteBlueprint from planner outputs. */
  generate(generatorInput: WebsiteGeneratorInput): WebsiteBlueprint {
    const { informationArchitecture, userJourney } = generatorInput;
    const pages = buildPages(generatorInput);

    return {
      siteMetadata: buildSiteMetadata(generatorInput),
      navigation: buildNavigation(informationArchitecture),
      pages,
      pageContent: buildPageContentMap(pages),
      seo: buildSeoAggregation(pages),
      components: collectComponents(pages),
      forms: buildForms(pages, informationArchitecture),
      ctaLocations: buildCtaLocations(informationArchitecture, pages),
      footer: buildFooter(informationArchitecture),
      blogStrategy: buildBlogStrategy(informationArchitecture),
      analyticsRecommendations: buildAnalyticsRecommendations(
        pages,
        informationArchitecture,
        userJourney,
      ),
    };
  }
}

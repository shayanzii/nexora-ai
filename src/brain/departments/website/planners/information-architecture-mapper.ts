import type {
  CTAAction,
  CTAStrategy,
  NavigationPlan,
  PagePlan,
  PageType,
  SiteArchitecture,
  SiteModel,
} from "../schema";
import type { WebsiteExecutionInput } from "../types";
import type { BrandIdentity as AnalyzerBrandIdentity } from "../types/BrandIdentity";
import type {
  ArchitectureCtaLocation,
  ArchitecturePage,
  InformationArchitecture,
} from "../types/InformationArchitecture";
import type { UserJourney } from "../types/UserJourney";
import { slugToPageId, slugToPath } from "./architecture-utils";

export interface MappedInformationArchitecture {
  siteArchitecture: SiteArchitecture;
  navigation: NavigationPlan;
  pages: PagePlan[];
  ctaStrategy: CTAStrategy;
}

function mapPageType(slug: string, title: string): PageType {
  const normalized = `${slug} ${title}`.toLowerCase();

  if (slug === "home") return "home";
  if (normalized.includes("blog")) return "blog";
  if (normalized.includes("faq")) return "faq";
  if (normalized.includes("privacy") || normalized.includes("terms")) return "legal";
  if (normalized.includes("testimonial")) return "testimonials";
  if (normalized.includes("gallery") || normalized.includes("portfolio")) return "portfolio";
  if (
    normalized.includes("book") ||
    normalized.includes("appointment") ||
    normalized.includes("reservation")
  ) {
    return "booking";
  }
  if (normalized.includes("consultation") || normalized.includes("quote")) return "landing";
  if (normalized.includes("contact")) return "contact";
  if (normalized.includes("about") || normalized.includes("doctor") || normalized.includes("attorney")) {
    return "about";
  }
  if (normalized.includes("menu") || normalized.includes("pricing")) return "pricing";
  if (normalized.includes("service") || normalized.includes("practice") || normalized.includes("insurance")) {
    return "services";
  }

  return "service-detail";
}

function mapCtaAction(label: string, pageType: PageType): CTAAction {
  const normalized = label.toLowerCase();

  if (
    normalized.includes("book") ||
    normalized.includes("reserve") ||
    normalized.includes("appointment")
  ) {
    return "book-appointment";
  }

  if (normalized.includes("quote")) {
    return "request-quote";
  }

  if (normalized.includes("call") || normalized.includes("phone")) {
    return "call-now";
  }

  if (normalized.includes("consultation") || normalized.includes("contact")) {
    return "contact-form";
  }

  if (
    normalized.includes("menu") ||
    normalized.includes("service") ||
    normalized.includes("explore") ||
    normalized.includes("view") ||
    normalized.includes("learn")
  ) {
    return "view-services";
  }

  return pageType === "booking" || pageType === "contact" || pageType === "landing"
    ? "contact-form"
    : "view-services";
}

function mapCtaPlacement(
  placement: ArchitectureCtaLocation["placement"],
): "hero" | "inline" | "sticky" | "footer" {
  if (placement === "hero") return "hero";
  if (placement === "sticky" || placement === "header") return "sticky";
  if (placement === "footer") return "footer";
  return "inline";
}

function mapSectionContentType(section: string): PagePlan["sections"][number]["contentType"] {
  const normalized = section.toLowerCase();

  if (normalized.includes("hero")) return "hero";
  if (normalized.includes("faq")) return "faq";
  if (normalized.includes("form") || normalized.includes("booking") || normalized.includes("reservation")) {
    return "form";
  }
  if (normalized.includes("review") || normalized.includes("testimonial") || normalized.includes("trust")) {
    return "trust";
  }
  if (normalized.includes("gallery") || normalized.includes("photo")) return "gallery";
  if (normalized.includes("map") || normalized.includes("location")) return "map";
  if (normalized.includes("cta")) return "cta";
  if (normalized.includes("contact") || normalized.includes("phone")) return "contact";
  if (normalized.includes("team") || normalized.includes("doctor") || normalized.includes("attorney")) {
    return "about";
  }
  if (normalized.includes("service") || normalized.includes("menu") || normalized.includes("practice")) {
    return "services";
  }

  return "trust";
}

function resolveSiteModel(pageCount: number): SiteModel {
  if (pageCount <= 4) {
    return "single-page";
  }

  if (pageCount >= 9) {
    return "multi-page";
  }

  return "hybrid";
}

function buildArchitectureDecision(
  input: WebsiteExecutionInput,
  architecture: InformationArchitecture,
  siteModel: SiteModel,
): SiteArchitecture["architectureDecision"] {
  const pageCount = architecture.pages.length;
  const primaryGoal = input.request.goals[0] ?? input.context.request.goal;

  return {
    decision: siteModel,
    score: siteModel === "multi-page" ? 84 : siteModel === "hybrid" ? 78 : 72,
    alternatives: [
      {
        model: "single-page",
        score: 72,
        summary: "Compact footprint for limited scope",
        blockers: pageCount > 5 ? ["Multiple content pages required"] : [],
      },
      {
        model: "multi-page",
        score: 84,
        summary: "Better SEO depth and journey-specific landing pages",
        blockers: [],
      },
      {
        model: "hybrid",
        score: 78,
        summary: "Homepage hub with focused supporting pages",
        blockers: pageCount > 8 ? ["Navigation complexity increases"] : [],
      },
    ],
    reasoning: [
      {
        step: 1,
        factor: "Page breadth",
        impact: "high",
        favoredModel: siteModel,
        detail: `${pageCount} planned pages across ${architecture.navigation.length} header destinations.`,
      },
      {
        step: 2,
        factor: "Conversion focus",
        impact: "high",
        favoredModel: siteModel,
        detail: `Conversion pages: ${architecture.conversionPages.join(", ")} for ${primaryGoal}.`,
      },
    ],
    confidence: pageCount >= 7 ? "high" : "medium",
    scoringDimensions: [
      {
        id: "seo-depth",
        label: "SEO depth",
        weight: 0.35,
        scoreSinglePage: 55,
        scoreMultiPage: 88,
        scoreHybrid: 74,
        evaluatedValue: `${pageCount} pages`,
        rationale: "More indexable pages improve topical coverage.",
      },
      {
        id: "conversion-focus",
        label: "Conversion focus",
        weight: 0.35,
        scoreSinglePage: 70,
        scoreMultiPage: 82,
        scoreHybrid: 80,
        evaluatedValue: architecture.primaryCTA.label,
        rationale: "Dedicated conversion pages reduce friction.",
      },
      {
        id: "navigation-clarity",
        label: "Navigation clarity",
        weight: 0.3,
        scoreSinglePage: 80,
        scoreMultiPage: 76,
        scoreHybrid: 84,
        evaluatedValue: `${architecture.navigation.length} header items`,
        rationale: "Header and footer navigation must remain scannable.",
      },
    ],
    decidedAt: input.context.createdAt,
  };
}

function mapPagePlan(
  page: ArchitecturePage,
  input: WebsiteExecutionInput,
  brand: AnalyzerBrandIdentity,
  architecture: InformationArchitecture,
): PagePlan {
  const pageType = mapPageType(page.slug, page.title);
  const pageId = slugToPageId(page.slug);
  const primaryGoal = input.request.goals[0] ?? input.context.request.goal;
  const isConversionPage = architecture.conversionPages.includes(page.slug);
  const primaryCtaLabel = isConversionPage
    ? architecture.primaryCTA.label
    : architecture.secondaryCTA.label;

  return {
    id: pageId,
    slug: slugToPath(page.slug),
    name: page.title,
    type: pageType,
    priority: page.priority,
    purpose: page.purpose,
    targetAudience: brand.targetAudience,
    primaryGoal,
    sections: page.requiredSections.map((section, index) => ({
      id: `${pageId}-section-${index + 1}`,
      name: section,
      purpose: `Support ${page.title} with ${section.toLowerCase()} content.`,
      priority: index + 1,
      contentType: mapSectionContentType(section),
      required: true,
    })),
    ctas: [
      {
        id: `${pageId}-cta-primary`,
        label: primaryCtaLabel,
        action: mapCtaAction(primaryCtaLabel, pageType),
        placement: isConversionPage ? "hero" : "inline",
        priority: isConversionPage ? "primary" : "secondary",
      },
    ],
    seo: {
      titlePattern: `${page.title} | ${input.request.clientName}`,
      metaDescriptionPattern: `${page.purpose} Serving ${input.request.country}.`,
      primaryKeywords: [
        ...brand.keywords.slice(0, 2),
        page.title.toLowerCase(),
        input.request.industry.toLowerCase(),
      ],
      schemaTypes: pageType === "home" ? ["LocalBusiness", "WebPage"] : ["WebPage"],
      localSeo: input.options.prioritizeLocalSeo && page.seoImportance !== "low",
    },
    integrations: isConversionPage ? ["form-handler", "analytics"] : ["analytics"],
    contentRequirements: page.requiredSections.map((section, index) => ({
      id: `${pageId}-content-${index + 1}`,
      topic: section,
      format: section.toLowerCase().includes("faq")
        ? "faq"
        : section.toLowerCase().includes("form")
          ? "short-copy"
          : "long-copy",
      priority: page.seoImportance === "critical" ? "required" : "recommended",
      notes: `Deliver ${section} using ${page.recommendedComponents[index] ?? "standard layout blocks"}.`,
    })),
    trustElements: page.seoImportance === "critical" || pageType === "testimonials"
      ? brand.brandValues.slice(0, 2)
      : [],
  };
}

function buildConversionPath(
  architecture: InformationArchitecture,
  userJourney: UserJourney,
): SiteArchitecture["conversionPath"] {
  const awarenessSlug =
    architecture.pages.find((page) =>
      userJourney.awareness.recommendedPages.some(
        (label) => page.title.toLowerCase() === label.toLowerCase(),
      ),
    )?.slug ?? "home";
  const considerationSlug =
    architecture.pages.find((page) =>
      userJourney.consideration.recommendedPages.some(
        (label) => page.title.toLowerCase() === label.toLowerCase(),
      ),
    )?.slug ?? architecture.secondaryCTA.slug;
  const conversionSlug = architecture.primaryCTA.slug;

  return [
    {
      step: 1,
      stage: "awareness",
      pageId: slugToPageId(awarenessSlug),
      action: userJourney.awareness.recommendedCTA,
    },
    {
      step: 2,
      stage: "consideration",
      pageId: slugToPageId(considerationSlug),
      action: userJourney.consideration.recommendedCTA,
    },
    {
      step: 3,
      stage: "conversion",
      pageId: slugToPageId(conversionSlug),
      action: userJourney.conversion.recommendedCTA,
    },
  ];
}

/**
 * Maps planner InformationArchitecture output to v1.1 WebsitePlan schema sections.
 */
export function mapPlannerInformationArchitectureToPlan(
  architecture: InformationArchitecture,
  input: WebsiteExecutionInput,
  brand: AnalyzerBrandIdentity,
  userJourney: UserJourney,
): MappedInformationArchitecture {
  const siteModel = resolveSiteModel(architecture.pages.length);
  const pages = architecture.pages.map((page) =>
    mapPagePlan(page, input, brand, architecture),
  );

  return {
    siteArchitecture: {
      model: siteModel,
      rationale: `Rule-based ${input.request.industry} information architecture with ${architecture.pages.length} pages and ${architecture.conversionPages.length} conversion destinations.`,
      maxDepth: Math.max(...architecture.pageHierarchy.map((node) => node.children.length), 1),
      homepageRole: "Primary entry point and journey hub",
      conversionPath: buildConversionPath(architecture, userJourney),
      architectureDecision: buildArchitectureDecision(input, architecture, siteModel),
    },
    navigation: {
      primary: architecture.navigation.map((item) => ({
        id: `nav-${item.slug}`,
        label: item.label,
        pageId: slugToPageId(item.slug),
        priority: item.priority,
        cta: item.slug === architecture.primaryCTA.slug,
      })),
      secondary: [],
      footer: architecture.footerNavigation.map((item) => ({
        id: `nav-footer-${item.slug}`,
        label: item.label,
        pageId: slugToPageId(item.slug),
        priority: item.priority,
      })),
      mobileStrategy: "Hamburger menu with sticky primary CTA",
      stickyElements: ["primary-cta"],
    },
    pages,
    ctaStrategy: {
      primaryCTA: {
        id: "cta-primary",
        label: architecture.primaryCTA.label,
        action: mapCtaAction(
          architecture.primaryCTA.label,
          mapPageType(architecture.primaryCTA.slug, architecture.primaryCTA.label),
        ),
        placement: mapCtaPlacement(architecture.primaryCTA.placement),
        priority: "primary",
      },
      secondaryCTAs: [
        {
          id: "cta-secondary",
          label: architecture.secondaryCTA.label,
          action: mapCtaAction(
            architecture.secondaryCTA.label,
            mapPageType(architecture.secondaryCTA.slug, architecture.secondaryCTA.label),
          ),
          placement: mapCtaPlacement(architecture.secondaryCTA.placement),
          priority: "secondary",
        },
      ],
      placementRules: [
        {
          pageType: "home",
          minCtaCount: 2,
          requiredActions: [
            mapCtaAction(architecture.secondaryCTA.label, "home"),
            mapCtaAction(architecture.primaryCTA.label, "home"),
          ],
          rationale: "Homepage must expose exploration and conversion paths.",
        },
      ],
      afterHoursStrategy: "Promote callback form and chatbot when available.",
      mobileStrategy: `Sticky ${architecture.primaryCTA.label} CTA on key conversion pages.`,
    },
  };
}

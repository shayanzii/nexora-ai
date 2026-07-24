import type {
  CTAAction,
  ContentRequirement,
  LeadCapturePoint,
  LeadGenerationStrategy,
  PagePlan,
  PageSectionPlan,
} from "../schema";
import type { WebsiteExecutionInput } from "../types";
import type { ContentPagePlan, ContentPlan, ContentSectionPlan } from "../types/ContentPlan";
import type { InformationArchitecture } from "../types/InformationArchitecture";
import { slugToPageId } from "./architecture-utils";

export interface MappedContentPlanOutput {
  pages: PagePlan[];
  leadGenerationStrategy: LeadGenerationStrategy;
}

function mapCtaAction(label: string): CTAAction {
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

  if (normalized.includes("consultation") || normalized.includes("contact")) {
    return "contact-form";
  }

  if (
    normalized.includes("menu") ||
    normalized.includes("service") ||
    normalized.includes("view") ||
    normalized.includes("explore")
  ) {
    return "view-services";
  }

  return "contact-form";
}

function mapSectionContentType(section: ContentSectionPlan): PageSectionPlan["contentType"] {
  const normalized = `${section.sectionName} ${section.purpose}`.toLowerCase();

  if (normalized.includes("hero")) return "hero";
  if (normalized.includes("faq")) return "faq";
  if (normalized.includes("form") || normalized.includes("booking") || normalized.includes("appointment")) {
    return "form";
  }
  if (normalized.includes("review") || normalized.includes("testimonial") || normalized.includes("trust")) {
    return "trust";
  }
  if (normalized.includes("gallery") || normalized.includes("photo")) return "gallery";
  if (normalized.includes("map") || normalized.includes("location") || normalized.includes("service area")) {
    return "map";
  }
  if (normalized.includes("contact") || normalized.includes("phone")) return "contact";
  if (normalized.includes("team") || normalized.includes("story") || normalized.includes("about")) {
    return "about";
  }
  if (normalized.includes("service") || normalized.includes("menu") || normalized.includes("practice")) {
    return "services";
  }

  return "cta";
}

function sectionPriorityValue(priority: ContentSectionPlan["priority"], index: number): number {
  if (priority === "required") return index + 1;
  if (priority === "recommended") return index + 10;
  return index + 20;
}

function buildPageSections(
  pageId: string,
  contentPage: ContentPagePlan,
): PageSectionPlan[] {
  const heroSection: PageSectionPlan = {
    id: `${pageId}-section-hero`,
    name: "Hero",
    purpose: contentPage.hero.headline,
    priority: 1,
    contentType: "hero",
    required: true,
  };

  const bodySections = contentPage.sections.map((section, index) => ({
    id: `${pageId}-section-${index + 2}`,
    name: section.sectionName,
    purpose: section.purpose,
    priority: sectionPriorityValue(section.priority, index + 1),
    contentType: mapSectionContentType(section),
    required: section.priority === "required",
  }));

  return [heroSection, ...bodySections];
}

function buildContentRequirements(
  pageId: string,
  contentPage: ContentPagePlan,
): ContentRequirement[] {
  const sectionRequirements = contentPage.sections.map((section, index) => ({
    id: `${pageId}-content-${index + 1}`,
    topic: section.sectionName,
    format: section.sectionName.toLowerCase().includes("faq")
      ? ("faq" as const)
      : section.sectionName.toLowerCase().includes("form")
        ? ("short-copy" as const)
        : ("long-copy" as const),
    priority: section.priority === "optional" ? ("recommended" as const) : ("required" as const),
    notes: `${section.contentGuidelines} Components: ${section.recommendedComponents.join(", ")}.`,
  }));

  const faqRequirements = contentPage.faq.map((question, index) => ({
    id: `${pageId}-faq-${index + 1}`,
    topic: question,
    format: "faq" as const,
    priority: "recommended" as const,
    notes: "Answer concisely with brand-aligned tone.",
  }));

  return [...sectionRequirements, ...faqRequirements];
}

function buildLeadCaptureFormType(slug: string): LeadGenerationStrategy["capturePoints"][number]["formType"] {
  if (slug.includes("book") || slug.includes("appointment") || slug.includes("reservation")) {
    return "booking";
  }

  if (slug.includes("quote")) {
    return "quote";
  }

  if (slug.includes("consultation")) {
    return "contact";
  }

  return "contact";
}

function buildLeadGenerationStrategy(
  contentPlan: ContentPlan,
  architecture: InformationArchitecture,
  input: WebsiteExecutionInput,
): LeadGenerationStrategy {
  const contentBySlug = new Map(contentPlan.pages.map((page) => [page.slug, page]));

  const capturePoints: LeadCapturePoint[] = architecture.conversionPages.map((slug) => {
    const contentPage = contentBySlug.get(slug);

    return {
      id: `capture-${slug}`,
      location: contentPage?.headline ?? slug.replace(/-/g, " "),
      pageId: slugToPageId(slug),
      formType: buildLeadCaptureFormType(slug),
      fields:
        slug.includes("quote")
          ? ["name", "email", "phone", "service", "message"]
          : slug.includes("book") || slug.includes("reservation")
            ? ["name", "email", "phone", "date", "message"]
            : ["name", "email", "phone", "message"],
      priority: slug.includes("contact") ? "secondary" : "primary",
    };
  });

  return {
    capturePoints,
    qualificationFlow: `Route ${input.request.industry} leads based on form type and page intent.`,
    routingTarget: "crm",
    followUpSequence: [
      "Immediate auto-reply confirmation",
      "Sales follow-up within 24 hours",
      "Second follow-up at 72 hours if no response",
    ],
    estimatedConversionPoints: capturePoints.length,
  };
}

function mergeContentIntoPage(page: PagePlan, contentPage: ContentPagePlan): PagePlan {
  const pageId = page.id;

  return {
    ...page,
    sections: buildPageSections(pageId, contentPage),
    ctas: [
      {
        id: `${pageId}-cta-primary`,
        label: contentPage.cta,
        action: mapCtaAction(contentPage.cta),
        placement: "hero",
        priority: "primary",
      },
      {
        id: `${pageId}-cta-secondary`,
        label: contentPage.hero.cta,
        action: mapCtaAction(contentPage.hero.cta),
        placement: "inline",
        priority: "secondary",
      },
    ],
    contentRequirements: buildContentRequirements(pageId, contentPage),
    trustElements: [...new Set([...page.trustElements, ...contentPage.trustSignals])],
    purpose: `${contentPage.headline}. ${contentPage.subheadline}`,
  };
}

/**
 * Maps planner ContentPlan output into WebsitePlan page content and lead generation fields.
 */
export function mapPlannerContentPlanToPlan(
  contentPlan: ContentPlan,
  input: WebsiteExecutionInput,
  architecture: InformationArchitecture,
  pages: PagePlan[],
): MappedContentPlanOutput {
  const contentBySlug = new Map(contentPlan.pages.map((page) => [page.slug, page]));

  const mergedPages = pages.map((page) => {
    const slugKey = page.slug === "/" ? "home" : page.slug.replace(/^\//, "");
    const contentPage = contentBySlug.get(slugKey);

    if (!contentPage) {
      return page;
    }

    return mergeContentIntoPage(page, contentPage);
  });

  return {
    pages: mergedPages,
    leadGenerationStrategy: buildLeadGenerationStrategy(contentPlan, architecture, input),
  };
}

import { resolveArchitectureStrategy } from "./planners/architecture-strategy";
import { titleToSlug } from "./planners/architecture-utils";
import { normalizeIndustryId } from "./utils";
import type { BlueprintPage, WebsiteExecutionAgentInput, WebsiteType } from "./WebsiteTypes";
import { INDUSTRY_WEBSITE_TYPE_MAP } from "./WebsiteTypes";

export interface PagePlannerInput {
  industry: string;
  websiteType: WebsiteType;
  goals: readonly string[];
  hasBooking: boolean;
  hasBlog: boolean;
}

/** Generates page architecture from industry rules. */
export function planPages(input: PagePlannerInput): BlueprintPage[] {
  const industryId = normalizeIndustryId(input.industry);
  const strategy = resolveArchitectureStrategy(mapArchitectureIndustryId(industryId));

  const pages = strategy.pages.map((rule) => ({
    slug: titleToSlug(rule.title),
    title: rule.title,
    purpose: rule.purpose,
    priority: rule.priority,
    inHeaderNav: rule.headerNav,
    inFooterNav: rule.footerNav,
    conversionPage: rule.conversionPage,
  }));

  if (input.hasBooking && !pages.some((page) => page.slug.includes("book"))) {
    pages.push({
      slug: "booking",
      title: "Booking",
      purpose: "Convert visitors into scheduled appointments.",
      priority: "required",
      inHeaderNav: true,
      inFooterNav: false,
      conversionPage: true,
    });
  }

  if (input.hasBlog && strategy.blogEnabled) {
    if (!pages.some((page) => page.slug === "blog")) {
      pages.push({
        slug: "blog",
        title: "Blog",
        purpose: "Publish educational content and improve organic search visibility.",
        priority: "recommended",
        inHeaderNav: true,
        inFooterNav: true,
        conversionPage: false,
      });
    }
  }

  return dedupePages(normalizeExecutionPages(pages, input.websiteType, input.hasBlog));
}

function normalizeExecutionPages(
  pages: BlueprintPage[],
  websiteType: WebsiteType,
  hasBlog: boolean,
): BlueprintPage[] {
  const normalized = pages.map((page) => {
    if (page.slug === "meet-the-doctor") {
      return { ...page, slug: "about", title: "About" };
    }
    if (page.slug === "book-appointment") {
      return { ...page, slug: "booking", title: "Booking" };
    }
    return page;
  });

  if (websiteType === "dental-clinic") {
    const coreSlugs = new Set(["home", "about", "services", "booking", "faq", "contact", "blog", "privacy", "terms"]);
    const filtered = normalized.filter((page) => coreSlugs.has(page.slug) || page.priority === "required");

    if (hasBlog && !filtered.some((page) => page.slug === "blog")) {
      filtered.push({
        slug: "blog",
        title: "Blog",
        purpose: "Publish patient education and local SEO content.",
        priority: "recommended",
        inHeaderNav: true,
        inFooterNav: true,
        conversionPage: false,
      });
    }

    return dedupePages(filtered);
  }

  if (hasBlog && !normalized.some((page) => page.slug === "blog")) {
    normalized.push({
      slug: "blog",
      title: "Blog",
      purpose: "Publish educational content and improve organic search visibility.",
      priority: "recommended",
      inHeaderNav: true,
      inFooterNav: true,
      conversionPage: false,
    });
  }

  return normalized;
}

export function resolveWebsiteType(industry: string, services: readonly string[]): WebsiteType {
  const industryId = normalizeIndustryId(industry);
  const mapped = INDUSTRY_WEBSITE_TYPE_MAP[industryId];
  if (mapped) return mapped;

  if (services.some((service) => service.toLowerCase().includes("landing"))) {
    return "landing-page";
  }

  return "business-website";
}

export function inferPlanningFlags(input: WebsiteExecutionAgentInput): {
  hasBooking: boolean;
  hasBlog: boolean;
  hasChatbot: boolean;
  city: string;
  country: string;
} {
  const text = [
    input.analysis.business,
    input.analysis.industry,
    ...input.analysis.requirements,
    ...input.analysis.goals,
    input.salesResult.proposal.executiveSummary,
  ]
    .join(" ")
    .toLowerCase();

  const metadata = input.metadata ?? {};
  const country =
    typeof metadata.country === "string"
      ? metadata.country
      : extractCountry(input.salesResult.customerSummary);

  const city =
    typeof metadata.city === "string"
      ? metadata.city
      : inferCity(country, input.analysis.industry);

  return {
    hasBooking: text.includes("booking") || text.includes("appointment"),
    hasBlog: text.includes("blog") || text.includes("seo") || text.includes("content"),
    hasChatbot: text.includes("chatbot") || text.includes("chat"),
    city,
    country,
  };
}

function extractCountry(summary: string): string {
  const match = summary.match(/operating in ([A-Za-z\s]+),/i);
  return match?.[1]?.trim() ?? "Canada";
}

function inferCity(country: string, industry: string): string {
  if (country.toLowerCase().includes("canada")) {
    return industry.toLowerCase().includes("dental") ? "Toronto" : "Local";
  }
  return "Local";
}

export function mapArchitectureIndustryId(industryId: string): string {
  if (industryId.includes("dental") || industryId.includes("dentist")) return "dental";
  if (industryId.includes("law") || industryId.includes("legal")) return "law-firm";
  if (industryId.includes("restaurant")) return "restaurant";
  if (industryId.includes("real-estate")) return "real-estate";
  return industryId;
}

function dedupePages(pages: BlueprintPage[]): BlueprintPage[] {
  const seen = new Set<string>();
  return pages.filter((page) => {
    if (seen.has(page.slug)) return false;
    seen.add(page.slug);
    return true;
  });
}

export function buildSiteArchitecture(
  pages: readonly BlueprintPage[],
  blogEnabled: boolean,
): import("./WebsiteTypes").SiteArchitecturePlan {
  const slugs = pages.map((page) => page.slug);
  return {
    model: pages.length <= 3 ? "single-page" : "multi-page",
    primaryPages: pages.filter((page) => page.inHeaderNav).map((page) => page.title),
    conversionPages: pages.filter((page) => page.conversionPage).map((page) => page.title),
    legalPages: pages
      .filter((page) => page.slug === "privacy" || page.slug === "terms")
      .map((page) => page.title),
    blogEnabled,
    hierarchy: [{ slug: "home", children: slugs.filter((slug) => slug !== "home") }],
  };
}

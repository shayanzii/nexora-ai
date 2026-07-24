import type { BlueprintPage, SeoPlan, WebsiteType } from "./WebsiteTypes";

export interface ExecutionSeoPlannerInput {
  business: string;
  industry: string;
  websiteType: WebsiteType;
  city: string;
  country: string;
  pages: readonly BlueprintPage[];
  goals: readonly string[];
}

/** Generates deterministic SEO plan for the website blueprint. */
export function planSeo(input: ExecutionSeoPlannerInput): SeoPlan {
  const location = input.city && input.city !== "Local" ? input.city : input.country;
  const primaryKeyword = buildPrimaryKeyword(input.industry, location);
  const secondaryKeywords = buildSecondaryKeywords(input.industry, input.goals, location);

  const pageTitles = input.pages.map((page) => ({
    slug: page.slug,
    title: buildPageTitle(page.title, input.business, location),
    metaDescription: buildMetaDescription(page, input.business, primaryKeyword),
  }));

  return {
    primaryKeywords: [primaryKeyword],
    secondaryKeywords,
    pageTitles,
    metaDescriptions: pageTitles.map((entry) => ({
      slug: entry.slug,
      title: entry.title,
      metaDescription: entry.metaDescription,
    })),
    internalLinkingStrategy: buildInternalLinking(input.pages),
    schemaRecommendations: buildSchemaRecommendations(input.websiteType),
    localSeoRecommendations: buildLocalSeo(input.websiteType, location, input.business),
  };
}

function buildPrimaryKeyword(industry: string, location: string): string {
  const lower = industry.toLowerCase();
  if (lower.includes("dental")) {
    return `${location} Dental Clinic`;
  }
  if (lower.includes("law")) {
    return `${location} Law Firm`;
  }
  const normalized = industry.replace(/ Firm| Agency/gi, "").trim();
  return `${location} ${normalized}`.trim();
}

function buildSecondaryKeywords(
  industry: string,
  goals: readonly string[],
  location: string,
): string[] {
  const keywords = new Set<string>([
    `${location} ${industry} near me`,
    `best ${industry.toLowerCase()} ${location}`,
    `${industry.toLowerCase()} appointments ${location}`,
  ]);

  for (const goal of goals) {
    if (goal.toLowerCase().includes("appointment")) {
      keywords.add(`${location} book appointment online`);
    }
  }

  return [...keywords].slice(0, 6);
}

function buildPageTitle(pageTitle: string, business: string, location: string): string {
  if (pageTitle.toLowerCase() === "home") {
    return `${business} | ${location}`;
  }
  return `${pageTitle} | ${business}`;
}

function buildMetaDescription(
  page: BlueprintPage,
  business: string,
  primaryKeyword: string,
): string {
  return `${business} — ${page.purpose} Optimized for ${primaryKeyword}. Book online or contact our team today.`;
}

function buildInternalLinking(pages: readonly BlueprintPage[]): string[] {
  const slugs = pages.map((page) => page.slug);
  const strategies = [
    "Homepage links to Services, Booking, and Contact as primary conversion paths.",
    "Service pages link to Booking and FAQ for decision-stage visitors.",
  ];

  if (slugs.includes("blog")) {
    strategies.push("Blog posts link to Services and Booking with contextual CTAs.");
  }

  if (slugs.includes("faq")) {
    strategies.push("FAQ answers link to relevant service and booking pages.");
  }

  return strategies;
}

function buildSchemaRecommendations(websiteType: WebsiteType): string[] {
  const base = ["Organization", "WebSite", "BreadcrumbList"];

  if (websiteType === "dental-clinic" || websiteType === "medical") {
    return [...base, "MedicalBusiness", "LocalBusiness", "FAQPage"];
  }
  if (websiteType === "restaurant") {
    return [...base, "Restaurant", "LocalBusiness"];
  }
  if (websiteType === "law-firm") {
    return [...base, "LegalService", "LocalBusiness"];
  }
  if (websiteType === "real-estate") {
    return [...base, "RealEstateAgent", "LocalBusiness"];
  }

  return [...base, "LocalBusiness"];
}

function buildLocalSeo(
  websiteType: WebsiteType,
  location: string,
  business: string,
): string[] {
  const localTypes: WebsiteType[] = [
    "dental-clinic",
    "medical",
    "restaurant",
    "law-firm",
    "real-estate",
  ];

  if (!localTypes.includes(websiteType)) {
    return ["Optimize title tags with service keywords and brand name."];
  }

  return [
    `Claim and optimize Google Business Profile for ${business} in ${location}.`,
    "Build location-specific landing content with NAP consistency.",
    "Collect and respond to Google reviews with structured markup.",
    "Create location schema with address, hours, and service area.",
  ];
}

import type { PagePlan, SEOPlan as PlanSeoPlan } from "../schema";
import type { WebsiteExecutionInput } from "../types";
import type { BrandIdentity as AnalyzerBrandIdentity } from "../types/BrandIdentity";
import type { SEOPlan as PlannerSeoPlan } from "../types/SEOPlan";
import { slugToPageId } from "./architecture-utils";

export interface MappedSeoPlanOutput {
  seoPlan: PlanSeoPlan;
  pages: PagePlan[];
}

function schemaTypesByPage(plannerSeo: PlannerSeoPlan): Map<string, string[]> {
  const grouped = new Map<string, string[]>();

  for (const page of plannerSeo.pages) {
    const pageId = slugToPageId(page.slug);
    const existing = grouped.get(page.schemaType) ?? [];
    grouped.set(page.schemaType, [...existing, pageId]);
  }

  return grouped;
}

function mergePageSeo(pages: PagePlan[], plannerSeo: PlannerSeoPlan): PagePlan[] {
  const seoBySlug = new Map(plannerSeo.pages.map((page) => [page.slug, page]));

  return pages.map((page) => {
    const slugKey = page.slug === "/" ? "home" : page.slug.replace(/^\//, "");
    const seoPage = seoBySlug.get(slugKey);

    if (!seoPage) {
      return page;
    }

    return {
      ...page,
      seo: {
        titlePattern: seoPage.title,
        metaDescriptionPattern: seoPage.metaDescription,
        primaryKeywords: [seoPage.focusKeyword, ...seoPage.secondaryKeywords.slice(0, 2)],
        schemaTypes: [seoPage.schemaType],
        localSeo: seoPage.priority === "critical" || seoPage.priority === "high",
      },
    };
  });
}

/**
 * Maps planner SEOPlan output to the v1.1 WebsitePlan SEOPlan schema and page SEO fields.
 */
export function mapPlannerSeoPlanToPlan(
  plannerSeo: PlannerSeoPlan,
  input: WebsiteExecutionInput,
  brand: AnalyzerBrandIdentity,
  pages: PagePlan[],
): MappedSeoPlanOutput {
  const homeSeo = plannerSeo.pages.find((page) => page.slug === "home");
  const primaryKeywords = homeSeo
    ? [homeSeo.focusKeyword, ...homeSeo.secondaryKeywords.slice(0, 2)]
    : [input.request.industry, `${input.request.industry} ${input.request.country}`];

  const schemaGrouped = schemaTypesByPage(plannerSeo);
  const schemaMarkup = [...schemaGrouped.entries()].map(([type, pageIds]) => ({
    type,
    pages: pageIds,
    rationale: `Structured data for ${type} pages supporting ${input.request.industry} search visibility.`,
  }));

  const contentSeoPriorities = plannerSeo.pages
    .slice()
    .sort((left, right) => {
      const rank = { critical: 0, high: 1, medium: 2, low: 3 };
      return rank[left.priority] - rank[right.priority];
    })
    .map((page) => page.title);

  const seoPlan: PlanSeoPlan = {
    primaryKeywords,
    localSeoStrategy: {
      googleBusinessProfile: input.options.prioritizeLocalSeo,
      napConsistency: true,
      serviceAreaPages: input.options.prioritizeLocalSeo,
      locationKeywords: [input.request.country, ...brand.keywords.slice(0, 2)],
      reviewStrategy: "Encourage post-service review requests on conversion pages.",
    },
    technicalRequirements: [
      "Mobile responsive",
      "Core Web Vitals baseline",
      "XML sitemap",
      "Canonical URLs",
      "Structured data validation",
    ],
    contentSeoPriorities,
    schemaMarkup,
    pageIndexStrategy: `Index ${plannerSeo.pages.length} SEO-optimized pages with canonical URLs and internal linking.`,
  };

  return {
    seoPlan,
    pages: mergePageSeo(pages, plannerSeo),
  };
}

import { planComponents } from "./ComponentPlanner";
import { planContent } from "./ContentPlanner";
import {
  planDeployment,
  planPerformanceStrategy,
  planResponsiveStrategy,
} from "./DeploymentPlanner";
import { planDesignSystem } from "./DesignSystemPlanner";
import { planNavigation } from "./NavigationPlanner";
import { planPages, resolveWebsiteType, buildSiteArchitecture, inferPlanningFlags } from "./PagePlanner";
import { planSections } from "./SectionPlanner";
import { planSeo } from "./SEOPlanner";
import { planTechStack } from "./TechStackPlanner";
import type {
  WebsiteExecutionAgentInput,
  WebsiteExecutionBlueprint,
} from "./WebsiteTypes";
import { WEBSITE_TYPE_LABELS } from "./WebsiteTypes";

/** Orchestrates all website planning modules into a unified blueprint. */
export function planWebsiteBlueprint(
  input: WebsiteExecutionAgentInput,
): WebsiteExecutionBlueprint {
  const flags = inferPlanningFlags(input);
  const services = input.salesResult.recommendedServices.map((service) => service.serviceId);
  const websiteType = resolveWebsiteType(input.analysis.industry, services);
  const pages = planPages({
    industry: input.analysis.industry,
    websiteType,
    goals: input.analysis.goals,
    hasBooking: flags.hasBooking,
    hasBlog: flags.hasBlog,
  });

  const siteArchitecture = buildSiteArchitecture(pages, flags.hasBlog);
  const navigation = planNavigation(pages);
  const pageSections = planSections(input.analysis.industry, pages);
  const components = planComponents(pages, {
    hasBooking: flags.hasBooking,
    hasChatbot: flags.hasChatbot,
    hasPricing: pages.some((page) => page.slug === "pricing"),
  });

  const targetAudience =
    typeof input.metadata?.targetAudience === "string"
      ? input.metadata.targetAudience
      : extractAudience(input.salesResult.customerSummary);

  const seoPlan = planSeo({
    business: input.analysis.business,
    industry: input.analysis.industry,
    websiteType,
    city: flags.city,
    country: flags.country,
    pages,
    goals: input.analysis.goals,
  });

  const contentPlan = planContent({
    business: input.analysis.business,
    industry: input.analysis.industry,
    targetAudience,
    goals: input.analysis.goals,
    pages,
  });

  const designSystem = planDesignSystem(websiteType, input.analysis.industry);
  const recommendedStack = planTechStack({
    hasBlog: flags.hasBlog,
    hasChatbot: flags.hasChatbot,
    complexity: input.analysis.estimatedComplexity,
  });

  const confidenceScore = calculateBlueprintConfidence(input, pages.length);

  return {
    requestId: input.plan.requestId,
    projectSummary: buildProjectSummary(input, websiteType),
    websiteType,
    websiteTypeLabel: WEBSITE_TYPE_LABELS[websiteType],
    recommendedStack,
    siteArchitecture,
    pages,
    navigation,
    pageSections,
    components,
    seoPlan,
    contentPlan,
    designSystem,
    responsiveStrategy: planResponsiveStrategy(),
    performanceStrategy: planPerformanceStrategy(),
    deploymentPlan: planDeployment(input.analysis.business, flags.country),
    estimatedTimeline: {
      minWeeks: input.analysis.estimatedTimeline.minWeeks,
      maxWeeks: input.analysis.estimatedTimeline.maxWeeks,
      summary: input.analysis.estimatedTimeline.summary,
    },
    confidenceScore,
    generatedAt: new Date().toISOString(),
  };
}

function buildProjectSummary(
  input: WebsiteExecutionAgentInput,
  websiteType: import("./WebsiteTypes").WebsiteType,
): string {
  return (
    `Website blueprint for ${input.analysis.business} (${WEBSITE_TYPE_LABELS[websiteType]}) ` +
    `supporting ${input.analysis.goals.join(", ").toLowerCase()}. ` +
    `Scoped from sales proposal with ${formatCurrency(input.pricingResult.oneTimePrice)} one-time ` +
    `and ${formatCurrency(input.pricingResult.monthlyRecurringRevenue)}/month recurring services.`
  );
}

function extractAudience(summary: string): string {
  const match = summary.match(/to reach (.+?)\./i);
  return match?.[1]?.trim() ?? "Target customers";
}

function calculateBlueprintConfidence(
  input: WebsiteExecutionAgentInput,
  pageCount: number,
): number {
  const salesConfidence = input.salesResult.confidenceScore;
  const ceoConfidence = input.analysis.confidence;
  const pricingConfidence = input.pricingResult.confidenceScore;
  const completeness = Math.min(1, pageCount / 8);

  const score =
    salesConfidence * 0.35 + ceoConfidence * 0.25 + pricingConfidence * 0.2 + completeness * 0.2;

  return Math.round(Math.min(1, Math.max(0, score)) * 100) / 100;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(amount);
}

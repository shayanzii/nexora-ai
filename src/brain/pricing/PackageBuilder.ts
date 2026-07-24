import type { SalesResult } from "../departments/sales/SalesTypes";

import type { PricingCatalog } from "./PricingCatalog";
import {
  extractBudgetFromSalesText,
  extractGoals,
  extractIndustryFromSummary,
  normalizeComplexity,
  recommendPackageTier,
} from "./PricingRules";
import type {
  PricingContext,
  PricingLineItem,
  PricingServiceId,
  RecommendedAddOn,
  RecommendedPackage,
} from "./PricingTypes";

export interface PackageBuilderInput {
  salesResult: SalesResult;
  catalog: PricingCatalog;
}

/** Builds recommended packages and add-ons from sales output. */
export function buildPackages(input: PackageBuilderInput): {
  packages: RecommendedPackage[];
  addOns: RecommendedAddOn[];
  context: PricingContext;
} {
  const context = buildPricingContext(input.salesResult);
  const packages: RecommendedPackage[] = [];
  const addOns: RecommendedAddOn[] = [];
  const selectedServiceIds = resolveSelectedServices(input.salesResult, input.catalog);

  for (const category of ["website", "seo", "ai"] as const) {
    const group = input.catalog.getPackageGroup(category);
    if (!group) continue;

    const hasService =
      (category === "website" && selectedServiceIds.has("website")) ||
      (category === "seo" && selectedServiceIds.has("seo")) ||
      (category === "ai" &&
        (selectedServiceIds.has("ai-chatbot") || selectedServiceIds.has("automation")));

    if (!hasService) continue;

    const tier = recommendPackageTier(group.tiers, {
      category,
      budget: context.budget,
      complexity: context.complexity,
      industry: context.industry,
      goals: context.goals,
      hasService,
    });

    packages.push({
      category,
      tier: tier.tier,
      name: tier.name,
      oneTimePrice: category === "seo" ? 0 : tier.oneTimePrice,
      monthlyPrice: tier.monthlyPrice,
      rationale: `Recommended ${tier.name} ${category} package for ${context.complexity} complexity.`,
    });
  }

  if (selectedServiceIds.has("automation") || mentionsBooking(input.salesResult)) {
    const booking = input.catalog.requireService("booking-system");
    addOns.push({
      id: "booking-system",
      name: booking.name,
      oneTimePrice: booking.oneTimePrice,
      monthlyPrice: booking.monthlyPrice,
      rationale: "Appointment booking automation supports the stated conversion goals.",
    });
  }

  return { packages, addOns, context };
}

export function buildPricingLineItems(
  packages: readonly RecommendedPackage[],
  addOns: readonly RecommendedAddOn[],
  catalog: PricingCatalog,
  selectedServiceIds: Set<PricingServiceId>,
): PricingLineItem[] {
  const items: PricingLineItem[] = [];

  for (const pkg of packages) {
    if (pkg.category === "website" && pkg.oneTimePrice > 0) {
      items.push({
        id: `pkg-${pkg.category}`,
        label: "Website",
        serviceId: "website",
        amount: pkg.oneTimePrice,
        billing: "one-time",
        category: "package",
      });
    }
  }

  for (const addOn of addOns) {
    if (addOn.oneTimePrice <= 0) continue;
    items.push({
      id: addOn.id,
      label: addOn.name,
      serviceId: addOn.id as PricingServiceId,
      amount: addOn.oneTimePrice,
      billing: "one-time",
      category: "addon",
    });
  }

  if (!items.some((item) => item.serviceId === "ai-chatbot") && selectedServiceIds.has("ai-chatbot")) {
    const chatbot = catalog.requireService("ai-chatbot");
    items.push({
      id: "ai-chatbot",
      label: chatbot.name,
      serviceId: "ai-chatbot",
      amount: chatbot.oneTimePrice,
      billing: "one-time",
      category: "service",
    });
  }

  return dedupeLineItems(items);
}

export function buildMonthlyLineItems(
  packages: readonly RecommendedPackage[],
  addOns: readonly RecommendedAddOn[],
  catalog: PricingCatalog,
  selectedServiceIds: Set<PricingServiceId>,
): PricingLineItem[] {
  const items: PricingLineItem[] = [];
  const config = catalog.getConfig();

  for (const serviceId of config.monthlyServices) {
    if (serviceId === "seo" && !selectedServiceIds.has("seo")) continue;
    if (serviceId === "voice-ai" && !selectedServiceIds.has("voice-ai")) continue;
    if (serviceId === "crm" && !selectedServiceIds.has("crm")) continue;
    if (serviceId === "ai-support" && !selectedServiceIds.has("ai-chatbot")) continue;

    const service = catalog.getService(serviceId);
    if (!service || service.monthlyPrice <= 0) continue;

    const pkgMonthly = packages.find((pkg) => {
      if (serviceId === "seo") return pkg.category === "seo";
      if (serviceId === "ai-support") return pkg.category === "ai";
      return false;
    });

    items.push({
      id: `monthly-${serviceId}`,
      label: service.name,
      serviceId,
      amount: pkgMonthly?.monthlyPrice ?? service.monthlyPrice,
      billing: "monthly",
      category: "service",
    });
  }

  for (const addOn of addOns) {
    if (addOn.monthlyPrice <= 0) continue;
    items.push({
      id: `monthly-${addOn.id}`,
      label: addOn.name,
      serviceId: addOn.id as PricingServiceId,
      amount: addOn.monthlyPrice,
      billing: "monthly",
      category: "addon",
    });
  }

  return dedupeLineItems(items);
}

export function buildPricingContext(salesResult: SalesResult): PricingContext {
  const executiveSummary = salesResult.proposal.executiveSummary;
  const complexityMatch = executiveSummary.match(/(\w+)-complexity/i)?.[1];

  return {
    budget: extractBudgetFromSalesText(salesResult.customerSummary, executiveSummary),
    industry: extractIndustryFromSummary(salesResult.customerSummary),
    complexity: normalizeComplexity(complexityMatch),
    goals: extractGoals(salesResult.businessChallenges, executiveSummary),
    primaryServiceIds: salesResult.recommendedServices.map((service) => service.serviceId),
    currency: "CAD",
  };
}

export function resolveSelectedServices(
  salesResult: SalesResult,
  catalog: PricingCatalog,
): Set<PricingServiceId> {
  const selected = new Set<PricingServiceId>();

  for (const recommendation of salesResult.recommendedServices) {
    if (recommendation.priority !== "primary") continue;
    const mapped = catalog.mapSalesServiceId(recommendation.serviceId);
    if (mapped) selected.add(mapped);
  }

  return selected;
}

function mentionsBooking(salesResult: SalesResult): boolean {
  const text = [
    ...salesResult.businessChallenges,
    ...salesResult.proposal.recommendedServices.map((service) => service.rationale),
    salesResult.proposal.executiveSummary,
  ]
    .join(" ")
    .toLowerCase();

  return text.includes("booking") || text.includes("appointment");
}

function dedupeLineItems(items: PricingLineItem[]): PricingLineItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.billing}:${item.label}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

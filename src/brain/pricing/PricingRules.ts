import type { PricingComplexity } from "./PricingTypes";
import type { CatalogPackageTier } from "./PricingCatalog";

export interface PackageRecommendationInput {
  category: "website" | "seo" | "ai";
  budget: number;
  complexity: PricingComplexity;
  industry: string;
  goals: readonly string[];
  hasService: boolean;
}

/** Selects the best package tier from configurable catalog tiers. */
export function recommendPackageTier(
  tiers: readonly CatalogPackageTier[],
  input: PackageRecommendationInput,
): CatalogPackageTier {
  if (!input.hasService) {
    return tiers[0];
  }

  const eligible = tiers.filter((tier) => matchesTier(tier, input));
  if (eligible.length > 0) {
    return eligible.sort((a, b) => scoreTier(b, input) - scoreTier(a, input))[0];
  }

  return tiers.reduce((best, tier) =>
    Math.abs(tier.oneTimePrice - input.budget) < Math.abs(best.oneTimePrice - input.budget)
      ? tier
      : best,
  );
}

function matchesTier(tier: CatalogPackageTier, input: PackageRecommendationInput): boolean {
  if (!tier.complexity.includes(input.complexity)) {
    return false;
  }
  if (tier.minBudget != null && input.budget < tier.minBudget) {
    return false;
  }
  if (tier.maxBudget != null && input.budget > tier.maxBudget) {
    return false;
  }
  return true;
}

function scoreTier(tier: CatalogPackageTier, input: PackageRecommendationInput): number {
  let score = 0;
  if (tier.complexity.includes(input.complexity)) score += 3;
  if (tier.minBudget != null && input.budget >= tier.minBudget) score += 2;
  if (tier.maxBudget != null && input.budget <= tier.maxBudget) score += 2;
  return score;
}

/** Determines default payment plan from budget and complexity. */
export function recommendPaymentPlanType(
  budget: number,
  complexity: PricingComplexity,
): import("./PricingTypes").PaymentPlanType {
  if (complexity === "enterprise" || budget >= 15000) {
    return "40-40-20";
  }
  if (budget >= 7000 || complexity === "high") {
    return "50-50";
  }
  if (budget <= 3000) {
    return "100-upfront";
  }
  return "50-50";
}

/** Maps complexity text from sales proposal to pricing complexity. */
export function normalizeComplexity(value: string | undefined): PricingComplexity {
  const normalized = (value ?? "medium").toLowerCase();
  if (normalized.includes("enterprise")) return "enterprise";
  if (normalized.includes("high")) return "high";
  if (normalized.includes("low")) return "low";
  return "medium";
}

/** Extracts numeric budget from sales result text. */
export function extractBudgetFromSalesText(...sources: readonly string[]): number {
  for (const source of sources) {
    const rangeMatch = source.match(/\$([\d,]+)\s*[–-]\s*\$([\d,]+)/);
    if (rangeMatch) {
      return parseInt(rangeMatch[2].replace(/,/g, ""), 10);
    }

    const upToMatch = source.match(/up to \$([\d,]+)/i);
    if (upToMatch) {
      return parseInt(upToMatch[1].replace(/,/g, ""), 10);
    }

    const investmentMatch = source.match(/investment of \$([\d,]+)/i);
    if (investmentMatch) {
      return parseInt(investmentMatch[1].replace(/,/g, ""), 10);
    }
  }

  return 7000;
}

/** Extracts industry id from customer summary. */
export function extractIndustryFromSummary(summary: string): string {
  const match = summary.match(/is a (.+?) business/i);
  return normalizeIndustryId(match?.[1] ?? "general");
}

export function normalizeIndustryId(industry: string): string {
  return industry.trim().toLowerCase().replace(/\s+/g, "-");
}

/** Extracts goals from business challenges and proposal text. */
export function extractGoals(
  businessChallenges: readonly string[],
  executiveSummary: string,
): string[] {
  const goals = businessChallenges
    .filter((challenge) => challenge.toLowerCase().startsWith("achieving goal:"))
    .map((challenge) => challenge.replace(/^Achieving goal:\s*/i, ""));

  if (goals.length > 0) {
    return goals;
  }

  const summaryGoal = executiveSummary.match(/seeking to (.+?)\./i)?.[1];
  return summaryGoal ? [summaryGoal] : ["Improve business outcomes"];
}

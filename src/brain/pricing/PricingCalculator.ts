import type { PricingCatalog } from "./PricingCatalog";
import {
  buildMonthlyLineItems,
  buildPackages,
  buildPricingLineItems,
  resolveSelectedServices,
} from "./PackageBuilder";
import { recommendPaymentPlanType } from "./PricingRules";
import type {
  PricingBreakdown,
  PricingLineItem,
  PricingResult,
  RecommendedAddOn,
  RecommendedPackage,
} from "./PricingTypes";
import type { SalesResult } from "../departments/sales/SalesTypes";

export interface PricingCalculatorInput {
  salesResult: SalesResult;
  catalog: PricingCatalog;
  paymentPlanType?: import("./PricingTypes").PaymentPlanType;
}

/** Applies catalog rules to compute pricing breakdown totals. */
export function calculatePricing(input: PricingCalculatorInput): {
  packages: RecommendedPackage[];
  addOns: RecommendedAddOn[];
  oneTimeItems: PricingLineItem[];
  monthlyItems: PricingLineItem[];
  breakdown: PricingBreakdown;
  oneTimePrice: number;
  monthlyRecurringRevenue: number;
  context: ReturnType<typeof buildPackages>["context"];
  selectedServiceIds: Set<import("./PricingTypes").PricingServiceId>;
  recommendedPaymentPlanType: import("./PricingTypes").PaymentPlanType;
} {
  const { packages, addOns, context } = buildPackages({
    salesResult: input.salesResult,
    catalog: input.catalog,
  });

  const selectedServiceIds = resolveSelectedServices(input.salesResult, input.catalog);
  const oneTimeItems = buildPricingLineItems(packages, addOns, input.catalog, selectedServiceIds);
  const monthlyItems = buildMonthlyLineItems(packages, addOns, input.catalog, selectedServiceIds);

  const oneTimePrice = sumItems(oneTimeItems);
  const monthlyRecurringRevenue = sumItems(monthlyItems);
  const config = input.catalog.getConfig();

  const breakdown: PricingBreakdown = {
    oneTimeItems,
    monthlyItems,
    oneTimeSubtotal: oneTimePrice,
    monthlySubtotal: monthlyRecurringRevenue,
    currency: config.currency,
  };

  const recommendedPaymentPlanType =
    input.paymentPlanType ?? recommendPaymentPlanType(context.budget, context.complexity);

  return {
    packages,
    addOns,
    oneTimeItems,
    monthlyItems,
    breakdown,
    oneTimePrice,
    monthlyRecurringRevenue,
    context,
    selectedServiceIds,
    recommendedPaymentPlanType,
  };
}

function sumItems(items: readonly PricingLineItem[]): number {
  return items.reduce((total, item) => total + item.amount, 0);
}

export function attachResultMetadata(
  base: Omit<PricingResult, "confidenceScore" | "generatedAt">,
  salesConfidence: number,
  completenessFactor: number,
): Pick<PricingResult, "confidenceScore" | "generatedAt"> {
  const confidenceScore =
    Math.round(Math.min(1, salesConfidence * 0.7 + completenessFactor * 0.3) * 100) / 100;

  return {
    confidenceScore,
    generatedAt: new Date().toISOString(),
  };
}

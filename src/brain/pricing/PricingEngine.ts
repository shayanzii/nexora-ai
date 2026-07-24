import type { SalesResult } from "../departments/sales/SalesTypes";

import { estimateImplementationCost } from "./CostEstimator";
import { getPricingCatalog, PricingCatalog } from "./PricingCatalog";
import { attachResultMetadata, calculatePricing } from "./PricingCalculator";
import { PricingValidationError } from "./PricingErrors";
import { buildPaymentPlan } from "./PaymentPlanner";
import { calculateProfit } from "./ProfitCalculator";
import { recommendUpsells } from "./UpsellEngine";
import type {
  PricingEngineInput,
  PricingEngineLogger,
  PricingEngineLogEvent,
  PricingEngineOptions,
  PricingResult,
} from "./PricingTypes";

/**
 * Production-ready deterministic Pricing Engine for Nexora Brain.
 * Consumes Sales Agent output — no LLM calls.
 */
export class PricingEngine {
  constructor(
    private readonly catalog: PricingCatalog = getPricingCatalog(),
    private readonly logger: PricingEngineLogger = defaultLogger,
  ) {}

  /** Generates full pricing from Sales Agent output. */
  price(salesResult: PricingEngineInput, options: PricingEngineOptions = {}): PricingResult {
    validateSalesResult(salesResult);

    const logger = options.logger ?? this.logger;
    const calculated = calculatePricing({
      salesResult,
      catalog: this.catalog,
      paymentPlanType: options.paymentPlanType,
    });

    logger({
      level: "info",
      action: "package",
      message: `Selected ${calculated.packages.length} packages for ${calculated.context.industry}.`,
    });

    logger({
      level: "info",
      action: "price",
      message: `One-time price calculated: ${calculated.oneTimePrice} ${calculated.breakdown.currency}.`,
    });

    logger({
      level: "info",
      action: "mrr",
      message: `MRR calculated: ${calculated.monthlyRecurringRevenue} ${calculated.breakdown.currency}/month.`,
    });

    const estimatedCost = estimateImplementationCost(calculated.oneTimeItems, this.catalog);
    const { grossProfit, profitMargin } = calculateProfit(
      calculated.oneTimePrice,
      estimatedCost,
    );

    logger({
      level: "info",
      action: "profit",
      message: `Profit calculated: ${grossProfit} (${profitMargin}% margin).`,
    });

    const businessText = [
      salesResult.customerSummary,
      ...salesResult.businessChallenges,
      salesResult.proposal.executiveSummary,
    ].join(" ");

    const recommendedUpsells = recommendUpsells({
      context: calculated.context,
      catalog: this.catalog,
      selectedServiceIds: calculated.selectedServiceIds,
      businessText,
    });

    logger({
      level: "info",
      action: "upsell",
      message: `Generated ${recommendedUpsells.length} upsell recommendations.`,
    });

    const paymentPlan = buildPaymentPlan(
      this.catalog,
      calculated.oneTimePrice,
      calculated.recommendedPaymentPlanType,
    );

    const completenessFactor = Math.min(1, salesResult.discoveryQuestions.length / 10);

    const result: PricingResult = {
      requestId: salesResult.requestId,
      currency: calculated.breakdown.currency,
      oneTimePrice: calculated.oneTimePrice,
      monthlyRecurringRevenue: calculated.monthlyRecurringRevenue,
      recommendedPackages: calculated.packages,
      recommendedAddOns: calculated.addOns,
      recommendedUpsells,
      estimatedCost,
      grossProfit,
      profitMargin,
      paymentPlan,
      pricingBreakdown: calculated.breakdown,
      ...attachResultMetadata(
        {
          requestId: salesResult.requestId,
          currency: calculated.breakdown.currency,
          oneTimePrice: calculated.oneTimePrice,
          monthlyRecurringRevenue: calculated.monthlyRecurringRevenue,
          recommendedPackages: calculated.packages,
          recommendedAddOns: calculated.addOns,
          recommendedUpsells,
          estimatedCost,
          grossProfit,
          profitMargin,
          paymentPlan,
          pricingBreakdown: calculated.breakdown,
        },
        salesResult.confidenceScore,
        completenessFactor,
      ),
    };

    logger({
      level: "info",
      action: "complete",
      message: `Pricing complete for request ${salesResult.requestId}.`,
    });

    return result;
  }
}

function validateSalesResult(salesResult: SalesResult): void {
  if (!salesResult.requestId?.trim()) {
    throw new PricingValidationError("Sales result must include requestId.");
  }
  if (!salesResult.recommendedServices?.length) {
    throw new PricingValidationError("Sales result must include recommended services.");
  }
  if (!salesResult.proposal?.executiveSummary?.trim()) {
    throw new PricingValidationError("Sales result must include a proposal executive summary.");
  }
}

function defaultLogger(event: PricingEngineLogEvent): void {
  console.info(
    "[pricing-engine]",
    JSON.stringify({ ...event, timestamp: new Date().toISOString() }),
  );
}

let defaultEngine: PricingEngine | undefined;

/** Returns the process-wide default Pricing Engine. */
export function getPricingEngine(): PricingEngine {
  if (!defaultEngine) {
    defaultEngine = new PricingEngine();
  }
  return defaultEngine;
}

/** Resets the default Pricing Engine. Intended for tests. */
export function resetPricingEngine(): void {
  defaultEngine = undefined;
}

export {
  PricingEngine,
  getPricingEngine,
  resetPricingEngine,
} from "./PricingEngine";

export { calculatePricing, attachResultMetadata } from "./PricingCalculator";
export { buildPackages, buildPricingLineItems, buildMonthlyLineItems, buildPricingContext, resolveSelectedServices } from "./PackageBuilder";
export { recommendUpsells } from "./UpsellEngine";
export { estimateImplementationCost } from "./CostEstimator";
export { calculateProfit } from "./ProfitCalculator";
export { buildPaymentPlan } from "./PaymentPlanner";
export {
  PricingCatalog,
  getPricingCatalog,
  resetPricingCatalog,
  DEFAULT_PRICING_CATALOG,
} from "./PricingCatalog";
export type {
  CatalogServicePrice,
  CatalogPackageTier,
  CatalogPackageGroup,
  IndustryUpsellDefinition,
  PaymentPlanDefinition,
  PricingCatalogConfig,
} from "./PricingCatalog";
export {
  recommendPackageTier,
  recommendPaymentPlanType,
  normalizeComplexity,
  extractBudgetFromSalesText,
  extractIndustryFromSummary,
  extractGoals,
  normalizeIndustryId,
} from "./PricingRules";
export type { PackageRecommendationInput } from "./PricingRules";

export {
  PricingError,
  PricingValidationError,
  PricingCatalogError,
  PricingCalculationError,
} from "./PricingErrors";
export type { PricingErrorCode } from "./PricingErrors";

export {
  PRICING_SERVICE_IDS,
} from "./PricingTypes";

export type {
  PricingServiceId,
  WebsitePackageTier,
  SeoPackageTier,
  AiPackageTier,
  PackageTier,
  PaymentPlanType,
  PricingComplexity,
  PricingLineItem,
  RecommendedPackage,
  RecommendedAddOn,
  RecommendedUpsell,
  PaymentInstallment,
  PaymentPlan,
  PricingBreakdown,
  PricingResult,
  PricingEngineInput,
  PricingContext,
  PricingEngineLogEvent,
  PricingEngineLogger,
  PricingEngineOptions,
} from "./PricingTypes";

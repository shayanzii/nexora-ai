import type { SalesResult } from "../departments/sales/SalesTypes";

/** Supported Nexora pricing service identifiers. */
export const PRICING_SERVICE_IDS = [
  "website",
  "landing-page",
  "seo",
  "local-seo",
  "ai-chatbot",
  "automation",
  "booking-system",
  "crm",
  "branding",
  "voice-ai",
  "mobile-app",
  "hosting",
  "maintenance",
  "analytics",
  "api-integrations",
  "ai-support",
] as const;

export type PricingServiceId = (typeof PRICING_SERVICE_IDS)[number];

export type WebsitePackageTier = "starter" | "professional" | "enterprise";
export type SeoPackageTier = "starter" | "growth" | "dominate";
export type AiPackageTier = "basic" | "advanced" | "enterprise";

export type PackageTier = WebsitePackageTier | SeoPackageTier | AiPackageTier;

export type PaymentPlanType =
  | "100-upfront"
  | "50-50"
  | "40-40-20"
  | "monthly-subscription"
  | "custom";

export type PricingComplexity = "low" | "medium" | "high" | "enterprise";

export interface PricingLineItem {
  id: string;
  label: string;
  serviceId?: PricingServiceId;
  amount: number;
  billing: "one-time" | "monthly";
  category: "service" | "package" | "addon" | "upsell";
}

export interface RecommendedPackage {
  category: "website" | "seo" | "ai";
  tier: PackageTier;
  name: string;
  oneTimePrice: number;
  monthlyPrice: number;
  rationale: string;
}

export interface RecommendedAddOn {
  id: string;
  name: string;
  oneTimePrice: number;
  monthlyPrice: number;
  rationale: string;
}

export interface RecommendedUpsell {
  id: string;
  name: string;
  oneTimePrice: number;
  monthlyPrice: number;
  rationale: string;
  industry?: string;
}

export interface PaymentInstallment {
  label: string;
  percentage: number;
  amount: number;
  due: string;
}

export interface PaymentPlan {
  type: PaymentPlanType;
  name: string;
  description: string;
  installments: readonly PaymentInstallment[];
}

export interface PricingBreakdown {
  oneTimeItems: readonly PricingLineItem[];
  monthlyItems: readonly PricingLineItem[];
  oneTimeSubtotal: number;
  monthlySubtotal: number;
  currency: string;
}

/** Full pricing output from the Pricing Engine. */
export interface PricingResult {
  requestId: string;
  currency: string;
  oneTimePrice: number;
  monthlyRecurringRevenue: number;
  recommendedPackages: readonly RecommendedPackage[];
  recommendedAddOns: readonly RecommendedAddOn[];
  recommendedUpsells: readonly RecommendedUpsell[];
  estimatedCost: number;
  grossProfit: number;
  profitMargin: number;
  paymentPlan: PaymentPlan;
  pricingBreakdown: PricingBreakdown;
  confidenceScore: number;
  generatedAt: string;
}

/** Primary input — Sales Agent output. */
export type PricingEngineInput = SalesResult;

export interface PricingContext {
  budget: number;
  industry: string;
  complexity: PricingComplexity;
  goals: readonly string[];
  primaryServiceIds: readonly string[];
  currency: string;
}

export interface PricingEngineLogEvent {
  level: "info" | "error";
  action: "package" | "price" | "mrr" | "profit" | "upsell" | "complete";
  message: string;
}

export type PricingEngineLogger = (event: PricingEngineLogEvent) => void;

export interface PricingEngineOptions {
  paymentPlanType?: PaymentPlanType;
  logger?: PricingEngineLogger;
}

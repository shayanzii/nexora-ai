import type {
  AiPackageTier,
  PricingComplexity,
  PricingServiceId,
  SeoPackageTier,
  WebsitePackageTier,
} from "./PricingTypes";

export interface CatalogServicePrice {
  id: PricingServiceId;
  name: string;
  oneTimePrice: number;
  monthlyPrice: number;
  implementationCostRate: number;
  aliases: readonly string[];
}

export interface CatalogPackageTier {
  tier: WebsitePackageTier | SeoPackageTier | AiPackageTier;
  name: string;
  oneTimePrice: number;
  monthlyPrice: number;
  implementationCostRate: number;
  maxBudget?: number;
  minBudget?: number;
  complexity: readonly PricingComplexity[];
}

export interface CatalogPackageGroup {
  category: "website" | "seo" | "ai";
  tiers: readonly CatalogPackageTier[];
}

export interface IndustryUpsellDefinition {
  id: string;
  name: string;
  oneTimePrice: number;
  monthlyPrice: number;
  rationale: string;
  triggers: readonly string[];
}

export interface PaymentPlanDefinition {
  type: import("./PricingTypes").PaymentPlanType;
  name: string;
  description: string;
  installments: readonly { label: string; percentage: number; due: string }[];
}

/** Configurable pricing catalog — single source of truth for all Nexora pricing. */
export interface PricingCatalogConfig {
  currency: string;
  defaultImplementationCostRate: number;
  targetProfitMargin: number;
  services: readonly CatalogServicePrice[];
  packages: readonly CatalogPackageGroup[];
  monthlyServices: readonly PricingServiceId[];
  industryUpsells: Readonly<Record<string, readonly IndustryUpsellDefinition[]>>;
  paymentPlans: readonly PaymentPlanDefinition[];
  salesServiceMap: Readonly<Record<string, PricingServiceId>>;
}

export const DEFAULT_PRICING_CATALOG: PricingCatalogConfig = {
  currency: "CAD",
  defaultImplementationCostRate: 0.44,
  targetProfitMargin: 0.56,
  services: [
    { id: "website", name: "Website", oneTimePrice: 4500, monthlyPrice: 0, implementationCostRate: 0.42, aliases: ["website", "business-website"] },
    { id: "landing-page", name: "Landing Page", oneTimePrice: 1800, monthlyPrice: 0, implementationCostRate: 0.4, aliases: ["landing-page", "landing"] },
    { id: "seo", name: "SEO", oneTimePrice: 1200, monthlyPrice: 299, implementationCostRate: 0.35, aliases: ["seo"] },
    { id: "local-seo", name: "Local SEO", oneTimePrice: 800, monthlyPrice: 199, implementationCostRate: 0.35, aliases: ["local-seo", "local seo"] },
    { id: "ai-chatbot", name: "AI Chatbot", oneTimePrice: 1000, monthlyPrice: 149, implementationCostRate: 0.38, aliases: ["ai-chatbot", "chatbot"] },
    { id: "automation", name: "Automation", oneTimePrice: 900, monthlyPrice: 79, implementationCostRate: 0.4, aliases: ["automation", "workflow-automation"] },
    { id: "booking-system", name: "Booking System", oneTimePrice: 1000, monthlyPrice: 0, implementationCostRate: 0.36, aliases: ["booking", "booking-system"] },
    { id: "crm", name: "CRM", oneTimePrice: 1500, monthlyPrice: 99, implementationCostRate: 0.45, aliases: ["crm", "crm-integration"] },
    { id: "branding", name: "Branding", oneTimePrice: 2200, monthlyPrice: 0, implementationCostRate: 0.4, aliases: ["branding", "brand"] },
    { id: "voice-ai", name: "Voice AI", oneTimePrice: 2500, monthlyPrice: 199, implementationCostRate: 0.42, aliases: ["voice-ai", "voice"] },
    { id: "mobile-app", name: "Mobile App", oneTimePrice: 12000, monthlyPrice: 149, implementationCostRate: 0.5, aliases: ["mobile-app", "app"] },
    { id: "hosting", name: "Hosting", oneTimePrice: 0, monthlyPrice: 39, implementationCostRate: 0.25, aliases: ["hosting"] },
    { id: "maintenance", name: "Maintenance", oneTimePrice: 0, monthlyPrice: 99, implementationCostRate: 0.3, aliases: ["maintenance"] },
    { id: "analytics", name: "Analytics", oneTimePrice: 600, monthlyPrice: 49, implementationCostRate: 0.35, aliases: ["analytics"] },
    { id: "api-integrations", name: "API Integrations", oneTimePrice: 1800, monthlyPrice: 79, implementationCostRate: 0.45, aliases: ["api-integrations", "integrations"] },
    { id: "ai-support", name: "AI Support", oneTimePrice: 0, monthlyPrice: 149, implementationCostRate: 0.32, aliases: ["ai-support"] },
  ],
  packages: [
    {
      category: "website",
      tiers: [
        { tier: "starter", name: "Starter", oneTimePrice: 2500, monthlyPrice: 0, implementationCostRate: 0.4, maxBudget: 4000, complexity: ["low"] },
        { tier: "professional", name: "Professional", oneTimePrice: 4500, monthlyPrice: 0, implementationCostRate: 0.42, minBudget: 4000, maxBudget: 9000, complexity: ["low", "medium"] },
        { tier: "enterprise", name: "Enterprise", oneTimePrice: 9000, monthlyPrice: 0, implementationCostRate: 0.48, minBudget: 9000, complexity: ["high", "enterprise"] },
      ],
    },
    {
      category: "seo",
      tiers: [
        { tier: "starter", name: "Starter", oneTimePrice: 800, monthlyPrice: 199, implementationCostRate: 0.35, maxBudget: 5000, complexity: ["low"] },
        { tier: "growth", name: "Growth", oneTimePrice: 1200, monthlyPrice: 299, implementationCostRate: 0.35, minBudget: 5000, maxBudget: 10000, complexity: ["medium"] },
        { tier: "dominate", name: "Dominate", oneTimePrice: 2400, monthlyPrice: 499, implementationCostRate: 0.38, minBudget: 10000, complexity: ["high", "enterprise"] },
      ],
    },
    {
      category: "ai",
      tiers: [
        { tier: "basic", name: "Basic", oneTimePrice: 800, monthlyPrice: 99, implementationCostRate: 0.38, maxBudget: 5000, complexity: ["low"] },
        { tier: "advanced", name: "Advanced", oneTimePrice: 1500, monthlyPrice: 149, implementationCostRate: 0.38, minBudget: 5000, maxBudget: 10000, complexity: ["medium"] },
        { tier: "enterprise", name: "Enterprise", oneTimePrice: 3500, monthlyPrice: 249, implementationCostRate: 0.42, minBudget: 10000, complexity: ["high", "enterprise"] },
      ],
    },
  ],
  monthlyServices: ["hosting", "maintenance", "seo", "ai-support", "analytics", "crm", "voice-ai"],
  industryUpsells: {
    "dental-clinic": [
      { id: "google-reviews", name: "Google Reviews Automation", oneTimePrice: 800, monthlyPrice: 79, rationale: "Automate review requests after appointments to improve local trust.", triggers: ["appointment", "booking", "reviews"] },
      { id: "appointment-sms", name: "Appointment Reminder SMS", oneTimePrice: 600, monthlyPrice: 49, rationale: "Reduce no-shows with automated SMS reminders.", triggers: ["appointment", "booking", "reminder"] },
      { id: "patient-portal", name: "Patient Portal", oneTimePrice: 3500, monthlyPrice: 99, rationale: "Self-service portal for forms, history, and rebooking.", triggers: ["patient", "portal", "dental"] },
      { id: "voice-receptionist", name: "Voice AI Receptionist", oneTimePrice: 2500, monthlyPrice: 199, rationale: "Answer after-hours calls and book appointments automatically.", triggers: ["phone", "calls", "appointment"] },
    ],
    restaurant: [
      { id: "online-ordering", name: "Online Ordering", oneTimePrice: 3000, monthlyPrice: 129, rationale: "Capture direct orders and reduce third-party commission fees.", triggers: ["order", "menu", "restaurant"] },
      { id: "delivery-integration", name: "Delivery Integration", oneTimePrice: 1800, monthlyPrice: 89, rationale: "Connect kitchen workflow with delivery partners.", triggers: ["delivery", "restaurant"] },
      { id: "loyalty-system", name: "Loyalty System", oneTimePrice: 2200, monthlyPrice: 79, rationale: "Increase repeat visits with points and rewards.", triggers: ["loyalty", "repeat", "restaurant"] },
    ],
    "real-estate": [
      { id: "mls-integration", name: "MLS Integration", oneTimePrice: 4000, monthlyPrice: 149, rationale: "Sync listings automatically from MLS feeds.", triggers: ["mls", "listings", "real estate"] },
      { id: "lead-automation", name: "Lead Automation", oneTimePrice: 1500, monthlyPrice: 99, rationale: "Instant follow-up on property inquiries.", triggers: ["lead", "inquiry", "real estate"] },
      { id: "crm-upsell", name: "CRM Pipeline", oneTimePrice: 1500, monthlyPrice: 99, rationale: "Track buyers and sellers through closing.", triggers: ["crm", "pipeline", "real estate"] },
    ],
  },
  paymentPlans: [
    { type: "100-upfront", name: "100% Upfront", description: "Full payment before project kickoff.", installments: [{ label: "Project kickoff", percentage: 100, due: "On contract signing" }] },
    { type: "50-50", name: "50 / 50", description: "Half at kickoff, half at delivery.", installments: [{ label: "Kickoff", percentage: 50, due: "On contract signing" }, { label: "Delivery", percentage: 50, due: "At final delivery" }] },
    { type: "40-40-20", name: "40 / 40 / 20", description: "Phased payments aligned to milestones.", installments: [{ label: "Kickoff", percentage: 40, due: "On contract signing" }, { label: "Mid-project", percentage: 40, due: "At build milestone" }, { label: "Delivery", percentage: 20, due: "At final delivery" }] },
    { type: "monthly-subscription", name: "Monthly Subscription", description: "One-time setup plus recurring monthly billing.", installments: [{ label: "Setup fee", percentage: 100, due: "On contract signing" }] },
    { type: "custom", name: "Custom", description: "Custom payment schedule negotiated during sales.", installments: [{ label: "Custom schedule", percentage: 100, due: "As negotiated" }] },
  ],
  salesServiceMap: {
    website: "website",
    seo: "seo",
    "ai-chatbot": "ai-chatbot",
    automation: "automation",
    crm: "crm",
    branding: "branding",
    "voice-ai": "voice-ai",
    "mobile-app": "mobile-app",
    maintenance: "maintenance",
    hosting: "hosting",
  },
};

/** Read-only pricing catalog accessor. */
export class PricingCatalog {
  constructor(private readonly config: PricingCatalogConfig = DEFAULT_PRICING_CATALOG) {}

  getConfig(): Readonly<PricingCatalogConfig> {
    return this.config;
  }

  getService(id: PricingServiceId): CatalogServicePrice | undefined {
    return this.config.services.find((service) => service.id === id);
  }

  requireService(id: PricingServiceId): CatalogServicePrice {
    const service = this.getService(id);
    if (!service) {
      throw new Error(`Pricing catalog missing service '${id}'.`);
    }
    return service;
  }

  getPackageGroup(category: "website" | "seo" | "ai"): CatalogPackageGroup | undefined {
    return this.config.packages.find((group) => group.category === category);
  }

  getPaymentPlan(type: import("./PricingTypes").PaymentPlanType): PaymentPlanDefinition | undefined {
    return this.config.paymentPlans.find((plan) => plan.type === type);
  }

  getIndustryUpsells(industryId: string): readonly IndustryUpsellDefinition[] {
    return this.config.industryUpsells[industryId] ?? [];
  }

  mapSalesServiceId(salesServiceId: string): PricingServiceId | undefined {
    return this.config.salesServiceMap[salesServiceId];
  }
}

let defaultCatalog: PricingCatalog | undefined;

export function getPricingCatalog(): PricingCatalog {
  if (!defaultCatalog) {
    defaultCatalog = new PricingCatalog();
  }
  return defaultCatalog;
}

export function resetPricingCatalog(): void {
  defaultCatalog = undefined;
}

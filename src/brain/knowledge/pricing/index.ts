import type { ServicePricing, PricingPolicy } from "../types";

export const PRICING_POLICY: PricingPolicy = {
  currency: "CAD",
  defaultServiceEstimate: 500,
  multiServiceTimeline: {
    single: {
      minimumWeeks: 2,
      maximumWeeks: 3,
      summary: "Single-service projects typically launch within 2–3 weeks.",
    },
    multi: {
      minimumWeeks: 3,
      maximumWeeks: 5,
      summary: "Multi-service projects typically launch within 3–5 weeks.",
    },
    complex: {
      minimumWeeks: 5,
      maximumWeeks: 8,
      summary: "Complex multi-service projects typically launch within 5–8 weeks.",
    },
  },
};

export const SERVICE_PRICING: ServicePricing[] = [
  {
    serviceId: "business-website",
    currency: "CAD",
    minimum: 1500,
    maximumMultiplier: 1.35,
    defaultEstimate: 1500,
    notes: "Includes IA, integration scope, and conversion mapping.",
  },
  {
    serviceId: "ai-chatbot",
    currency: "CAD",
    minimum: 500,
    maximumMultiplier: 1.35,
    defaultEstimate: 500,
    notes: "Starter chatbot with FAQ and lead capture.",
  },
  {
    serviceId: "ai-voice-agent",
    currency: "CAD",
    minimum: 1000,
    maximumMultiplier: 1.35,
    defaultEstimate: 1000,
    notes: "Includes call flow design and phone integration.",
  },
  {
    serviceId: "workflow-automation",
    currency: "CAD",
    minimum: 800,
    maximumMultiplier: 1.35,
    defaultEstimate: 800,
    notes: "Per workflow cluster; complex automations scoped separately.",
  },
  {
    serviceId: "crm-integration",
    currency: "CAD",
    minimum: 600,
    maximumMultiplier: 1.35,
    defaultEstimate: 600,
    notes: "Field mapping and sync rules for one CRM platform.",
  },
  {
    serviceId: "social-media-management",
    currency: "CAD",
    minimum: 400,
    maximumMultiplier: 1.35,
    defaultEstimate: 400,
    notes: "DM automation and inquiry capture for primary social channel.",
  },
  {
    serviceId: "booking",
    currency: "CAD",
    minimum: 400,
    maximumMultiplier: 1.35,
    defaultEstimate: 400,
    notes: "Calendar-integrated booking module.",
  },
  {
    serviceId: "leads",
    currency: "CAD",
    minimum: 350,
    maximumMultiplier: 1.35,
    defaultEstimate: 350,
    notes: "Lead capture forms and routing.",
  },
  {
    serviceId: "support",
    currency: "CAD",
    minimum: 450,
    maximumMultiplier: 1.35,
    defaultEstimate: 450,
    notes: "FAQ deflection and escalation setup.",
  },
];

export const PRICING_ALIASES: Record<string, string> = {
  website: "business-website",
  chatbot: "ai-chatbot",
  receptionist: "ai-voice-agent",
  automation: "workflow-automation",
  crm: "crm-integration",
  "social-media": "social-media-management",
};

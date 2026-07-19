export type PricingPlanId = "starter" | "growth" | "pro" | "enterprise";

export type PricingPlan = {
  id: PricingPlanId;
  name: string;
  price: string;
  priceNote?: string;
  description: string;
  bestFor?: string[];
  includes: string[];
  featured?: boolean;
  cta: "consultation" | "sales";
  ctaLabel: string;
};

export type MonthlySupportTier = {
  plan: string;
  price: string;
  includes: string[];
};

export type PricingFaqItem = {
  question: string;
  answer: string;
};

export const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "CA$199",
    priceNote: "one-time setup",
    description: "Launch AI chat and capture leads fast—ideal for local businesses getting started.",
    bestFor: ["Restaurants", "Barbershops", "Small local businesses"],
    includes: [
      "AI Chat Widget",
      "Lead Form",
      "Contact Form",
      "Basic Setup",
      "14 days support",
    ],
    cta: "consultation",
    ctaLabel: "Book Free Consultation",
  },
  {
    id: "growth",
    name: "Growth",
    price: "CA$399",
    priceNote: "one-time setup",
    description: "Everything you need to convert, book, and nurture customers automatically.",
    featured: true,
    includes: [
      "Everything in Starter",
      "CRM Integration",
      "Appointment Booking",
      "Email Automation",
      "Analytics",
      "30 days support",
    ],
    cta: "consultation",
    ctaLabel: "Book Free Consultation",
  },
  {
    id: "pro",
    name: "Pro",
    price: "CA$699",
    priceNote: "one-time setup",
    description: "Voice AI and advanced automations for teams ready to scale operations.",
    includes: [
      "Everything in Growth",
      "AI Voice Agent",
      "Advanced Automations",
      "Priority Support",
      "Custom Integrations",
    ],
    cta: "consultation",
    ctaLabel: "Book Free Consultation",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    priceNote: "tailored scope",
    description: "Multi-location rollouts, compliance, and dedicated strategy for complex organizations.",
    includes: [
      "Everything in Pro",
      "Dedicated solution architect",
      "Multi-brand deployments",
      "SLA & security review",
      "Custom model tuning",
      "24/7 priority support",
    ],
    cta: "sales",
    ctaLabel: "Contact Sales",
  },
];

export const monthlySupportTiers: MonthlySupportTier[] = [
  {
    plan: "Starter Care",
    price: "CA$99/mo",
    includes: ["Widget updates", "Monthly health check", "Email support", "Up to 2 content refreshes"],
  },
  {
    plan: "Growth Care",
    price: "CA$199/mo",
    includes: ["CRM sync monitoring", "Automation tuning", "Priority email support", "Quarterly optimization"],
  },
  {
    plan: "Pro Care",
    price: "CA$349/mo",
    includes: ["Voice agent tuning", "Advanced workflow updates", "Priority chat & email", "Monthly strategy call"],
  },
  {
    plan: "Enterprise",
    price: "Custom",
    includes: ["Dedicated CSM", "Custom SLA", "Proactive monitoring", "Executive reporting"],
  },
];

export const pricingFaq: PricingFaqItem[] = [
  {
    question: "What's included in the one-time setup fee?",
    answer:
      "Setup covers discovery, configuration, branding, knowledge base import, integrations within your plan, testing, and launch support for the included support window (14 or 30 days depending on plan).",
  },
  {
    question: "Do I need monthly support after launch?",
    answer:
      "It's optional but recommended. Monthly care plans keep your AI accurate, integrations healthy, and automations optimized as your business evolves.",
  },
  {
    question: "Can I upgrade from Starter to Growth or Pro later?",
    answer:
      "Yes. We apply a credit for your original setup toward the upgrade so you only pay the difference plus any new integration work.",
  },
  {
    question: "Are there hidden fees or usage charges?",
    answer:
      "Plan pricing is transparent. Third-party costs (e.g., Twilio, OpenAI API usage at scale) are billed separately at pass-through rates—we'll estimate these during your consultation.",
  },
  {
    question: "How does the money-back guarantee work?",
    answer:
      "If we don't deliver the agreed scope within 30 days of kickoff, we'll refund your setup fee in full. See terms below for eligibility details.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept major credit cards, bank transfer, and invoicing for Enterprise clients with approved terms.",
  },
];

export const moneyBackGuarantee = {
  title: "30-Day Delivery Guarantee",
  description:
    "We're confident in our process. If Nexora AI fails to deliver the agreed project scope within 30 days of your kickoff date, we'll refund your setup fee—no hassle, no hard feelings.",
  points: [
    "Applies to Starter, Growth, and Pro setup fees",
    "Kickoff begins after signed scope and initial payment",
    "Refund processed within 10 business days if criteria are met",
    "Enterprise engagements use custom SLA terms",
  ],
};

export const SALES_EMAIL = "hello@nexora.ai";
export const SALES_MAILTO = `mailto:${SALES_EMAIL}?subject=${encodeURIComponent("Nexora AI — Sales Inquiry")}`;

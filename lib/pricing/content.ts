import { NEXORA_CONTACT_EMAIL, NEXORA_SALES_MAILTO } from "@/lib/site/contact";

export type PricingPlanId = "starter" | "growth" | "business";

export type PricingPlan = {
  id: PricingPlanId;
  name: string;
  price: string;
  priceNote?: string;
  description: string;
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
    name: "Starter AI",
    price: "CA$499",
    priceNote: "starting price",
    description: "Perfect for small businesses looking to automate customer communication.",
    includes: [
      "AI Website Chatbot",
      "Instant FAQ Responses",
      "Lead Capture",
      "Email Notifications",
      "Website Integration",
      "Basic Setup & Training",
    ],
    cta: "consultation",
    ctaLabel: "Start Your AI Journey",
  },
  {
    id: "growth",
    name: "Growth AI",
    price: "CA$999",
    priceNote: "starting price",
    description: "For businesses that want to automate customer support and book more appointments.",
    featured: true,
    includes: [
      "Everything in Starter",
      "AI Receptionist",
      "Appointment Booking",
      "CRM Integration",
      "WhatsApp or Facebook Messenger",
      "Custom Business Knowledge",
      "Priority Support",
    ],
    cta: "consultation",
    ctaLabel: "Book Free Consultation",
  },
  {
    id: "business",
    name: "Business AI",
    price: "CA$2,499",
    priceNote: "starting price",
    description: "Complete AI automation tailored for growing businesses.",
    includes: [
      "Everything in Growth",
      "Custom AI Workflows",
      "Internal AI Assistant",
      "CRM Automation",
      "Email Automation",
      "Dashboard",
      "Advanced Integrations",
      "Premium Support",
    ],
    cta: "sales",
    ctaLabel: "Request Custom Quote",
  },
];

export const monthlySupportTiers: MonthlySupportTier[] = [
  {
    plan: "Starter AI Care",
    price: "CA$99/mo",
    includes: ["Chatbot updates", "Monthly health check", "Email support", "Up to 2 content refreshes"],
  },
  {
    plan: "Growth AI Care",
    price: "CA$199/mo",
    includes: ["Receptionist tuning", "CRM sync monitoring", "Priority email support", "Quarterly optimization"],
  },
  {
    plan: "Business AI Care",
    price: "CA$349/mo",
    includes: ["Workflow updates", "Advanced automation tuning", "Priority chat & email", "Monthly strategy call"],
  },
];

export const pricingFaq: PricingFaqItem[] = [
  {
    question: "What's included in the setup fee?",
    answer:
      "Setup covers discovery, configuration, training on your business, integrations within your plan, testing, and launch support. We handle everything—you don't need technical knowledge.",
  },
  {
    question: "Do I need monthly support after launch?",
    answer:
      "It's optional but recommended. Care plans keep your AI accurate, integrations healthy, and automations optimized as your business grows.",
  },
  {
    question: "Can I upgrade from Starter AI to Growth or Business later?",
    answer:
      "Yes. We apply a credit for your original setup toward the upgrade so you only pay the difference plus any new integration work.",
  },
  {
    question: "Are there hidden fees?",
    answer:
      "No. Plan pricing is transparent. Third-party costs (phone lines, messaging platforms at high volume) are billed at pass-through rates—we'll estimate these during your consultation.",
  },
  {
    question: "How does the money-back guarantee work?",
    answer:
      "If we don't deliver the agreed scope within 30 days of kickoff, we'll refund your setup fee in full. See terms below for eligibility details.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept major credit cards, bank transfer, and invoicing for Business AI clients with approved terms.",
  },
];

export const moneyBackGuarantee = {
  title: "30-Day Delivery Guarantee",
  description:
    "We're confident in our process. If Nexora AI fails to deliver the agreed project scope within 30 days of your kickoff date, we'll refund your setup fee—no hassle, no hard feelings.",
  points: [
    "Applies to Starter AI, Growth AI, and Business AI setup fees",
    "Kickoff begins after signed scope and initial payment",
    "Refund processed within 10 business days if criteria are met",
    "Custom scopes use agreed SLA terms",
  ],
};

export const SALES_EMAIL = NEXORA_CONTACT_EMAIL;
export const SALES_MAILTO = NEXORA_SALES_MAILTO;

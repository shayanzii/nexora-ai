import type { ServiceDefinition } from "../types";

export const BUSINESS_WEBSITE: ServiceDefinition = {
  id: "business-website",
  name: "Business Website",
  aliases: ["website", "web", "site"],
  description:
    "Conversion-focused business website with integrated lead capture and service presentation.",
  businessValue: [
    "24/7 digital storefront for local customer discovery",
    "Central hub for bookings, chat, and lead capture",
    "Improved trust and credibility with professional online presence",
  ],
  implementationComplexity: "medium",
  estimatedTimelineWeeks: { minimum: 2, maximum: 4 },
  dependencies: ["brand assets", "service descriptions", "domain access"],
  deliverable: {
    name: "Website Integration Scope",
    description:
      "Information architecture alignment and conversion-focused page integration plan.",
  },
};

export const AI_CHATBOT: ServiceDefinition = {
  id: "ai-chatbot",
  name: "AI Chatbot",
  aliases: ["chatbot", "chat", "messenger"],
  description:
    "AI-powered website and messaging chatbot for instant customer engagement and FAQ support.",
  businessValue: [
    "Instant answers to customer questions 24/7",
    "Lead capture from website visitors after hours",
    "Reduced staff time spent on repetitive inquiries",
  ],
  implementationComplexity: "low",
  estimatedTimelineWeeks: { minimum: 1, maximum: 3 },
  dependencies: ["website access", "FAQ content", "business knowledge base"],
  deliverable: {
    name: "AI Chatbot Configuration",
    description:
      "Conversation flows, FAQ knowledge base, and website chat widget integration.",
  },
};

export const AI_VOICE_AGENT: ServiceDefinition = {
  id: "ai-voice-agent",
  name: "AI Voice Agent",
  aliases: ["receptionist", "voice", "phone", "voice-agent"],
  description:
    "AI phone receptionist that answers calls, qualifies leads, and books appointments.",
  businessValue: [
    "Every call answered—even after hours and during busy periods",
    "Automatic lead qualification and routing",
    "Reduced voicemail abandonment and lost jobs",
  ],
  implementationComplexity: "medium",
  estimatedTimelineWeeks: { minimum: 2, maximum: 4 },
  dependencies: ["phone line access", "call flow rules", "calendar integration"],
  deliverable: {
    name: "AI Receptionist Call Flows",
    description:
      "After-hours call handling, qualification scripts, and booking handoff rules.",
  },
};

export const WORKFLOW_AUTOMATION: ServiceDefinition = {
  id: "workflow-automation",
  name: "Workflow Automation",
  aliases: ["automation", "workflow", "booking", "leads", "support"],
  description:
    "Automated business workflows for follow-ups, booking, lead routing, and support deflection.",
  businessValue: [
    "Eliminates manual repetitive tasks",
    "Faster follow-up improves conversion rates",
    "Consistent customer experience across touchpoints",
  ],
  implementationComplexity: "medium",
  estimatedTimelineWeeks: { minimum: 2, maximum: 5 },
  dependencies: ["existing tools inventory", "process documentation", "trigger definitions"],
  deliverable: {
    name: "Business Automation Workflows",
    description:
      "Trigger-based automations for follow-ups, notifications, and data routing.",
  },
};

export const CRM_INTEGRATION: ServiceDefinition = {
  id: "crm-integration",
  name: "CRM Integration",
  aliases: ["crm", "pipeline", "sales-crm"],
  description:
    "Integration between AI systems and CRM for lead tracking, pipeline management, and sync.",
  businessValue: [
    "Single source of truth for customer interactions",
    "Automated lead routing and pipeline updates",
    "Better visibility into conversion metrics",
  ],
  implementationComplexity: "high",
  estimatedTimelineWeeks: { minimum: 2, maximum: 6 },
  dependencies: ["CRM platform access", "field mapping", "pipeline stage definitions"],
  deliverable: {
    name: "CRM Integration",
    description: "Field mapping, pipeline stages, and automated sync rules.",
  },
};

export const SOCIAL_MEDIA_MANAGEMENT: ServiceDefinition = {
  id: "social-media-management",
  name: "Social Media Management",
  aliases: ["social-media", "social", "dm-automation"],
  description:
    "AI-assisted social media inquiry handling, DM responses, and engagement workflows.",
  businessValue: [
    "Faster response to social media inquiries",
    "Consistent brand voice across channels",
    "Capture leads from social platforms automatically",
  ],
  implementationComplexity: "low",
  estimatedTimelineWeeks: { minimum: 1, maximum: 3 },
  dependencies: ["social platform access", "brand guidelines", "response templates"],
  deliverable: {
    name: "Social Media Automation",
    description:
      "DM auto-responses, inquiry capture, and escalation rules for social channels.",
  },
};

/** Legacy service entries mapped to workflow automation deliverables. */
export const LEGACY_SERVICE_EXTENSIONS: ServiceDefinition[] = [
  {
    id: "booking",
    name: "Appointment Booking",
    aliases: ["booking", "scheduling", "appointments"],
    description: "Online appointment booking with calendar sync and reminders.",
    businessValue: ["Reduces phone tag", "Fills calendar automatically", "Cuts no-show rates"],
    implementationComplexity: "low",
    estimatedTimelineWeeks: { minimum: 1, maximum: 2 },
    dependencies: ["calendar access", "availability rules"],
    deliverable: {
      name: "Appointment Booking System",
      description: "Online scheduling, calendar sync, and automated confirmation reminders.",
    },
  },
  {
    id: "leads",
    name: "Lead Capture",
    aliases: ["leads", "lead-capture", "lead-generation"],
    description: "Multi-touchpoint lead capture and qualification system.",
    businessValue: ["Captures more website visitors", "Qualifies leads automatically"],
    implementationComplexity: "low",
    estimatedTimelineWeeks: { minimum: 1, maximum: 2 },
    dependencies: ["website forms", "CRM or inbox routing"],
    deliverable: {
      name: "Lead Capture System",
      description: "Multi-touchpoint lead forms, qualification rules, and CRM routing.",
    },
  },
  {
    id: "support",
    name: "Customer Support Automation",
    aliases: ["support", "customer-support", "faq"],
    description: "Automated FAQ and support inquiry deflection.",
    businessValue: ["Deflects repetitive questions", "Frees staff for complex issues"],
    implementationComplexity: "low",
    estimatedTimelineWeeks: { minimum: 1, maximum: 3 },
    dependencies: ["FAQ content", "escalation rules"],
    deliverable: {
      name: "Support Automation",
      description: "FAQ deflection, escalation matrix, and knowledge base structure.",
    },
  },
];

export const SERVICE_DEFINITIONS: ServiceDefinition[] = [
  BUSINESS_WEBSITE,
  AI_CHATBOT,
  AI_VOICE_AGENT,
  WORKFLOW_AUTOMATION,
  CRM_INTEGRATION,
  SOCIAL_MEDIA_MANAGEMENT,
  ...LEGACY_SERVICE_EXTENSIONS,
];

export const SERVICE_ALIASES: Record<string, string> = Object.fromEntries(
  SERVICE_DEFINITIONS.flatMap((service) =>
    service.aliases.map((alias) => [alias.toLowerCase(), service.id]),
  ),
);

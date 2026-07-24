import { getKnowledgeRegistry } from "../../knowledge";

import type { CEOBusinessAnalysis } from "../../agents/ceo/CEOOutput";
import type { ProjectExecutionPlan } from "../../orchestrator/ExecutionPlan";
import {
  DEPARTMENT_SERVICE_MAP,
  SALES_SUPPORTED_SERVICES,
  type SalesServiceDefinition,
  type SalesServiceId,
  type SalesServiceRecommendation,
} from "./SalesTypes";

const knowledge = getKnowledgeRegistry();

export const SALES_SERVICE_CATALOG: Readonly<Record<SalesServiceId, SalesServiceDefinition>> = {
  website: {
    id: "website",
    name: "Website",
    aliases: ["website", "web", "site", "business-website"],
    description: "Conversion-focused business website with lead capture and service presentation.",
    outcomes: [
      "Professional online presence that builds trust",
      "24/7 digital storefront for local discovery",
      "Integrated lead capture and booking CTAs",
    ],
  },
  seo: {
    id: "seo",
    name: "SEO",
    aliases: ["seo", "search", "local-seo", "google"],
    description: "Local and organic search optimization to improve visibility and inbound leads.",
    outcomes: [
      "Higher rankings for priority local keywords",
      "Increased organic traffic and discovery",
      "Optimized metadata and local business listings",
    ],
  },
  "ai-chatbot": {
    id: "ai-chatbot",
    name: "AI Chatbot",
    aliases: ["chatbot", "ai chatbot", "ai-chatbot", "chat"],
    description: "AI-powered website chatbot for instant engagement and FAQ support.",
    outcomes: [
      "Instant answers to customer questions 24/7",
      "After-hours lead capture and qualification",
      "Reduced staff time on repetitive inquiries",
    ],
  },
  automation: {
    id: "automation",
    name: "Automation",
    aliases: ["automation", "workflow", "workflow-automation", "booking"],
    description: "Automated workflows for follow-ups, booking, and lead routing.",
    outcomes: [
      "Faster follow-up improves conversion rates",
      "Consistent customer experience across touchpoints",
      "Eliminates manual repetitive tasks",
    ],
  },
  crm: {
    id: "crm",
    name: "CRM",
    aliases: ["crm", "pipeline", "crm-integration"],
    description: "CRM integration for lead tracking, pipeline management, and sync.",
    outcomes: [
      "Single source of truth for customer interactions",
      "Automated lead routing and pipeline updates",
      "Better visibility into conversion metrics",
    ],
  },
  branding: {
    id: "branding",
    name: "Branding",
    aliases: ["branding", "brand", "identity"],
    description: "Brand strategy, visual identity, and messaging alignment.",
    outcomes: [
      "Consistent brand voice across channels",
      "Stronger differentiation in competitive markets",
      "Trust-building visual and messaging system",
    ],
  },
  "mobile-app": {
    id: "mobile-app",
    name: "Mobile App",
    aliases: ["mobile-app", "app", "mobile"],
    description: "Mobile application for customer engagement and retention.",
    outcomes: [
      "Direct customer channel beyond the website",
      "Push notifications and loyalty engagement",
      "Native mobile booking and account access",
    ],
  },
  "voice-ai": {
    id: "voice-ai",
    name: "Voice AI",
    aliases: ["voice-ai", "voice", "phone", "ai-voice-agent", "receptionist"],
    description: "AI phone receptionist for call answering, qualification, and booking.",
    outcomes: [
      "Every call answered—even after hours",
      "Automatic lead qualification and routing",
      "Reduced voicemail abandonment",
    ],
  },
  maintenance: {
    id: "maintenance",
    name: "Maintenance",
    aliases: ["maintenance", "support", "care-plan"],
    description: "Ongoing updates, monitoring, and optimization after launch.",
    outcomes: [
      "Proactive security and performance monitoring",
      "Continuous content and SEO improvements",
      "Priority support for business-critical systems",
    ],
  },
  hosting: {
    id: "hosting",
    name: "Hosting",
    aliases: ["hosting", "infrastructure", "domain"],
    description: "Managed hosting, domain, and deployment infrastructure.",
    outcomes: [
      "Reliable uptime for customer-facing systems",
      "Managed SSL, backups, and deployment pipeline",
      "Scalable infrastructure as traffic grows",
    ],
  },
};

export interface SolutionRecommenderInput {
  analysis: CEOBusinessAnalysis;
  plan: ProjectExecutionPlan;
  requestedServices?: readonly string[];
}

/** Recommends only relevant services from the supported catalog. */
export function recommendServices(input: SolutionRecommenderInput): SalesServiceRecommendation[] {
  const selected = new Map<SalesServiceId, SalesServiceRecommendation>();

  for (const department of input.plan.departments) {
    const serviceId = DEPARTMENT_SERVICE_MAP[department];
    if (serviceId) {
      addRecommendation(selected, serviceId, buildDepartmentRationale(department, input.analysis), "primary");
    }
  }

  for (const service of input.requestedServices ?? []) {
    const serviceId = resolveServiceId(service);
    if (serviceId) {
      addRecommendation(
        selected,
        serviceId,
        `Explicitly requested to support: ${input.analysis.goals.join(", ")}.`,
        "primary",
      );
    }
  }

  for (const requirement of input.analysis.requirements) {
    for (const [serviceId, definition] of Object.entries(SALES_SERVICE_CATALOG) as [
      SalesServiceId,
      SalesServiceDefinition,
    ][]) {
      if (requirementMatchesService(requirement, definition)) {
        addRecommendation(
          selected,
          serviceId,
          `Addresses requirement: ${requirement}`,
          selected.has(serviceId) ? "primary" : "secondary",
        );
      }
    }
  }

  for (const hint of knowledge.getGoalServiceHints(input.analysis.goals.join(" "))) {
    const serviceId = mapKnowledgeServiceToSales(hint);
    if (serviceId && !selected.has(serviceId)) {
      addRecommendation(
        selected,
        serviceId,
        knowledge.getGoalServiceRationale(hint) ?? "Aligned with stated business goals.",
        "secondary",
      );
    }
  }

  if (selected.has("website") && !selected.has("hosting")) {
    addRecommendation(
      selected,
      "hosting",
      "Website delivery requires managed hosting and deployment infrastructure.",
      "secondary",
    );
  }

  if (selected.size >= 2 && !selected.has("maintenance")) {
    addRecommendation(
      selected,
      "maintenance",
      "Multi-service engagements benefit from ongoing maintenance and optimization.",
      "secondary",
    );
  }

  return sortRecommendations([...selected.values()]);
}

export function resolveServiceId(value: string): SalesServiceId | undefined {
  const normalized = value.trim().toLowerCase();

  for (const serviceId of SALES_SUPPORTED_SERVICES) {
    const definition = SALES_SERVICE_CATALOG[serviceId];
    if (
      serviceId === normalized ||
      definition.name.toLowerCase() === normalized ||
      definition.aliases.some((alias) => alias.toLowerCase() === normalized)
    ) {
      return serviceId;
    }
  }

  const knowledgeId = knowledge.resolveServiceId(value);
  return mapKnowledgeServiceToSales(knowledgeId);
}

function addRecommendation(
  selected: Map<SalesServiceId, SalesServiceRecommendation>,
  serviceId: SalesServiceId,
  rationale: string,
  priority: "primary" | "secondary",
): void {
  const definition = SALES_SERVICE_CATALOG[serviceId];
  const existing = selected.get(serviceId);

  selected.set(serviceId, {
    serviceId,
    name: definition.name,
    rationale: existing ? `${existing.rationale} ${rationale}` : rationale,
    priority: existing?.priority === "primary" || priority === "primary" ? "primary" : "secondary",
    expectedOutcomes: definition.outcomes,
  });
}

function buildDepartmentRationale(department: string, analysis: CEOBusinessAnalysis): string {
  return `Required by orchestrator ${department} workstream for ${analysis.business}.`;
}

function requirementMatchesService(requirement: string, definition: SalesServiceDefinition): boolean {
  const lower = requirement.toLowerCase();
  const name = definition.name.toLowerCase();

  if (lower.includes(name)) {
    return true;
  }

  return definition.aliases.some((alias) => aliasMatchesText(alias, requirement));
}

function aliasMatchesText(alias: string, text: string): boolean {
  const normalizedAlias = alias.trim().toLowerCase();
  if (!normalizedAlias) return false;

  if (normalizedAlias.length <= 3) {
    const pattern = new RegExp(`\\b${escapeRegExp(normalizedAlias)}\\b`, "i");
    return pattern.test(text);
  }

  return text.toLowerCase().includes(normalizedAlias);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function mapKnowledgeServiceToSales(knowledgeId: string): SalesServiceId | undefined {
  const map: Record<string, SalesServiceId> = {
    "business-website": "website",
    "ai-chatbot": "ai-chatbot",
    "workflow-automation": "automation",
    "crm-integration": "crm",
    "ai-voice-agent": "voice-ai",
    booking: "automation",
    leads: "automation",
    support: "maintenance",
  };
  return map[knowledgeId];
}

function sortRecommendations(
  recommendations: SalesServiceRecommendation[],
): SalesServiceRecommendation[] {
  const order = new Map(SALES_SUPPORTED_SERVICES.map((id, index) => [id, index]));

  return recommendations.sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority === "primary" ? -1 : 1;
    }
    return (order.get(a.serviceId) ?? 99) - (order.get(b.serviceId) ?? 99);
  });
}

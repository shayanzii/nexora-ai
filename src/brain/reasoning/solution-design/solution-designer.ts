import { randomUUID } from "crypto";

import { getKnowledgeRegistry } from "../../knowledge";
import type {
  BusinessSolution,
  ReasoningEngineResult,
  SolutionComponent,
  SolutionDesignInput,
} from "../types";

/** Capability components that extend beyond core service definitions. */
const CAPABILITY_COMPONENTS: Record<
  string,
  Omit<SolutionComponent, "id" | "phase" | "dependencies" | "rationale">
> = {
  analytics: {
    type: "capability",
    name: "Performance Analytics",
    description:
      "Dashboard tracking lead response time, conversion rates, and channel performance.",
  },
  "email-automation": {
    type: "capability",
    name: "Email Automation",
    description:
      "Automated follow-up sequences, confirmations, and nurture campaigns.",
  },
  booking: {
    type: "service",
    name: "Online Booking",
    description: "Calendar-integrated appointment scheduling with automated reminders.",
    serviceId: "booking",
  },
};

/**
 * Builds a complete business solution — integrated components, not just a service list.
 */
export class SolutionDesigner {
  private readonly knowledge = getKnowledgeRegistry();

  design(input: SolutionDesignInput): ReasoningEngineResult<BusinessSolution> {
    try {
      const serviceIds = collectServiceIds(input);
      const components = buildComponents(serviceIds, input);
      const integrationPoints = deriveIntegrationPoints(components);
      const estimatedInvestment = input.estimatedPriceRange ?? estimateInvestment(serviceIds);
      const estimatedTimeline = input.estimatedTimeline ?? estimateTimeline(components);

      const result: BusinessSolution = {
        id: `solution-${randomUUID()}`,
        requestId: input.context.requestId,
        name: `${input.businessAnalysis.businessType} AI Engagement Solution`,
        objective: input.context.goals,
        components,
        architecture: buildArchitectureDescription(components, integrationPoints),
        integrationPoints,
        estimatedTimeline,
        estimatedInvestment,
        summary: buildSolutionSummary(components, input),
      };

      return { success: true, data: result };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Solution design failed.";
      return { success: false, error: message };
    }
  }
}

function collectServiceIds(input: SolutionDesignInput): string[] {
  const ids = new Set<string>();

  for (const service of input.context.services) {
    ids.add(getKnowledgeRegistry().resolveServiceId(service));
  }

  for (const service of input.requestedServices ?? []) {
    ids.add(getKnowledgeRegistry().resolveServiceId(service));
  }

  for (const service of input.recommendedServices ?? []) {
    ids.add(getKnowledgeRegistry().resolveServiceId(service));
  }

  for (const service of input.playbookServiceIds ?? []) {
    ids.add(getKnowledgeRegistry().resolveServiceId(service));
  }

  for (const rec of input.recommendations.topPriorities) {
    for (const service of rec.relatedServices) {
      ids.add(getKnowledgeRegistry().resolveServiceId(service));
    }
  }

  return [...ids];
}

function buildComponents(
  serviceIds: string[],
  input: SolutionDesignInput,
): SolutionComponent[] {
  const components: SolutionComponent[] = [];
  const knowledge = getKnowledgeRegistry();
  const goalLower = input.context.goals.toLowerCase();

  for (const serviceId of serviceIds) {
    const service = knowledge.getService(serviceId);
    if (!service) continue;

    components.push({
      id: `comp-${serviceId}`,
      type: "service",
      name: service.name,
      description: service.deliverable.description,
      serviceId,
      phase: assignPhase(serviceId, service.implementationComplexity),
      dependencies: service.dependencies,
      rationale: `Core service supporting ${input.context.goals}.`,
    });
  }

  if (shouldIncludeBooking(serviceIds, goalLower, input.businessAnalysis.industryId)) {
    addCapabilityIfMissing(components, "booking", 2, ["business-website"], input);
  }

  if (serviceIds.some((s) => s.includes("crm") || s.includes("workflow"))) {
    addCapabilityIfMissing(
      components,
      "email-automation",
      2,
      ["crm-integration", "workflow-automation"],
      input,
    );
  }

  if (components.length >= 2) {
    addCapabilityIfMissing(components, "analytics", 3, serviceIds.slice(0, 2), input);
  }

  return assignDependencies(components);
}

function shouldIncludeBooking(
  serviceIds: string[],
  goalLower: string,
  industryId: string,
): boolean {
  if (serviceIds.includes("booking")) return false;
  const bookingIndustries = ["dentist", "restaurant", "law-firm", "hvac", "plumbing"];
  return (
    goalLower.includes("book") ||
    goalLower.includes("appointment") ||
    bookingIndustries.includes(industryId)
  );
}

function addCapabilityIfMissing(
  components: SolutionComponent[],
  capabilityKey: string,
  phase: 1 | 2 | 3,
  dependencies: string[],
  input: SolutionDesignInput,
): void {
  const template = CAPABILITY_COMPONENTS[capabilityKey];
  if (!template || components.some((c) => c.id === `comp-${capabilityKey}`)) return;

  components.push({
    id: `comp-${capabilityKey}`,
    ...template,
    phase,
    dependencies: dependencies.map((d) => `comp-${getKnowledgeRegistry().resolveServiceId(d)}`),
    rationale: `Extends solution to fully address: ${input.context.goals}.`,
  });
}

function assignPhase(
  serviceId: string,
  complexity: "low" | "medium" | "high",
): 1 | 2 | 3 {
  if (serviceId === "business-website") return 1;
  if (complexity === "low") return 1;
  if (complexity === "medium") return 2;
  return 3;
}

function assignDependencies(components: SolutionComponent[]): SolutionComponent[] {
  const hasWebsite = components.some((c) => c.serviceId === "business-website");

  return components.map((component) => {
    if (component.serviceId === "ai-chatbot" && hasWebsite) {
      return {
        ...component,
        dependencies: [...new Set([...component.dependencies, "Website access"])],
      };
    }
    if (component.serviceId === "crm-integration") {
      return {
        ...component,
        dependencies: [...new Set([...component.dependencies, "Lead capture source"])],
      };
    }
    return component;
  });
}

function deriveIntegrationPoints(components: SolutionComponent[]): string[] {
  const points = new Set<string>();

  for (const component of components) {
    if (component.serviceId === "business-website") points.add("Website CMS / hosting platform");
    if (component.serviceId === "ai-chatbot") points.add("Website chat widget embed");
    if (component.serviceId === "ai-voice-agent") points.add("Phone system / VoIP provider");
    if (component.serviceId === "crm-integration") points.add("CRM platform API");
    if (component.serviceId === "workflow-automation") points.add("Automation platform (triggers & actions)");
    if (component.id === "comp-booking") points.add("Calendar / scheduling system");
    if (component.id === "comp-email-automation") points.add("Email service provider");
    if (component.id === "comp-analytics") points.add("Analytics dashboard / reporting layer");
  }

  return [...points];
}

function buildArchitectureDescription(
  components: SolutionComponent[],
  integrationPoints: string[],
): string {
  const phase1 = components.filter((c) => c.phase === 1).map((c) => c.name);
  const phase2 = components.filter((c) => c.phase === 2).map((c) => c.name);
  const phase3 = components.filter((c) => c.phase === 3).map((c) => c.name);

  return (
    `Integrated solution architecture with ${components.length} components across three phases. ` +
    `Phase 1 (Foundation): ${phase1.join(", ") || "Core setup"}. ` +
    `Phase 2 (Automation): ${phase2.join(", ") || "Workflow activation"}. ` +
    `Phase 3 (Optimization): ${phase3.join(", ") || "Analytics and refinement"}. ` +
    `Integration points: ${integrationPoints.join("; ")}.`
  );
}

function estimateInvestment(serviceIds: string[]): BusinessSolution["estimatedInvestment"] {
  const knowledge = getKnowledgeRegistry();
  const range = knowledge.estimatePriceRange(
    serviceIds.length > 0 ? serviceIds : ["ai-chatbot"],
  );

  return {
    currency: "CAD",
    minimum: range.minimum,
    maximum: range.maximum,
    basis: "Estimated from knowledge pricing registry.",
  };
}

function estimateTimeline(components: SolutionComponent[]): BusinessSolution["estimatedTimeline"] {
  const knowledge = getKnowledgeRegistry();
  const policy = knowledge.getPricingPolicy().multiServiceTimeline;

  if (components.length <= 1) return policy.single;
  if (components.length <= 4) return policy.multi;
  return policy.complex;
}

function buildSolutionSummary(
  components: SolutionComponent[],
  input: SolutionDesignInput,
): string {
  const names = components.map((c) => c.name).join(" + ");
  return (
    `Complete solution for ${input.businessAnalysis.businessType}: ${names}. ` +
    `Designed to achieve "${input.context.goals}" through ${components.length} integrated components.`
  );
}

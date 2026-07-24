import type {
  ClientDiscoveryProfile,
  PriceRange,
  ProjectRisk,
  TimelineEstimate,
} from "../../../types/sales";
import type { ProjectRequest } from "../../../types/project";
import { estimateComplexity } from "../../../core/complexity-estimator";
import { getKnowledgeRegistry } from "../../../knowledge";

const knowledge = getKnowledgeRegistry();

export function estimateTimeline(serviceCount: number): TimelineEstimate {
  const timelines = knowledge.getPricingPolicy().multiServiceTimeline;

  if (serviceCount <= 1) {
    return timelines.single;
  }

  if (serviceCount <= 3) {
    return timelines.multi;
  }

  return timelines.complex;
}

export function estimatePriceRange(services: string[], statedBudget: number): PriceRange {
  const range = knowledge.estimatePriceRange(services);

  return {
    currency: "CAD",
    minimum: range.minimum,
    maximum: range.maximum,
    basis:
      statedBudget >= range.minimum
        ? "Estimated range aligns with stated budget."
        : "Stated budget is below estimated minimum — phased delivery recommended.",
  };
}

export function assessProjectRisks(profile: ClientDiscoveryProfile): ProjectRisk[] {
  const risks: ProjectRisk[] = [];
  const priceRange = estimatePriceRange(profile.services, profile.budget!);

  if (profile.budget! < priceRange.minimum) {
    risks.push({
      id: "budget-scope-mismatch",
      severity: "high",
      description: "Stated budget is below the estimated minimum for requested services.",
      mitigation:
        knowledge.getProposalTemplate("risk-mitigation-budget")?.content ??
        "Reduce initial scope or adopt a phased delivery plan.",
    });
  }

  if (knowledge.isRegulatedIndustry(profile.industry!)) {
    risks.push({
      id: "regulated-industry",
      severity: "medium",
      description: "Regulated industry may require additional compliance review.",
      mitigation:
        knowledge.getProposalTemplate("risk-mitigation-compliance")?.content ??
        "Confirm data handling, consent, and retention requirements during discovery.",
    });
  }

  if (profile.services.length >= 4) {
    risks.push({
      id: "multi-service-complexity",
      severity: "medium",
      description: "Multiple services increase integration and timeline risk.",
      mitigation: "Sequence delivery by highest-impact service first.",
    });
  }

  const unknownServices = profile.services.filter(
    (service) => !knowledge.getPricing(service),
  );
  if (unknownServices.length > 0) {
    risks.push({
      id: "custom-services",
      severity: "low",
      description: `Custom or unlisted services require manual scoping: ${unknownServices.join(", ")}.`,
      mitigation: "Schedule a scoping call to define deliverables and pricing.",
    });
  }

  if (risks.length === 0) {
    risks.push({
      id: "standard-delivery",
      severity: "low",
      description: "No major qualification risks identified.",
      mitigation: "Proceed to structured requirements analysis.",
    });
  }

  return risks;
}

export function isBudgetAligned(profile: ClientDiscoveryProfile): boolean {
  const priceRange = estimatePriceRange(profile.services, profile.budget!);
  return profile.budget! >= priceRange.minimum;
}

export function buildPricingSummary(
  profile: ClientDiscoveryProfile,
  request: ProjectRequest,
) {
  const priceRange = estimatePriceRange(profile.services, profile.budget!);
  const timeline = estimateTimeline(profile.services.length);
  const complexity = estimateComplexity(request);
  const projectRisks = assessProjectRisks(profile);

  return {
    estimatedPriceRange: priceRange,
    estimatedTimeline: timeline,
    estimatedComplexity: complexity.level,
    complexityScore: complexity.score,
    projectRisks,
    budgetAligned: isBudgetAligned(profile),
  };
}

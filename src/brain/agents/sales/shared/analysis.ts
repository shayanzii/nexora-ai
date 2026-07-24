import type { ClientDiscoveryProfile, RecommendedService } from "../../../types/sales";
import { getKnowledgeRegistry } from "../../../knowledge";

const knowledge = getKnowledgeRegistry();

export function buildProjectSummary(profile: ClientDiscoveryProfile): string {
  return (
    `${profile.businessName} (${profile.industry}, ${profile.country}) seeks ` +
    `${profile.services.join(", ")} to achieve: ${profile.goals}. ` +
    `Target audience: ${profile.targetAudience}. Budget: CAD $${profile.budget!.toLocaleString()}. ` +
    `Timeline: ${profile.timeline}.`
  );
}

export function buildBusinessAnalysis(profile: ClientDiscoveryProfile): string {
  const regulated = knowledge.isRegulatedIndustry(profile.industry!);
  const multiService = profile.services.length > 1;
  const industryProfile = knowledge.getIndustry(profile.industry!);

  const lines = [
    `Operating in ${profile.country} within the ${profile.industry} sector.`,
    `Primary audience: ${profile.targetAudience}.`,
    `Stated objective: ${profile.goals}.`,
  ];

  if (regulated) {
    lines.push("Regulated industry — compliance and data handling require explicit scoping.");
  }

  if (multiService) {
    lines.push(
      `Multi-service engagement (${profile.services.length} services) increases integration and coordination needs.`,
    );
  }

  if (industryProfile && industryProfile.commonAutomationOpportunities.length > 0) {
    lines.push(
      `Industry automation opportunities: ${industryProfile.commonAutomationOpportunities.slice(0, 2).join("; ")}.`,
    );
  }

  if (profile.budget! < 1000) {
    lines.push("Budget suggests a phased or MVP-first approach may be appropriate.");
  }

  return lines.join(" ");
}

export function recommendServices(profile: ClientDiscoveryProfile): RecommendedService[] {
  const requested = profile.services.map((service) => ({
    service,
    rationale: `Explicitly requested by ${profile.businessName} to support: ${profile.goals}.`,
    priority: "primary" as const,
  }));

  const suggestions: RecommendedService[] = [];

  for (const serviceId of knowledge.getGoalServiceHints(profile.goals!)) {
    if (profile.services.includes(serviceId)) continue;

    suggestions.push({
      service: serviceId,
      rationale:
        knowledge.getGoalServiceRationale(serviceId) ??
        `Goal alignment suggests ${serviceId} may support stated objectives.`,
      priority: "secondary",
    });
  }

  return [...requested, ...suggestions];
}

export function buildDiscoveryNotes(profile: ClientDiscoveryProfile): string[] {
  const notes = [
    `Client operates in ${profile.industry} targeting ${profile.targetAudience}.`,
    `Requested capabilities: ${profile.services.join(", ")}.`,
    `Success metric implied by goal: ${profile.goals}.`,
  ];

  if (knowledge.isRegulatedIndustry(profile.industry!)) {
    notes.push("Schedule compliance review before technical scoping.");
  }

  const industryProfile = knowledge.getIndustry(profile.industry!);
  if (industryProfile) {
    notes.push(`Industry KPIs to track: ${industryProfile.kpis.slice(0, 2).join(", ")}.`);
  }

  return notes;
}

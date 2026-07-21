import { randomUUID } from "crypto";

import { getKnowledgeRegistry } from "../../knowledge";
import type {
  OpportunityAnalysis,
  OpportunityInput,
  OpportunityItem,
  ReasoningEngineResult,
} from "../types";

/**
 * Discovers automation, AI, marketing, operational, and revenue opportunities.
 */
export class OpportunityEngine {
  private readonly knowledge = getKnowledgeRegistry();

  discover(input: OpportunityInput): ReasoningEngineResult<OpportunityAnalysis> {
    try {
      const industryProfile = this.knowledge.getIndustry(input.context.industry);
      const playbooks = this.knowledge.getPlaybooksByIndustry(input.businessAnalysis.industryId);
      const primaryPlaybook = playbooks[0];

      const automation = buildAutomationOpportunities(
        industryProfile?.commonAutomationOpportunities ?? [],
        input,
      );
      const ai = buildAiOpportunities(
        industryProfile?.recommendedAiServices ?? [],
        input,
      );
      const marketing = buildMarketingOpportunities(
        industryProfile?.websiteRecommendations ?? [],
        industryProfile?.socialMediaRecommendations ?? [],
        input,
      );
      const operational = buildOperationalOpportunities(
        primaryPlaybook?.steps ?? [],
        input,
      );
      const revenue = buildRevenueOpportunities(
        industryProfile?.kpis ?? [],
        input,
      );

      const all = deduplicateOpportunities([
        ...automation,
        ...ai,
        ...marketing,
        ...operational,
        ...revenue,
      ]);

      const result: OpportunityAnalysis = {
        automation,
        ai,
        marketing,
        operational,
        revenue,
        all,
        summary: buildOpportunitySummary(all, input.context.industry),
      };

      return { success: true, data: result };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Opportunity discovery failed.";
      return { success: false, error: message };
    }
  }
}

function buildAutomationOpportunities(
  automationItems: string[],
  input: OpportunityInput,
): OpportunityItem[] {
  return automationItems.map((item, index) => ({
    id: `opp-auto-${index + 1}`,
    category: "automation",
    title: truncateTitle(item),
    description: item,
    impact: scoreImpact(item, input.businessAnalysis.growthBottlenecks),
    effort: inferEffort(item),
    relatedServices: inferServices(item),
    source: "industry-automation-profile",
  }));
}

function buildAiOpportunities(
  recommendedServices: string[],
  input: OpportunityInput,
): OpportunityItem[] {
  const goalHints = getKnowledgeRegistry().getGoalServiceHints(input.context.goals);
  const serviceIds = [...new Set([...recommendedServices, ...goalHints])];

  return serviceIds.map((serviceId, index) => {
    const service = getKnowledgeRegistry().getService(serviceId);
    return {
      id: `opp-ai-${index + 1}`,
      category: "ai",
      title: service?.name ?? serviceId,
      description:
        service?.description ??
        `Deploy ${serviceId} to support ${input.context.goals}.`,
      impact: "high" as const,
      effort: service?.implementationComplexity === "high" ? "high" : "medium",
      relatedServices: [serviceId],
      source: "industry-ai-recommendations",
    };
  });
}

function buildMarketingOpportunities(
  websiteRecs: string[],
  socialRecs: string[],
  input: OpportunityInput,
): OpportunityItem[] {
  const website = websiteRecs.map((item, index) => ({
    id: `opp-mkt-web-${index + 1}`,
    category: "marketing" as const,
    title: truncateTitle(item),
    description: item,
    impact: "medium" as const,
    effort: "low" as const,
    relatedServices: ["business-website"],
    source: "industry-website-recommendations",
  }));

  const social = socialRecs.map((item, index) => ({
    id: `opp-mkt-social-${index + 1}`,
    category: "marketing" as const,
    title: truncateTitle(item),
    description: item,
    impact: "medium" as const,
    effort: "low" as const,
    relatedServices: ["social-media-management"],
    source: "industry-social-recommendations",
  }));

  if (website.length === 0 && social.length === 0) {
    return [
      {
        id: `opp-mkt-${randomUUID().slice(0, 8)}`,
        category: "marketing",
        title: "Digital Presence Optimization",
        description: `Improve online visibility for ${input.context.industry} to support ${input.context.goals}.`,
        impact: "medium",
        effort: "medium",
        relatedServices: ["business-website", "social-media-management"],
        source: "goal-inference",
      },
    ];
  }

  return [...website, ...social];
}

function buildOperationalOpportunities(
  playbookSteps: string[],
  input: OpportunityInput,
): OpportunityItem[] {
  return playbookSteps.map((step, index) => ({
    id: `opp-ops-${index + 1}`,
    category: "operational",
    title: truncateTitle(step),
    description: step,
    impact: index < 2 ? "high" : "medium",
    effort: inferEffort(step),
    relatedServices: inferServices(step),
    source: "industry-playbook",
  }));
}

function buildRevenueOpportunities(kpis: string[], input: OpportunityInput): OpportunityItem[] {
  const goalLower = input.context.goals.toLowerCase();

  const revenueItems: OpportunityItem[] = kpis.slice(0, 4).map((kpi, index) => ({
    id: `opp-rev-${index + 1}`,
    category: "revenue" as const,
    title: `Improve ${kpi}`,
    description: `Implement systems to track and optimize ${kpi.toLowerCase()}.`,
    impact: "high" as const,
    effort: "medium" as const,
    relatedServices: inferServices(kpi),
    source: "industry-kpis",
  }));

  if (goalLower.includes("lead") || goalLower.includes("revenue") || goalLower.includes("grow")) {
    revenueItems.unshift({
      id: "opp-rev-growth",
      category: "revenue",
      title: "Accelerate Lead-to-Revenue Conversion",
      description: `Capture and convert more leads to support: ${input.context.goals}.`,
      impact: "high",
      effort: "medium",
      relatedServices: ["workflow-automation", "crm-integration", "ai-chatbot"],
      source: "goal-analysis",
    });
  }

  return revenueItems;
}

function truncateTitle(text: string): string {
  return text.length > 60 ? `${text.slice(0, 57)}...` : text;
}

function scoreImpact(
  item: string,
  bottlenecks: string[],
): OpportunityItem["impact"] {
  const lower = item.toLowerCase();
  const matchesBottleneck = bottlenecks.some(
    (b) => lower.includes(b.toLowerCase().slice(0, 12)) || b.toLowerCase().includes(lower.slice(0, 12)),
  );
  if (matchesBottleneck) return "high";
  if (lower.includes("automated") || lower.includes("24/7") || lower.includes("reduce")) return "high";
  return "medium";
}

function inferEffort(item: string): OpportunityItem["effort"] {
  const lower = item.toLowerCase();
  if (lower.includes("integrat") || lower.includes("crm") || lower.includes("compliance")) return "high";
  if (lower.includes("deploy") || lower.includes("configure")) return "medium";
  return "low";
}

function inferServices(text: string): string[] {
  const knowledge = getKnowledgeRegistry();
  const lower = text.toLowerCase();
  const services: string[] = [];

  if (lower.includes("chat") || lower.includes("chatbot")) services.push("ai-chatbot");
  if (lower.includes("voice") || lower.includes("call") || lower.includes("phone")) {
    services.push("ai-voice-agent");
  }
  if (lower.includes("book") || lower.includes("appointment") || lower.includes("schedul")) {
    services.push("booking");
  }
  if (lower.includes("crm") || lower.includes("pipeline") || lower.includes("lead")) {
    services.push("crm-integration");
  }
  if (lower.includes("website") || lower.includes("web")) services.push("business-website");
  if (lower.includes("social") || lower.includes("instagram") || lower.includes("dm")) {
    services.push("social-media-management");
  }
  if (lower.includes("automat") || lower.includes("workflow") || lower.includes("follow-up")) {
    services.push("workflow-automation");
  }

  return services.length > 0
    ? [...new Set(services.map((s) => knowledge.resolveServiceId(s)))]
    : ["workflow-automation"];
}

function deduplicateOpportunities(items: OpportunityItem[]): OpportunityItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.category}:${item.title.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildOpportunitySummary(all: OpportunityItem[], industry: string): string {
  const highImpact = all.filter((o) => o.impact === "high").length;
  return (
    `Identified ${all.length} opportunities for ${industry} ` +
    `(${highImpact} high-impact). Categories span automation, AI, marketing, operations, and revenue.`
  );
}

import { getKnowledgeRegistry } from "../../knowledge";
import type {
  BusinessAnalysisInput,
  BusinessAnalysisResult,
  CustomerJourneyStage,
  ReasoningEngineResult,
} from "../types";

const JOURNEY_STAGES: Array<{
  stage: CustomerJourneyStage["stage"];
  label: string;
  touchpointTemplate: (industry: string) => string[];
}> = [
  {
    stage: "awareness",
    label: "Awareness",
    touchpointTemplate: (industry) => [
      `Local search and Google Business Profile for ${industry}`,
      "Social media discovery",
      "Referrals and word-of-mouth",
    ],
  },
  {
    stage: "consideration",
    label: "Consideration",
    touchpointTemplate: () => [
      "Website visit and service review",
      "Online reviews and testimonials",
      "Initial phone or chat inquiry",
    ],
  },
  {
    stage: "conversion",
    label: "Conversion",
    touchpointTemplate: () => [
      "Quote or consultation request",
      "Booking or appointment scheduling",
      "Payment or deposit confirmation",
    ],
  },
  {
    stage: "service",
    label: "Service Delivery",
    touchpointTemplate: () => [
      "Service appointment or delivery",
      "Status updates and communication",
      "Issue resolution and support",
    ],
  },
  {
    stage: "retention",
    label: "Retention & Advocacy",
    touchpointTemplate: () => [
      "Follow-up and satisfaction check",
      "Repeat booking or maintenance reminders",
      "Review requests and referral programs",
    ],
  },
];

/**
 * Analyses business type, goals, risks, strengths, weaknesses,
 * customer journey, and growth bottlenecks.
 */
export class BusinessAnalysisEngine {
  private readonly knowledge = getKnowledgeRegistry();

  analyze(input: BusinessAnalysisInput): ReasoningEngineResult<BusinessAnalysisResult> {
    try {
      const industryProfile = this.knowledge.getIndustry(input.industry);
      const industryId = this.knowledge.resolveIndustryId(input.industry);
      const regulated = this.knowledge.isRegulatedIndustry(input.industry);

      const goals = parseGoals(input.goals);
      const risks = input.projectRisks ?? buildDefaultRisks(input, regulated);
      const strengths = buildStrengths(input, industryProfile?.commonBusinessGoals ?? []);
      const weaknesses = buildWeaknesses(input, regulated, risks);
      const customerJourney = buildCustomerJourney(
        input.industry,
        industryProfile?.commonCustomerProblems ?? [],
        industryProfile?.commonAutomationOpportunities ?? [],
      );
      const growthBottlenecks = buildGrowthBottlenecks(
        input,
        industryProfile?.commonCustomerProblems ?? [],
      );

      const result: BusinessAnalysisResult = {
        requestId: input.requestId,
        businessType: industryProfile?.name ?? input.industry,
        industryId,
        regulated,
        goals,
        risks,
        strengths,
        weaknesses,
        customerJourney,
        growthBottlenecks,
        summary: buildSummary(input, industryProfile?.name ?? input.industry, growthBottlenecks),
      };

      return { success: true, data: result };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Business analysis failed.";
      return { success: false, error: message };
    }
  }
}

function parseGoals(goals: string): string[] {
  const segments = goals
    .split(/[,;]|(?:\band\b)/i)
    .map((s) => s.trim())
    .filter(Boolean);

  return segments.length > 0 ? segments : [goals];
}

function buildDefaultRisks(
  input: BusinessAnalysisInput,
  regulated: boolean,
): BusinessAnalysisResult["risks"] {
  const risks: BusinessAnalysisResult["risks"] = [];

  if (input.budget < 1000) {
    risks.push({
      id: "constrained-budget",
      severity: "medium",
      description: "Budget may limit initial solution scope.",
      mitigation: "Prioritize highest-impact components in phase one.",
    });
  }

  if (regulated) {
    risks.push({
      id: "regulated-industry",
      severity: "medium",
      description: "Regulated industry requires compliance-aware implementation.",
      mitigation: "Include compliance review in discovery phase.",
    });
  }

  if (input.services.length >= 4) {
    risks.push({
      id: "integration-complexity",
      severity: "medium",
      description: "Multiple services increase integration complexity.",
      mitigation: "Sequence delivery by dependency order.",
    });
  }

  return risks;
}

function buildStrengths(input: BusinessAnalysisInput, industryGoals: string[]): string[] {
  const strengths: string[] = [];

  if (input.services.length > 0) {
    strengths.push(`Clear service intent: ${input.services.join(", ")}.`);
  }

  if (input.budget >= 2000) {
    strengths.push("Budget supports a multi-component solution.");
  }

  if (input.targetAudience) {
    strengths.push(`Defined target audience: ${input.targetAudience}.`);
  }

  const goalOverlap = parseGoals(input.goals).filter((goal) =>
    industryGoals.some((ig) => ig.toLowerCase().includes(goal.toLowerCase().slice(0, 8))),
  );
  if (goalOverlap.length > 0) {
    strengths.push("Goals align with common industry objectives.");
  }

  if (input.businessName) {
    strengths.push("Established business identity supports brand-consistent solution design.");
  }

  return strengths.length > 0 ? strengths : ["Business has articulated a clear improvement goal."];
}

function buildWeaknesses(
  input: BusinessAnalysisInput,
  regulated: boolean,
  risks: BusinessAnalysisResult["risks"],
): string[] {
  const weaknesses: string[] = [];

  if (input.budget < 1500) {
    weaknesses.push("Limited budget may require phased rollout.");
  }

  if (input.services.length === 0) {
    weaknesses.push("No specific services identified — solution scope needs definition.");
  }

  if (regulated) {
    weaknesses.push("Compliance requirements may extend timeline and scope.");
  }

  const highRisks = risks.filter((r) => r.severity === "high");
  if (highRisks.length > 0) {
    weaknesses.push(`${highRisks.length} high-severity risk(s) require mitigation before launch.`);
  }

  if (!input.timeline) {
    weaknesses.push("No stated timeline — delivery sequencing needs confirmation.");
  }

  return weaknesses;
}

function buildCustomerJourney(
  industry: string,
  problems: string[],
  opportunities: string[],
): CustomerJourneyStage[] {
  return JOURNEY_STAGES.map(({ stage, label, touchpointTemplate }, index) => {
    const painPoints = problems.slice(
      Math.floor((index / JOURNEY_STAGES.length) * problems.length),
      Math.floor(((index + 1) / JOURNEY_STAGES.length) * problems.length) || index + 1,
    );
    const stageOpportunities = opportunities.slice(
      Math.floor((index / JOURNEY_STAGES.length) * opportunities.length),
      Math.floor(((index + 1) / JOURNEY_STAGES.length) * opportunities.length) || index + 1,
    );

    return {
      stage,
      label,
      touchpoints: touchpointTemplate(industry),
      painPoints: painPoints.length > 0 ? painPoints : [`Friction during ${label.toLowerCase()} phase`],
      opportunities:
        stageOpportunities.length > 0
          ? stageOpportunities
          : [`Improve ${label.toLowerCase()} touchpoint experience`],
    };
  });
}

function buildGrowthBottlenecks(input: BusinessAnalysisInput, industryProblems: string[]): string[] {
  const bottlenecks = [...industryProblems.slice(0, 3)];

  const goalLower = input.goals.toLowerCase();
  if (goalLower.includes("lead") || goalLower.includes("customer")) {
    bottlenecks.push("Lead response time limits conversion during peak demand.");
  }
  if (goalLower.includes("book") || goalLower.includes("appointment")) {
    bottlenecks.push("Manual scheduling creates delays and booking abandonment.");
  }
  if (goalLower.includes("support") || goalLower.includes("call")) {
    bottlenecks.push("Staff capacity consumed by repetitive customer inquiries.");
  }

  if (input.budget < 1000 && !bottlenecks.some((b) => b.includes("budget"))) {
    bottlenecks.push("Budget constraints may delay full automation rollout.");
  }

  return [...new Set(bottlenecks)].slice(0, 6);
}

function buildSummary(
  input: BusinessAnalysisInput,
  businessType: string,
  bottlenecks: string[],
): string {
  const name = input.businessName ?? "The business";
  return (
    `${name} operates as a ${businessType} with goals focused on ${input.goals}. ` +
    `Key growth bottlenecks include ${bottlenecks.slice(0, 2).join(" and ")}. ` +
    `Analysis identifies ${input.services.length} requested capability area(s) against a ` +
    `CAD $${input.budget.toLocaleString()} budget.`
  );
}

export { parseGoals, buildCustomerJourney };

import type {
  Recommendation,
  RecommendationInput,
  RecommendationPriority,
  RecommendationResult,
  ReasoningEngineResult,
} from "../types";

const IMPACT_WEIGHT = 0.4;
const EFFORT_WEIGHT = 0.3;
const GOAL_WEIGHT = 0.2;
const URGENCY_WEIGHT = 0.1;

/**
 * Prioritizes opportunities into scored recommendations with rationale.
 */
export class RecommendationEngine {
  prioritize(input: RecommendationInput): ReasoningEngineResult<RecommendationResult> {
    try {
      const recommendations = input.opportunities.all.map((opportunity, index) =>
        scoreOpportunity(opportunity, input, index),
      );

      recommendations.sort((a, b) => b.score - a.score);

      const topPriorities = recommendations.filter(
        (r) => r.priority === "critical" || r.priority === "high",
      ).slice(0, 5);

      const result: RecommendationResult = {
        recommendations,
        topPriorities,
        summary: buildRecommendationSummary(recommendations, topPriorities),
      };

      return { success: true, data: result };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Recommendation prioritization failed.";
      return { success: false, error: message };
    }
  }
}

function scoreOpportunity(
  opportunity: RecommendationInput["opportunities"]["all"][number],
  input: RecommendationInput,
  index: number,
): Recommendation {
  const impactScore = impactToScore(opportunity.impact);
  const effortScore = effortToScore(opportunity.effort);
  const goalScore = goalAlignmentScore(opportunity, input.context.goals);
  const urgencyScore = bottleneckAlignmentScore(opportunity, input.businessAnalysis.growthBottlenecks);

  const rawScore =
    impactScore * IMPACT_WEIGHT +
    effortScore * EFFORT_WEIGHT +
    goalScore * GOAL_WEIGHT +
    urgencyScore * URGENCY_WEIGHT;

  const score = Math.round(Math.min(100, Math.max(0, rawScore * 100)));
  const priority = scoreToPriority(score);

  return {
    id: `rec-${index + 1}-${opportunity.id}`,
    category: opportunity.category,
    title: opportunity.title,
    description: opportunity.description,
    rationale: buildRationale(opportunity, input, score, goalScore, urgencyScore),
    score,
    priority,
    relatedServices: opportunity.relatedServices,
    expectedImpact: describeExpectedImpact(opportunity.impact, opportunity.category),
    timeframe: estimateTimeframe(opportunity.effort, priority),
  };
}

function impactToScore(impact: "low" | "medium" | "high"): number {
  return { low: 0.4, medium: 0.7, high: 1.0 }[impact];
}

function effortToScore(effort: "low" | "medium" | "high"): number {
  return { low: 1.0, medium: 0.7, high: 0.4 }[effort];
}

function goalAlignmentScore(
  opportunity: RecommendationInput["opportunities"]["all"][number],
  goals: string,
): number {
  const goalLower = goals.toLowerCase();
  const text = `${opportunity.title} ${opportunity.description}`.toLowerCase();

  const keywords = ["lead", "book", "appointment", "support", "call", "revenue", "grow", "customer"];
  const matches = keywords.filter((kw) => goalLower.includes(kw) && text.includes(kw));
  return Math.min(1, 0.3 + matches.length * 0.25);
}

function bottleneckAlignmentScore(
  opportunity: RecommendationInput["opportunities"]["all"][number],
  bottlenecks: string[],
): number {
  const text = `${opportunity.title} ${opportunity.description}`.toLowerCase();
  const matches = bottlenecks.filter((b) =>
    text.includes(b.toLowerCase().slice(0, 15)) ||
    b.toLowerCase().includes(opportunity.title.toLowerCase().slice(0, 15)),
  );
  return Math.min(1, 0.2 + matches.length * 0.3);
}

function scoreToPriority(score: number): RecommendationPriority {
  if (score >= 85) return "critical";
  if (score >= 70) return "high";
  if (score >= 50) return "medium";
  return "low";
}

function buildRationale(
  opportunity: RecommendationInput["opportunities"]["all"][number],
  input: RecommendationInput,
  score: number,
  goalScore: number,
  urgencyScore: number,
): string {
  const parts: string[] = [];

  parts.push(
    `Scored ${score}/100 based on ${opportunity.impact} impact and ${opportunity.effort} implementation effort.`,
  );

  if (goalScore >= 0.5) {
    parts.push(`Directly supports stated goal: "${input.context.goals}".`);
  }

  if (urgencyScore >= 0.5) {
    parts.push("Addresses identified growth bottlenecks in the customer journey.");
  }

  if (opportunity.source === "industry-playbook") {
    parts.push("Derived from proven industry playbook — reduces implementation uncertainty.");
  }

  if (input.businessAnalysis.regulated && opportunity.category === "ai") {
    parts.push("AI deployment in regulated industry requires compliance-aware configuration.");
  }

  if (opportunity.relatedServices.length > 0) {
    parts.push(`Enables: ${opportunity.relatedServices.join(", ")}.`);
  }

  return parts.join(" ");
}

function describeExpectedImpact(
  impact: "low" | "medium" | "high",
  category: Recommendation["category"],
): string {
  const categoryEffects: Record<Recommendation["category"], string> = {
    automation: "Reduced manual workload and faster process execution",
    ai: "24/7 customer engagement and intelligent inquiry handling",
    marketing: "Increased visibility and inbound inquiry volume",
    operational: "Streamlined internal processes and coordination",
    revenue: "Higher conversion rates and measurable revenue growth",
    solution: "Integrated capability delivering compound business value",
  };

  const magnitude = { low: "Incremental", medium: "Moderate", high: "Significant" }[impact];
  return `${magnitude} ${categoryEffects[category].toLowerCase()}.`;
}

function estimateTimeframe(
  effort: "low" | "medium" | "high",
  priority: RecommendationPriority,
): string {
  if (priority === "critical") {
    return effort === "high" ? "4–6 weeks" : "1–3 weeks";
  }
  return { low: "1–2 weeks", medium: "2–4 weeks", high: "4–8 weeks" }[effort];
}

function buildRecommendationSummary(
  all: Recommendation[],
  top: Recommendation[],
): string {
  return (
    `Generated ${all.length} recommendations; ${top.length} marked high or critical priority. ` +
    `Top recommendation: "${top[0]?.title ?? "None"}" (score: ${top[0]?.score ?? 0}).`
  );
}

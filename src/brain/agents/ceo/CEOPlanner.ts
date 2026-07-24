import { getKnowledgeRegistry } from "../../knowledge";
import type { ComplexityLevel } from "../../types/project";
import {
  SERVICE_TO_DEPARTMENT,
  type CEODepartmentId,
} from "./CEOAgentConfig";
import type { CEOContext } from "./CEOContext";
import type {
  CEOBudgetEstimate,
  CEOBusinessAnalysis,
  CEOTimelineEstimate,
} from "./CEOOutput";
import {
  buildDefaultDiscoveryQuestions,
  generateFollowUpQuestions,
} from "./CEOQuestions";

/** Detects missing information fields from the customer context. */
export function detectMissingInformation(context: CEOContext): string[] {
  const missing: string[] = [];

  if (context.company === "Unknown business") missing.push("company");
  if (!context.targetAudience) missing.push("targetAudience");
  if (!context.timeline) missing.push("timeline");
  if (context.services.length === 0) missing.push("services");
  if (!context.country) missing.push("country");
  if (!context.goal.trim()) missing.push("goal");
  if (context.budget <= 0) missing.push("budget");

  return missing;
}

/** Recommends departments based on requested services and goals. */
export function recommendDepartments(context: CEOContext): CEODepartmentId[] {
  const departments = new Set<CEODepartmentId>(["sales"]);

  for (const service of context.services) {
    const department = SERVICE_TO_DEPARTMENT[service];
    if (department) {
      departments.add(department);
    }
  }

  if (
    context.goal.toLowerCase().includes("website") ||
    context.services.includes("website")
  ) {
    departments.add("website");
  }

  return [...departments];
}

/** Estimates project complexity from scope signals. */
export function estimateComplexity(context: CEOContext): ComplexityLevel {
  let score = 0;

  if (context.services.length >= 4) score += 2;
  else if (context.services.length >= 2) score += 1;

  if (context.budget >= 8000) score += 2;
  else if (context.budget >= 4000) score += 1;

  if (context.regulated || getKnowledgeRegistry().isRegulatedIndustry(context.industry)) {
    score += 1;
  }

  if (score >= 4) return "enterprise";
  if (score >= 3) return "high";
  if (score >= 1) return "medium";
  return "low";
}

/** Estimates budget range using knowledge registry pricing. */
export function estimateBudget(context: CEOContext): CEOBudgetEstimate {
  const knowledge = getKnowledgeRegistry();
  const services = context.services.length > 0 ? context.services : ["website"];
  let min = 0;
  let max = 0;

  for (const service of services) {
    const resolved = knowledge.getService(service);
    const pricing = resolved ? knowledge.getPricing(resolved.id) : undefined;
    const floor = pricing?.minimum ?? knowledge.getPricingPolicy().defaultServiceEstimate;
    const ceiling = Math.round(floor * (pricing?.maximumMultiplier ?? 1.35));
    min += floor;
    max += ceiling;
  }

  if (context.budget > 0) {
    min = Math.min(min, context.budget);
    max = Math.max(max, context.budget);
  }

  return {
    min,
    max: Math.max(max, min),
    currency: "CAD",
    rationale:
      services.length > 1
        ? "Estimated from combined service pricing floors and stated budget."
        : "Estimated from primary service pricing and stated budget.",
  };
}

/** Estimates timeline using knowledge registry policy. */
export function estimateTimeline(
  context: CEOContext,
  complexity: ComplexityLevel,
): CEOTimelineEstimate {
  const policy = getKnowledgeRegistry().getPricingPolicy().multiServiceTimeline;
  const bucket =
    complexity === "enterprise" || complexity === "high"
      ? policy.complex
      : context.services.length > 1
        ? policy.multi
        : policy.single;

  return {
    minWeeks: bucket.minimumWeeks,
    maxWeeks: bucket.maximumWeeks,
    summary: context.timeline ?? bucket.summary,
  };
}

/** Builds a deterministic CEO analysis without LLM involvement. */
export function buildDeterministicCEOAnalysis(context: CEOContext): CEOBusinessAnalysis {
  const missingInformation = detectMissingInformation(context);
  const estimatedComplexity = estimateComplexity(context);
  const recommendedDepartments = recommendDepartments(context);
  const industryProfile = getKnowledgeRegistry().getIndustry(context.industry);

  const requirements = [
    `Deliver outcomes aligned to goal: ${context.goal}`,
    ...context.services.map((service) => `Plan and scope '${service}' service delivery`),
  ];

  if (context.regulated) {
    requirements.push("Apply compliance-friendly messaging and approval workflows");
  }

  const followUpQuestions = [
    ...generateFollowUpQuestions(missingInformation, context),
    ...buildDefaultDiscoveryQuestions(context),
  ];

  return {
    business: context.company,
    industry: industryProfile?.name ?? context.industry,
    goals: [context.goal],
    requirements,
    missingInformation,
    recommendedDepartments,
    estimatedComplexity,
    estimatedBudget: estimateBudget(context),
    estimatedTimeline: estimateTimeline(context, estimatedComplexity),
    confidence: missingInformation.length === 0 ? 0.82 : 0.62,
    followUpQuestions: [...new Set(followUpQuestions)],
  };
}

/** Enriches LLM output with deterministic planner fallbacks. */
export function enrichCEOAnalysis(
  analysis: CEOBusinessAnalysis,
  context: CEOContext,
): CEOBusinessAnalysis {
  const missingInformation =
    analysis.missingInformation.length > 0
      ? analysis.missingInformation
      : detectMissingInformation(context);

  const recommendedDepartments =
    analysis.recommendedDepartments.length > 0
      ? analysis.recommendedDepartments
      : recommendDepartments(context);

  const followUpQuestions = [
    ...analysis.followUpQuestions,
    ...generateFollowUpQuestions(missingInformation, context),
    ...buildDefaultDiscoveryQuestions(context),
  ];

  return {
    ...analysis,
    business: analysis.business || context.company,
    industry: analysis.industry || context.industry,
    goals: analysis.goals.length > 0 ? analysis.goals : [context.goal],
    missingInformation,
    recommendedDepartments: [...new Set(recommendedDepartments)],
    estimatedBudget:
      analysis.estimatedBudget.min > 0
        ? analysis.estimatedBudget
        : estimateBudget(context),
    estimatedTimeline:
      analysis.estimatedTimeline.minWeeks > 0
        ? analysis.estimatedTimeline
        : estimateTimeline(context, analysis.estimatedComplexity),
    followUpQuestions: [...new Set(followUpQuestions)],
  };
}

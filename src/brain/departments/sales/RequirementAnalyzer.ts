import { getKnowledgeRegistry } from "../../knowledge";

import type { SalesAgentContext, RequirementAnalysis } from "./SalesTypes";
import type { CEOBusinessAnalysis } from "../../agents/ceo/CEOOutput";
import type { ProjectExecutionPlan } from "../../orchestrator/ExecutionPlan";

const knowledge = getKnowledgeRegistry();

export interface RequirementAnalyzerInput {
  analysis: CEOBusinessAnalysis;
  plan: ProjectExecutionPlan;
  context?: SalesAgentContext;
}

/** Analyzes customer goals, challenges, and missing information from orchestrator inputs. */
export function analyzeRequirements(input: RequirementAnalyzerInput): RequirementAnalysis {
  const { analysis, plan, context } = input;
  const industryProfile = knowledge.getIndustry(normalizeIndustryId(analysis.industry));
  const regulated = knowledge.isRegulatedIndustry(analysis.industry) || context?.metadata?.regulated === true;

  const businessGoals = [...analysis.goals];
  const businessChallenges = buildBusinessChallenges(
    analysis,
    industryProfile?.commonCustomerProblems ?? [],
    regulated,
  );
  const missingInformation = collectMissingInformation(analysis, context);
  const industryInsights = buildIndustryInsights(analysis, industryProfile, regulated);

  const completenessScore = calculateCompletenessScore(analysis, context, missingInformation.length);

  return {
    customerSummary: buildCustomerSummary(analysis, context, plan),
    businessGoals,
    businessChallenges,
    missingInformation,
    industryInsights,
    completenessScore,
  };
}

function buildCustomerSummary(
  analysis: CEOBusinessAnalysis,
  context: SalesAgentContext | undefined,
  plan: ProjectExecutionPlan,
): string {
  const audience = context?.targetAudience ?? "their target customers";
  const country = context?.country ?? "their market";
  const budget = context?.budget ?? analysis.estimatedBudget.max;

  return (
    `${analysis.business} is a ${analysis.industry} business operating in ${country}, ` +
    `focused on ${analysis.goals.join("; ").toLowerCase()}. ` +
    `They are evaluating ${plan.departments.length} departments with an estimated ` +
    `investment up to ${formatCurrency(budget, analysis.estimatedBudget.currency)} ` +
    `to reach ${audience}.`
  );
}

function buildBusinessChallenges(
  analysis: CEOBusinessAnalysis,
  industryChallenges: readonly string[],
  regulated: boolean,
): string[] {
  const challenges = new Set<string>();

  for (const goal of analysis.goals) {
    challenges.add(`Achieving goal: ${goal}`);
  }

  for (const requirement of analysis.requirements) {
    challenges.add(`Requirement gap: ${requirement}`);
  }

  for (const challenge of industryChallenges.slice(0, 3)) {
    challenges.add(challenge);
  }

  if (regulated) {
    challenges.add("Regulated industry compliance and patient/customer data handling");
  }

  if (analysis.estimatedComplexity === "high" || analysis.estimatedComplexity === "enterprise") {
    challenges.add("Multi-workstream coordination across departments and integrations");
  }

  if (analysis.missingInformation.length > 0) {
    challenges.add("Incomplete discovery inputs may delay scoping and pricing accuracy");
  }

  return [...challenges];
}

function collectMissingInformation(
  analysis: CEOBusinessAnalysis,
  context: SalesAgentContext | undefined,
): string[] {
  const missing = new Set(analysis.missingInformation);

  if (!context?.targetAudience) {
    missing.add("target customer profile");
  }
  if (!context?.country) {
    missing.add("operating country or service area");
  }
  if (!context?.budget) {
    missing.add("confirmed budget allocation");
  }
  if (!context?.metadata?.currentWebsite) {
    missing.add("current website status");
  }
  if (!context?.metadata?.onlineBooking) {
    missing.add("online booking system details");
  }

  return [...missing];
}

function buildIndustryInsights(
  analysis: CEOBusinessAnalysis,
  industryProfile: ReturnType<typeof knowledge.getIndustry>,
  regulated: boolean,
): string[] {
  const insights: string[] = [];

  if (industryProfile) {
    if (industryProfile.kpis.length > 0) {
      insights.push(`Key KPIs: ${industryProfile.kpis.slice(0, 3).join(", ")}`);
    }
    if (industryProfile.commonAutomationOpportunities.length > 0) {
      insights.push(
        `Automation opportunities: ${industryProfile.commonAutomationOpportunities.slice(0, 2).join("; ")}`,
      );
    }
  }

  if (regulated) {
    insights.push("Compliance review recommended before automation and data capture go live.");
  }

  insights.push(
    `Estimated complexity: ${analysis.estimatedComplexity} (${analysis.estimatedTimeline.summary}).`,
  );

  return insights;
}

function calculateCompletenessScore(
  analysis: CEOBusinessAnalysis,
  context: SalesAgentContext | undefined,
  missingCount: number,
): number {
  const totalFields = 8;
  const ceoFieldsPresent =
    (analysis.business ? 1 : 0) +
    (analysis.industry ? 1 : 0) +
    (analysis.goals.length > 0 ? 1 : 0) +
    (analysis.requirements.length > 0 ? 1 : 0) +
    (analysis.estimatedBudget.max > 0 ? 1 : 0);

  const contextFieldsPresent =
    (context?.targetAudience ? 1 : 0) +
    (context?.country ? 1 : 0) +
    (context?.budget ? 1 : 0);

  const baseScore = ((ceoFieldsPresent + contextFieldsPresent) / totalFields) * 100;
  const penalty = missingCount * 5;

  return Math.max(0, Math.min(100, Math.round(baseScore - penalty)));
}

function normalizeIndustryId(industry: string): string {
  return industry.trim().toLowerCase().replace(/\s+/g, "-");
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

import type { ProjectRequest } from "../../types/project";
import type { SalesDepartmentResult } from "../../types/sales";
import type { Proposal } from "../../departments/sales/proposal/schema";
import { getKnowledgeRegistry } from "../../knowledge";
import { BusinessAnalysisEngine } from "../business-analysis";
import { OpportunityEngine } from "../opportunities";
import { RecommendationEngine } from "../recommendations";
import { SolutionDesigner } from "../solution-design";
import type {
  BusinessStrategy,
  ExpectedBusinessImpact,
  PriorityRoadmapPhase,
  ReasoningContext,
  StrategicReasonerInput,
  StrategicReasonerOutput,
  StrategicReasoningResult,
} from "../types";

/**
 * Final reasoning engine — consumes Knowledge Layer, sales analysis, and proposal data.
 * Returns business strategy, solution, priority roadmap, and expected impact.
 */
export class StrategicReasoner {
  private readonly knowledge = getKnowledgeRegistry();
  private readonly businessAnalysisEngine = new BusinessAnalysisEngine();
  private readonly opportunityEngine = new OpportunityEngine();
  private readonly recommendationEngine = new RecommendationEngine();
  private readonly solutionDesigner = new SolutionDesigner();

  reason(input: StrategicReasonerInput): StrategicReasonerOutput {
    try {
      const context = toReasoningContext(input);

      const analysisResult = this.businessAnalysisEngine.analyze({
        ...context,
        projectRisks: input.projectRisks,
        discoveryNotes: input.discoveryNotes,
        businessAnalysisSummary: input.businessAnalysisSummary,
      });
      if (!analysisResult.success || !analysisResult.data) {
        return { success: false, error: analysisResult.error ?? "Business analysis failed." };
      }

      const opportunityResult = this.opportunityEngine.discover({
        context,
        businessAnalysis: analysisResult.data,
      });
      if (!opportunityResult.success || !opportunityResult.data) {
        return { success: false, error: opportunityResult.error ?? "Opportunity discovery failed." };
      }

      const recommendationResult = this.recommendationEngine.prioritize({
        context,
        businessAnalysis: analysisResult.data,
        opportunities: opportunityResult.data,
      });
      if (!recommendationResult.success || !recommendationResult.data) {
        return {
          success: false,
          error: recommendationResult.error ?? "Recommendation prioritization failed.",
        };
      }

      const industryProfile = this.knowledge.getIndustry(input.industry);
      const playbooks = this.knowledge.getPlaybooksByIndustry(analysisResult.data.industryId);
      const primaryPlaybook = playbooks[0];

      const solutionResult = this.solutionDesigner.design({
        context,
        businessAnalysis: analysisResult.data,
        recommendations: recommendationResult.data,
        requestedServices: input.services,
        recommendedServices: input.recommendedServices,
        playbookServiceIds: primaryPlaybook?.recommendedServices,
        estimatedPriceRange: input.estimatedPriceRange,
        estimatedTimeline: input.estimatedTimeline,
      });
      if (!solutionResult.success || !solutionResult.data) {
        return { success: false, error: solutionResult.error ?? "Solution design failed." };
      }

      const strategy = buildBusinessStrategy(
        input,
        analysisResult.data,
        industryProfile?.commonBusinessGoals ?? [],
        primaryPlaybook,
      );
      const roadmap = buildPriorityRoadmap(solutionResult.data.components);
      const expectedImpact = buildExpectedImpact(
        industryProfile?.kpis ?? [],
        analysisResult.data,
        recommendationResult.data.topPriorities,
      );

      const result: StrategicReasoningResult = {
        requestId: input.requestId,
        generatedAt: new Date().toISOString(),
        businessAnalysis: analysisResult.data,
        opportunities: opportunityResult.data,
        recommendations: recommendationResult.data,
        solution: solutionResult.data,
        strategy,
        roadmap,
        expectedImpact,
        executiveSummary: buildExecutiveSummary(input, strategy, solutionResult.data, expectedImpact),
        nextStep: determineNextStep(input, analysisResult.data),
      };

      return { success: true, result };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Strategic reasoning failed.";
      return { success: false, error: message };
    }
  }

  /**
   * Builds engine input from a project request and optional sales pipeline outputs.
   */
  buildInput(params: {
    requestId: string;
    request: ProjectRequest;
    salesResult?: SalesDepartmentResult;
    proposal?: Proposal;
  }): StrategicReasonerInput {
    const profile = params.salesResult?.leadQualification?.profile;
    const metadata = params.request.metadata ?? {};

    return {
      requestId: params.requestId,
      industry: profile?.industry ?? params.request.industry,
      goals: profile?.goals ?? params.request.goal,
      budget: profile?.budget ?? params.request.budget,
      services: profile?.services ?? params.request.services,
      targetAudience: profile?.targetAudience ?? (metadata.targetAudience as string | undefined),
      country: profile?.country ?? (metadata.country as string | undefined),
      businessName: profile?.businessName ?? (metadata.businessName as string | undefined),
      timeline: profile?.timeline ?? (metadata.timeline as string | undefined),
      projectRisks: params.salesResult?.pricing?.projectRisks ?? params.proposal?.risks,
      discoveryNotes: params.salesResult?.discovery?.discoveryNotes,
      businessAnalysisSummary:
        params.salesResult?.businessAnalysis?.projectSummary ??
        params.proposal?.recommendedSolution,
      recommendedServices: [
        ...(params.salesResult?.businessAnalysis?.recommendedServices.map((s) => s.service) ?? []),
        ...(params.proposal?.recommendedServices.map((s) => s.service) ?? []),
      ],
      estimatedPriceRange:
        params.salesResult?.pricing?.estimatedPriceRange ?? params.proposal?.estimatedPriceRange,
      estimatedTimeline:
        params.salesResult?.pricing?.estimatedTimeline ?? params.proposal?.timeline,
      proposalSummary: params.proposal?.executiveSummary,
      proposalChallenges: params.proposal?.clientChallenges,
    };
  }
}

function toReasoningContext(input: StrategicReasonerInput): ReasoningContext {
  return {
    requestId: input.requestId,
    industry: input.industry,
    goals: input.goals,
    budget: input.budget,
    services: input.services,
    targetAudience: input.targetAudience,
    country: input.country,
    businessName: input.businessName,
    timeline: input.timeline,
  };
}

function buildBusinessStrategy(
  input: StrategicReasonerInput,
  analysis: StrategicReasoningResult["businessAnalysis"],
  industryGoals: string[],
  playbook: ReturnType<ReturnType<typeof getKnowledgeRegistry>["getPlaybook"]>,
): BusinessStrategy {
  const name = input.businessName ?? "The business";

  return {
    vision: `${name} becomes the leading ${analysis.businessType} provider in ${input.country ?? "its market"} through AI-powered customer engagement.`,
    objectives: [
      input.goals,
      ...industryGoals.slice(0, 2),
      ...(playbook ? [playbook.objective] : []),
    ].filter((v, i, arr) => arr.indexOf(v) === i),
    positioning: `Technology-enabled ${analysis.businessType} delivering faster response times and seamless customer experiences.`,
    competitiveAdvantages: [
      ...analysis.strengths.slice(0, 2),
      "Integrated AI engagement across customer touchpoints",
      ...(analysis.regulated ? ["Compliance-aware data handling"] : []),
    ],
    riskMitigation: analysis.risks.map((r) => r.mitigation),
    successMetrics: playbook?.kpis ?? industryGoals.slice(0, 4),
  };
}

function buildPriorityRoadmap(
  components: StrategicReasoningResult["solution"]["components"],
): PriorityRoadmapPhase[] {
  const phases: PriorityRoadmapPhase[] = [];

  for (const phaseNum of [1, 2, 3] as const) {
    const phaseComponents = components.filter((c) => c.phase === phaseNum);
    if (phaseComponents.length === 0) continue;

    phases.push({
      phase: phaseNum,
      name: { 1: "Foundation", 2: "Automation", 3: "Optimization" }[phaseNum],
      durationWeeks: estimatePhaseDuration(phaseComponents.length),
      objectives: phaseComponents.map((c) => `Deploy ${c.name}`),
      deliverables: phaseComponents.map((c) => c.description),
      dependencies:
        phaseNum === 1
          ? []
          : [`Phase ${phaseNum - 1} complete`],
    });
  }

  return phases;
}

function estimatePhaseDuration(componentCount: number): { minimum: number; maximum: number } {
  if (componentCount <= 1) return { minimum: 1, maximum: 2 };
  if (componentCount <= 3) return { minimum: 2, maximum: 4 };
  return { minimum: 3, maximum: 6 };
}

function buildExpectedImpact(
  kpis: string[],
  analysis: StrategicReasoningResult["businessAnalysis"],
  topRecommendations: StrategicReasoningResult["recommendations"]["topPriorities"],
): ExpectedBusinessImpact {
  const highImpactCount = topRecommendations.filter((r) => r.score >= 70).length;
  const confidenceLevel =
    highImpactCount >= 3 ? "high" : highImpactCount >= 1 ? "medium" : "low";

  return {
    shortTerm: [
      "Reduced response time to customer inquiries",
      "Captured after-hours leads that would otherwise be lost",
      ...analysis.strengths.slice(0, 1),
    ],
    mediumTerm: [
      "Measurable improvement in lead-to-conversion rates",
      "Reduced staff time on repetitive customer communication",
      ...topRecommendations.slice(0, 2).map((r) => r.expectedImpact),
    ],
    longTerm: [
      "Scalable customer engagement without proportional staff growth",
      "Data-driven optimization of customer journey touchpoints",
      `Sustained improvement in ${kpis[0] ?? "key business metrics"}`,
    ],
    kpis: kpis.length > 0 ? kpis : ["Lead response time", "Conversion rate", "Customer satisfaction"],
    confidenceLevel,
  };
}

function buildExecutiveSummary(
  input: StrategicReasonerInput,
  strategy: BusinessStrategy,
  solution: StrategicReasoningResult["solution"],
  impact: ExpectedBusinessImpact,
): string {
  const name = input.businessName ?? "The client";
  return (
    `${name} (${input.industry}) strategic analysis complete. ` +
    `Vision: ${strategy.vision} ` +
    `Recommended solution: ${solution.components.map((c) => c.name).join(" + ")} ` +
    `with estimated investment of CAD $${solution.estimatedInvestment.minimum.toLocaleString()}–` +
    `$${solution.estimatedInvestment.maximum.toLocaleString()}. ` +
    `Expected ${impact.confidenceLevel}-confidence impact across ${impact.kpis.length} KPIs ` +
    `within ${solution.estimatedTimeline.minimumWeeks}–${solution.estimatedTimeline.maximumWeeks} weeks.`
  );
}

function determineNextStep(
  input: StrategicReasonerInput,
  analysis: StrategicReasoningResult["businessAnalysis"],
): string {
  if (analysis.risks.some((r) => r.severity === "high")) {
    return "Resolve high-severity risks before proceeding to solution implementation.";
  }
  if (input.budget < 1000) {
    return "Confirm phased delivery plan aligned to budget constraints.";
  }
  return "Review strategic roadmap and approve phase-one scope for kickoff.";
}

export type {
  StrategicReasonerInput,
  StrategicReasonerOutput,
  StrategicReasoningResult,
};

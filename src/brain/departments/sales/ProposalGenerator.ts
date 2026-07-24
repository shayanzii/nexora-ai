import type { CEOBusinessAnalysis } from "../../agents/ceo/CEOOutput";
import type { ProjectExecutionPlan } from "../../orchestrator/ExecutionPlan";

import type {
  RequirementAnalysis,
  SalesProposal,
  SalesProposalRoadmapPhase,
  SalesServiceRecommendation,
} from "./SalesTypes";

export interface ProposalGeneratorInput {
  analysis: CEOBusinessAnalysis;
  plan: ProjectExecutionPlan;
  requirements: RequirementAnalysis;
  recommendedServices: readonly SalesServiceRecommendation[];
}

/** Generates a structured sales proposal from analysis and recommendations. */
export function generateSalesProposal(input: ProposalGeneratorInput): SalesProposal {
  const { analysis, plan, requirements, recommendedServices } = input;

  const expectedOutcomes = buildExpectedOutcomes(recommendedServices, analysis);
  const implementationRoadmap = buildImplementationRoadmap(plan, analysis);
  const nextSteps = buildNextSteps(analysis, requirements);

  return {
    executiveSummary: buildExecutiveSummary(analysis, recommendedServices),
    businessChallenges: requirements.businessChallenges,
    recommendedServices,
    expectedOutcomes,
    implementationRoadmap,
    nextSteps,
    generatedAt: new Date().toISOString(),
  };
}

function buildExecutiveSummary(
  analysis: CEOBusinessAnalysis,
  services: readonly SalesServiceRecommendation[],
): string {
  const primary = services
    .filter((service) => service.priority === "primary")
    .map((service) => service.name)
    .join(", ");

  return (
    `${analysis.business} is a ${analysis.industry} business seeking to ${analysis.goals.join(" and ").toLowerCase()}. ` +
    `Nexora AI recommends a ${analysis.estimatedComplexity}-complexity engagement focused on ` +
    `${primary || services.map((service) => service.name).join(", ")} with an estimated investment of ` +
    `${formatCurrency(analysis.estimatedBudget.min, analysis.estimatedBudget.currency)}–` +
    `${formatCurrency(analysis.estimatedBudget.max, analysis.estimatedBudget.currency)} over ` +
    `${analysis.estimatedTimeline.minWeeks}–${analysis.estimatedTimeline.maxWeeks} weeks.`
  );
}

function buildExpectedOutcomes(
  services: readonly SalesServiceRecommendation[],
  analysis: CEOBusinessAnalysis,
): string[] {
  const outcomes = new Set<string>();

  for (const service of services) {
    for (const outcome of service.expectedOutcomes) {
      outcomes.add(outcome);
    }
  }

  for (const goal of analysis.goals) {
    outcomes.add(`Measurable progress toward: ${goal}`);
  }

  return [...outcomes];
}

function buildImplementationRoadmap(
  plan: ProjectExecutionPlan,
  analysis: CEOBusinessAnalysis,
): SalesProposalRoadmapPhase[] {
  const buildDepartments = plan.departmentOrder.filter((dept) =>
    ["website", "seo", "automation", "app", "marketing", "brand"].includes(dept),
  );
  const qaIndex = plan.departmentOrder.indexOf("qa");
  const deliveryIndex = plan.departmentOrder.indexOf("delivery");

  const phases: SalesProposalRoadmapPhase[] = [
    {
      phase: 1,
      name: "Discovery and Qualification",
      departments: ["sales"],
      durationWeeks: "1",
      deliverables: [
        "Completed discovery questionnaire",
        "Validated scope and success criteria",
        "Approved service recommendations",
      ],
    },
  ];

  if (buildDepartments.length > 0) {
    phases.push({
      phase: 2,
      name: "Build and Integration",
      departments: buildDepartments,
      durationWeeks: `${Math.max(1, analysis.estimatedTimeline.minWeeks - 2)}–${analysis.estimatedTimeline.maxWeeks - 1}`,
      deliverables: buildDepartments.map(
        (department) => `${capitalize(department)} workstream deliverables`,
      ),
    });
  }

  if (qaIndex >= 0) {
    phases.push({
      phase: phases.length + 1,
      name: "Quality Assurance",
      departments: ["qa"],
      durationWeeks: "1",
      deliverables: ["Acceptance testing report", "Issue remediation and sign-off"],
    });
  }

  if (deliveryIndex >= 0) {
    phases.push({
      phase: phases.length + 1,
      name: "Launch and Handoff",
      departments: ["delivery"],
      durationWeeks: "1",
      deliverables: [
        "Production launch",
        "Client training and documentation",
        "Post-launch support window",
      ],
    });
  }

  return phases;
}

function buildNextSteps(
  analysis: CEOBusinessAnalysis,
  requirements: RequirementAnalysis,
): string[] {
  const steps = [
    "Schedule a discovery call to validate requirements and answer open questions.",
    "Confirm budget, timeline, and decision-making stakeholders.",
    "Review and approve the recommended service scope.",
  ];

  if (requirements.missingInformation.length > 0) {
    steps.unshift(
      `Provide missing information: ${requirements.missingInformation.slice(0, 3).join(", ")}.`,
    );
  }

  if (analysis.followUpQuestions.length > 0) {
    steps.push(`Address CEO follow-up: ${analysis.followUpQuestions[0]}`);
  }

  steps.push("Sign proposal and initiate Sales → Website → Delivery orchestration pipeline.");

  return steps;
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

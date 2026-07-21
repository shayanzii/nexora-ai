import { randomUUID } from "crypto";

import { getKnowledgeRegistry } from "../../../knowledge";
import type {
  Proposal,
  ProposalDeliverable,
  ProposalEngineInput,
  ProposalMilestone,
} from "./schema";

const knowledge = getKnowledgeRegistry();

/**
 * Generates a structured proposal object from sales pipeline inputs.
 */
export function generateProposal(input: ProposalEngineInput): Proposal {
  const challenges = buildClientChallenges(input);
  const deliverables = buildDeliverables(input.recommendedServices);
  const milestones = buildMilestones(input.estimatedTimeline);
  const assumptions = buildAssumptions(input);
  const nextSteps = buildNextSteps(input);

  return {
    id: `proposal-${randomUUID()}`,
    requestId: input.requestId,
    clientName: input.clientName,
    industry: input.industry,
    country: input.country,
    generatedAt: new Date().toISOString(),
    executiveSummary: buildExecutiveSummary(input),
    clientChallenges: challenges,
    recommendedSolution: buildRecommendedSolution(input),
    recommendedServices: input.recommendedServices,
    deliverables,
    timeline: input.estimatedTimeline,
    milestones,
    estimatedPriceRange: input.estimatedPriceRange,
    assumptions,
    risks: input.projectRisks,
    nextSteps,
  };
}

function buildClientChallenges(input: ProposalEngineInput): string[] {
  const industryDefaults = knowledge.getIndustryChallenges(input.industry);
  const goalChallenge = `Primary business goal: ${input.goals}.`;

  if (!industryDefaults.includes(goalChallenge)) {
    return [goalChallenge, ...industryDefaults.slice(0, 2)];
  }

  return industryDefaults;
}

function buildExecutiveSummary(input: ProposalEngineInput): string {
  return (
    `${input.clientName} is a ${input.industry} business in ${input.country} seeking to ` +
    `${input.goals.toLowerCase()}. Nexora AI recommends a ${input.estimatedComplexity}-complexity ` +
    `engagement spanning ${input.recommendedServices.map((s) => s.service).join(", ")} ` +
    `with an estimated investment of CAD $${input.estimatedPriceRange.minimum.toLocaleString()}–` +
    `$${input.estimatedPriceRange.maximum.toLocaleString()} over ` +
    `${input.estimatedTimeline.minimumWeeks}–${input.estimatedTimeline.maximumWeeks} weeks.`
  );
}

function buildRecommendedSolution(input: ProposalEngineInput): string {
  const services = input.recommendedServices
    .filter((s) => s.priority === "primary")
    .map((s) => s.service)
    .join(", ");

  return (
    `Deploy AI-powered customer engagement through ${services || input.requestedServices.join(", ")} ` +
    `to address ${input.targetAudience}. ${input.discoveryAnalysis} ` +
    `${input.businessAnalysisSummary}`
  );
}

function buildDeliverables(services: ProposalEngineInput["recommendedServices"]): ProposalDeliverable[] {
  const seen = new Set<string>();
  const deliverables: ProposalDeliverable[] = [];

  for (const service of services) {
    if (seen.has(service.service)) continue;
    seen.add(service.service);

    const definition = knowledge.getService(service.service);
    const template = definition?.deliverable ?? {
      name: `${service.service} Configuration`,
      description: `Scoped delivery plan for ${service.service}.`,
    };

    deliverables.push({
      id: `deliverable-${service.service}`,
      name: template.name,
      description: template.description,
      service: service.service,
    });
  }

  return deliverables;
}

function buildMilestones(timeline: ProposalEngineInput["estimatedTimeline"]): ProposalMilestone[] {
  const mid = Math.ceil((timeline.minimumWeeks + timeline.maximumWeeks) / 2);
  const templateContent = (id: string, fallback: string) =>
    knowledge.getProposalTemplate(id)?.content ?? fallback;

  return [
    {
      id: "milestone-discovery",
      name: "Discovery & Scoping",
      weekStart: 1,
      weekEnd: 1,
      description: templateContent(
        "milestone-discovery",
        "Confirm requirements, integrations, and success metrics.",
      ),
    },
    {
      id: "milestone-build",
      name: "Configuration & Build",
      weekStart: 2,
      weekEnd: mid,
      description: templateContent(
        "milestone-build",
        "Configure AI workflows, knowledge base, and integrations.",
      ),
    },
    {
      id: "milestone-test",
      name: "Testing & Training",
      weekStart: mid + 1,
      weekEnd: timeline.maximumWeeks - 1,
      description: templateContent(
        "milestone-test",
        "Internal testing, client review, and team training.",
      ),
    },
    {
      id: "milestone-launch",
      name: "Launch & Handoff",
      weekStart: timeline.maximumWeeks,
      weekEnd: timeline.maximumWeeks,
      description: templateContent(
        "milestone-launch",
        "Go-live support and post-launch optimization checklist.",
      ),
    },
  ];
}

function buildAssumptions(input: ProposalEngineInput): string[] {
  const assumptions = [
    knowledge.getProposalTemplate("assumption-client-access")?.content ??
      "Client provides timely access to business information and decision-makers.",
    knowledge.getProposalTemplate("assumption-integrations")?.content ??
      "Existing website and communication channels are accessible for integration.",
    `Stated timeline expectation: ${input.clientTimeline}.`,
    `Qualification completeness score: ${input.qualificationScore}%.`,
  ];

  if (!input.budgetAligned) {
    assumptions.push(
      knowledge.getProposalTemplate("assumption-phased-budget")?.content ??
        "Final scope may require phasing to align with stated budget constraints.",
    );
  }

  return assumptions;
}

function buildNextSteps(input: ProposalEngineInput): string[] {
  const steps = [
    knowledge.getProposalTemplate("next-step-approve-scope")?.content ??
      "Review and approve proposed scope and deliverables.",
    knowledge.getProposalTemplate("next-step-confirm-integrations")?.content ??
      "Confirm integration access (website, calendar, CRM as applicable).",
    knowledge.getProposalTemplate("next-step-kickoff")?.content ??
      "Schedule kickoff call to finalize project timeline.",
  ];

  if (!input.budgetAligned) {
    steps.unshift("Align on phased delivery plan to match budget expectations.");
  }

  steps.push(
    knowledge.getProposalTemplate("next-step-sign-agreement")?.content ??
      "Sign agreement and initiate discovery kickoff.",
  );

  return steps;
}

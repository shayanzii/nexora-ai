import { generateProposal } from "./proposal-generator";
import type {
  Proposal,
  ProposalEngineInput,
  ProposalEngineResult,
} from "./schema";
import type {
  BusinessAnalysisOutput,
  DiscoveryOutput,
  LeadQualificationOutput,
  PricingOutput,
} from "../../../types/sales";

/**
 * Proposal Engine — assembles structured proposals from sales pipeline outputs.
 */
export class ProposalEngine {
  generate(input: ProposalEngineInput): ProposalEngineResult {
    try {
      const proposal = generateProposal(input);
      return { success: true, proposal };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Proposal generation failed.";
      return { success: false, error: message };
    }
  }

  /**
   * Builds engine input from sales department step outputs.
   */
  buildInput(params: {
    requestId: string;
    leadQualification: LeadQualificationOutput;
    discovery: DiscoveryOutput;
    businessAnalysis: BusinessAnalysisOutput;
    pricing: PricingOutput;
  }): ProposalEngineInput | null {
    const profile = params.leadQualification.profile;

    if (!profile.businessName || !profile.industry || !profile.country) {
      return null;
    }

    return {
      requestId: params.requestId,
      clientName: profile.businessName,
      industry: profile.industry,
      country: profile.country,
      goals: profile.goals ?? "",
      targetAudience: profile.targetAudience ?? "",
      requestedServices: profile.services,
      statedBudget: profile.budget ?? 0,
      clientTimeline: profile.timeline ?? "",
      qualificationScore: params.leadQualification.completenessScore,
      discoveryAnalysis: params.discovery.businessAnalysis,
      discoveryNotes: params.discovery.discoveryNotes,
      businessAnalysisSummary: params.businessAnalysis.projectSummary,
      scopeOutline: params.businessAnalysis.deliverableOutline,
      recommendedServices: params.businessAnalysis.recommendedServices,
      estimatedPriceRange: params.pricing.estimatedPriceRange,
      estimatedTimeline: params.pricing.estimatedTimeline,
      estimatedComplexity: params.pricing.estimatedComplexity,
      projectRisks: params.pricing.projectRisks,
      budgetAligned: params.pricing.budgetAligned,
    };
  }
}

export type { Proposal, ProposalEngineInput, ProposalEngineResult };

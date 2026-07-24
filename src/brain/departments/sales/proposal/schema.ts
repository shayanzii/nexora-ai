import type {
  PriceRange,
  ProjectRisk,
  RecommendedService,
  TimelineEstimate,
} from "../../../types/sales";

export interface ProposalDeliverable {
  id: string;
  name: string;
  description: string;
  service: string;
}

export interface ProposalMilestone {
  id: string;
  name: string;
  weekStart: number;
  weekEnd: number;
  description: string;
}

/**
 * Structured proposal document — JSON only, no markdown/HTML/PDF.
 */
export interface Proposal {
  id: string;
  requestId: string;
  clientName: string;
  industry: string;
  country: string;
  generatedAt: string;
  executiveSummary: string;
  clientChallenges: string[];
  recommendedSolution: string;
  recommendedServices: RecommendedService[];
  deliverables: ProposalDeliverable[];
  timeline: TimelineEstimate;
  milestones: ProposalMilestone[];
  estimatedPriceRange: PriceRange;
  assumptions: string[];
  risks: ProjectRisk[];
  nextSteps: string[];
}

export interface ProposalEngineInput {
  requestId: string;
  clientName: string;
  industry: string;
  country: string;
  goals: string;
  targetAudience: string;
  requestedServices: string[];
  statedBudget: number;
  clientTimeline: string;
  qualificationScore: number;
  discoveryAnalysis: string;
  discoveryNotes: string[];
  businessAnalysisSummary: string;
  scopeOutline: string[];
  recommendedServices: RecommendedService[];
  estimatedPriceRange: PriceRange;
  estimatedTimeline: TimelineEstimate;
  estimatedComplexity: string;
  projectRisks: ProjectRisk[];
  budgetAligned: boolean;
}

export interface ProposalEngineResult {
  success: boolean;
  proposal?: Proposal;
  error?: string;
}

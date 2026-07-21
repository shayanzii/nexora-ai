import type {
  PriceRange,
  ProjectRisk,
  TimelineEstimate,
} from "../types/sales";

export type ImpactLevel = "low" | "medium" | "high";
export type EffortLevel = "low" | "medium" | "high";
export type RecommendationPriority = "critical" | "high" | "medium" | "low";
export type RecommendationCategory =
  | "automation"
  | "ai"
  | "marketing"
  | "operational"
  | "revenue"
  | "solution";
export type SolutionComponentType = "service" | "capability" | "integration";
export type ConfidenceLevel = "low" | "medium" | "high";

/** Shared context passed between reasoning engines. */
export interface ReasoningContext {
  requestId: string;
  industry: string;
  goals: string;
  budget: number;
  services: string[];
  targetAudience?: string;
  country?: string;
  businessName?: string;
  timeline?: string;
}

/** Input for BusinessAnalysisEngine. */
export interface BusinessAnalysisInput extends ReasoningContext {
  projectRisks?: ProjectRisk[];
  discoveryNotes?: string[];
  businessAnalysisSummary?: string;
}

/** A stage in the customer journey with mapped pain points. */
export interface CustomerJourneyStage {
  stage: "awareness" | "consideration" | "conversion" | "service" | "retention";
  label: string;
  touchpoints: string[];
  painPoints: string[];
  opportunities: string[];
}

/** Output of BusinessAnalysisEngine. */
export interface BusinessAnalysisResult {
  requestId: string;
  businessType: string;
  industryId: string;
  regulated: boolean;
  goals: string[];
  risks: ProjectRisk[];
  strengths: string[];
  weaknesses: string[];
  customerJourney: CustomerJourneyStage[];
  growthBottlenecks: string[];
  summary: string;
}

/** A discovered business opportunity. */
export interface OpportunityItem {
  id: string;
  category: RecommendationCategory;
  title: string;
  description: string;
  impact: ImpactLevel;
  effort: EffortLevel;
  relatedServices: string[];
  source: string;
}

/** Input for OpportunityEngine. */
export interface OpportunityInput {
  context: ReasoningContext;
  businessAnalysis: BusinessAnalysisResult;
}

/** Output of OpportunityEngine. */
export interface OpportunityAnalysis {
  automation: OpportunityItem[];
  ai: OpportunityItem[];
  marketing: OpportunityItem[];
  operational: OpportunityItem[];
  revenue: OpportunityItem[];
  all: OpportunityItem[];
  summary: string;
}

/** A scored, prioritized recommendation with rationale. */
export interface Recommendation {
  id: string;
  category: RecommendationCategory;
  title: string;
  description: string;
  rationale: string;
  score: number;
  priority: RecommendationPriority;
  relatedServices: string[];
  expectedImpact: string;
  timeframe: string;
}

/** Input for RecommendationEngine. */
export interface RecommendationInput {
  context: ReasoningContext;
  businessAnalysis: BusinessAnalysisResult;
  opportunities: OpportunityAnalysis;
}

/** Output of RecommendationEngine. */
export interface RecommendationResult {
  recommendations: Recommendation[];
  topPriorities: Recommendation[];
  summary: string;
}

/** A component in a complete business solution. */
export interface SolutionComponent {
  id: string;
  type: SolutionComponentType;
  name: string;
  description: string;
  serviceId?: string;
  phase: 1 | 2 | 3;
  dependencies: string[];
  rationale: string;
}

/** Input for SolutionDesigner. */
export interface SolutionDesignInput {
  context: ReasoningContext;
  businessAnalysis: BusinessAnalysisResult;
  recommendations: RecommendationResult;
  requestedServices?: string[];
  recommendedServices?: string[];
  playbookServiceIds?: string[];
  estimatedPriceRange?: PriceRange;
  estimatedTimeline?: TimelineEstimate;
}

/** A complete business solution — not just a service list. */
export interface BusinessSolution {
  id: string;
  requestId: string;
  name: string;
  objective: string;
  components: SolutionComponent[];
  architecture: string;
  integrationPoints: string[];
  estimatedTimeline: TimelineEstimate;
  estimatedInvestment: PriceRange;
  summary: string;
}

/** Strategic business direction derived from analysis. */
export interface BusinessStrategy {
  vision: string;
  objectives: string[];
  positioning: string;
  competitiveAdvantages: string[];
  riskMitigation: string[];
  successMetrics: string[];
}

/** A phased priority roadmap. */
export interface PriorityRoadmapPhase {
  phase: number;
  name: string;
  durationWeeks: { minimum: number; maximum: number };
  objectives: string[];
  deliverables: string[];
  dependencies: string[];
}

/** Expected business impact across time horizons. */
export interface ExpectedBusinessImpact {
  shortTerm: string[];
  mediumTerm: string[];
  longTerm: string[];
  kpis: string[];
  confidenceLevel: ConfidenceLevel;
}

/** Full strategic reasoning output. */
export interface StrategicReasoningResult {
  requestId: string;
  generatedAt: string;
  businessAnalysis: BusinessAnalysisResult;
  opportunities: OpportunityAnalysis;
  recommendations: RecommendationResult;
  solution: BusinessSolution;
  strategy: BusinessStrategy;
  roadmap: PriorityRoadmapPhase[];
  expectedImpact: ExpectedBusinessImpact;
  executiveSummary: string;
  nextStep: string;
}

/** Input for StrategicReasoner — consumes knowledge, sales, and proposal data. */
export interface StrategicReasonerInput {
  requestId: string;
  industry: string;
  goals: string;
  budget: number;
  services: string[];
  targetAudience?: string;
  country?: string;
  businessName?: string;
  timeline?: string;
  projectRisks?: ProjectRisk[];
  discoveryNotes?: string[];
  businessAnalysisSummary?: string;
  recommendedServices?: string[];
  estimatedPriceRange?: PriceRange;
  estimatedTimeline?: TimelineEstimate;
  proposalSummary?: string;
  proposalChallenges?: string[];
}

/** Result wrapper for StrategicReasoner. */
export interface StrategicReasonerOutput {
  success: boolean;
  result?: StrategicReasoningResult;
  error?: string;
}

/** Standard engine result pattern used across reasoning engines. */
export interface ReasoningEngineResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

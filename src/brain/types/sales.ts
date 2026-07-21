import type { ComplexityLevel } from "./project";

/** Canonical keys for client discovery fields stored in ProjectRequest.metadata. */
export interface ClientDiscoveryMetadata {
  businessName?: string;
  country?: string;
  targetAudience?: string;
  timeline?: string;
}

/** Required fields for sales qualification. */
export type SalesRequiredField =
  | "businessName"
  | "industry"
  | "country"
  | "targetAudience"
  | "services"
  | "goals"
  | "budget"
  | "timeline";

export interface SalesFieldDefinition {
  field: SalesRequiredField;
  label: string;
  question: string;
}

export interface MissingFieldReport {
  field: SalesRequiredField;
  label: string;
  reason: string;
}

export interface ClarificationQuestion {
  field: SalesRequiredField;
  question: string;
  priority: "required" | "recommended";
}

export type SalesQualificationStatus = "needs_clarification" | "qualified";

export interface PriceRange {
  currency: "CAD";
  minimum: number;
  maximum: number;
  basis: string;
}

export interface TimelineEstimate {
  minimumWeeks: number;
  maximumWeeks: number;
  summary: string;
}

export interface ProjectRisk {
  id: string;
  severity: "low" | "medium" | "high";
  description: string;
  mitigation: string;
}

export interface RecommendedService {
  service: string;
  rationale: string;
  priority: "primary" | "secondary";
}

/** Normalized client profile used across the Sales Department. */
export interface ClientDiscoveryProfile {
  businessName: string | null;
  industry: string | null;
  country: string | null;
  targetAudience: string | null;
  services: string[];
  goals: string | null;
  budget: number | null;
  timeline: string | null;
}

/** @deprecated Use SalesDepartmentResult — retained for backward compatibility. */
export interface SalesQualificationPackage {
  projectSummary: string;
  businessAnalysis: string;
  recommendedServices: RecommendedService[];
  estimatedComplexity: ComplexityLevel;
  estimatedTimeline: TimelineEstimate;
  estimatedPriceRange: PriceRange;
  projectRisks: ProjectRisk[];
  nextStep: string;
}

/** @deprecated Use SalesDepartmentResult — retained for backward compatibility. */
export interface SalesAgentOutput {
  status: SalesQualificationStatus;
  completenessScore: number;
  fieldsPresent: SalesRequiredField[];
  fieldsMissing: SalesRequiredField[];
  missingFieldReports: MissingFieldReport[];
  clarificationQuestions?: ClarificationQuestion[];
  qualification?: SalesQualificationPackage;
}

export interface LeadQualificationOutput {
  isQualified: boolean;
  completenessScore: number;
  fieldsPresent: SalesRequiredField[];
  fieldsMissing: SalesRequiredField[];
  missingFieldReports: MissingFieldReport[];
  profile: ClientDiscoveryProfile;
  clarificationQuestions?: ClarificationQuestion[];
}

export interface DiscoveryOutput {
  businessAnalysis: string;
  discoveryNotes: string[];
  industry: string;
  targetAudience: string;
  operatingCountry: string;
}

export interface BusinessAnalysisOutput {
  projectSummary: string;
  recommendedServices: RecommendedService[];
  proposedScope: string[];
  deliverableOutline: string[];
  nextStep: string;
}

/** @deprecated Use BusinessAnalysisOutput */
export type ProposalOutput = BusinessAnalysisOutput;

export interface ProposalEngineOutput {
  proposal: import("../departments/sales/proposal/schema").Proposal;
  generatedAt: string;
}

export interface PricingOutput {
  estimatedPriceRange: PriceRange;
  estimatedTimeline: TimelineEstimate;
  estimatedComplexity: ComplexityLevel;
  complexityScore: number;
  projectRisks: ProjectRisk[];
  budgetAligned: boolean;
}

export interface FollowUpOutput {
  required: boolean;
  summary: string;
  actions: string[];
  recommendedContactWindow: string;
}

export interface SalesDepartmentStepResult {
  agentId: string;
  agentName: string;
  taskType: string;
  success: boolean;
  output: Record<string, unknown>;
  message?: string;
}

export interface SalesDepartmentResult {
  departmentId: string;
  status: SalesQualificationStatus;
  stepsExecuted: string[];
  stepsSkipped: string[];
  stepResults: SalesDepartmentStepResult[];
  completenessScore: number;
  fieldsPresent: SalesRequiredField[];
  fieldsMissing: SalesRequiredField[];
  clarificationQuestions?: ClarificationQuestion[];
  leadQualification?: LeadQualificationOutput;
  discovery?: DiscoveryOutput;
  /** @deprecated Use businessAnalysis */
  proposal?: BusinessAnalysisOutput;
  businessAnalysis?: BusinessAnalysisOutput;
  pricing?: PricingOutput;
  proposalDocument?: import("../departments/sales/proposal/schema").Proposal;
  followUp?: FollowUpOutput;
  summary: string;
  nextStep: string;
}

export const SALES_DEPARTMENT_ID = "sales-department";
export const SALES_TASK_TYPE = "qualify_client";

/** @deprecated Use SALES_DEPARTMENT_ID */
export const SALES_AGENT_ID = "sales-department";

export interface SalesDepartmentAgents {
  leadQualification: import("./agent").Agent;
  discovery: import("./agent").Agent;
  businessAnalysis: import("./agent").Agent;
  pricing: import("./agent").Agent;
  proposalEngine: import("./agent").Agent;
  followUp: import("./agent").Agent;
  /** @deprecated Use businessAnalysis */
  proposal?: import("./agent").Agent;
}

export type SalesPipelineAgentResult = import("./project").AgentResult;

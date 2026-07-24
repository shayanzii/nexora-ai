import type { CEOBusinessAnalysis } from "../../agents/ceo/CEOOutput";
import type { ProjectExecutionPlan } from "../../orchestrator/ExecutionPlan";
import type { OrchestratorTask } from "../../orchestrator/TaskTypes";

/** Sales work unit dispatched by the Project Orchestrator. */
export type ProjectTask = OrchestratorTask;

/** Supported Nexora service identifiers for sales recommendations. */
export const SALES_SUPPORTED_SERVICES = [
  "website",
  "seo",
  "ai-chatbot",
  "automation",
  "crm",
  "branding",
  "mobile-app",
  "voice-ai",
  "maintenance",
  "hosting",
] as const;

export type SalesServiceId = (typeof SALES_SUPPORTED_SERVICES)[number];

export interface SalesServiceDefinition {
  id: SalesServiceId;
  name: string;
  aliases: readonly string[];
  description: string;
  outcomes: readonly string[];
}

/** Maps orchestrator department IDs to sales service IDs. */
export const DEPARTMENT_SERVICE_MAP: Readonly<Record<string, SalesServiceId>> = {
  website: "website",
  seo: "seo",
  automation: "ai-chatbot",
  app: "mobile-app",
  brand: "branding",
  marketing: "seo",
};

export interface SalesDiscoveryQuestion {
  id: string;
  question: string;
  category: "discovery" | "qualification" | "technical" | "marketing";
  priority: "required" | "recommended";
  rationale?: string;
}

export interface SalesServiceRecommendation {
  serviceId: SalesServiceId;
  name: string;
  rationale: string;
  priority: "primary" | "secondary";
  expectedOutcomes: readonly string[];
}

export interface SalesProposalRoadmapPhase {
  phase: number;
  name: string;
  departments: readonly string[];
  durationWeeks: string;
  deliverables: readonly string[];
}

/** Structured sales proposal document. */
export interface SalesProposal {
  executiveSummary: string;
  businessChallenges: readonly string[];
  recommendedServices: readonly SalesServiceRecommendation[];
  expectedOutcomes: readonly string[];
  implementationRoadmap: readonly SalesProposalRoadmapPhase[];
  nextSteps: readonly string[];
  generatedAt: string;
}

/** Optional customer context not fully captured in CEO analysis. */
export interface SalesAgentContext {
  budget?: number;
  country?: string;
  targetAudience?: string;
  services?: readonly string[];
  metadata?: Readonly<Record<string, unknown>>;
}

/** Input to the Sales Agent — orchestrator task plus CEO and plan outputs. */
export interface SalesAgentInput {
  task: ProjectTask;
  analysis: CEOBusinessAnalysis;
  plan: ProjectExecutionPlan;
  context?: SalesAgentContext;
}

export interface RequirementAnalysis {
  customerSummary: string;
  businessGoals: readonly string[];
  businessChallenges: readonly string[];
  missingInformation: readonly string[];
  industryInsights: readonly string[];
  completenessScore: number;
}

/** Final structured output from the Sales Agent. */
export interface SalesResult {
  taskId: string;
  requestId: string;
  department: string;
  customerSummary: string;
  businessChallenges: readonly string[];
  recommendedServices: readonly SalesServiceRecommendation[];
  discoveryQuestions: readonly SalesDiscoveryQuestion[];
  proposal: SalesProposal;
  confidenceScore: number;
  completedAt: string;
}

export interface SalesAgentLogEvent {
  level: "info" | "error";
  action: "received" | "analysis" | "proposal" | "complete";
  taskId?: string;
  message: string;
}

export type SalesAgentLogger = (event: SalesAgentLogEvent) => void;

export {
  SalesAgent,
  getSalesAgent,
  resetSalesAgent,
  resolveSalesTask,
} from "./SalesAgent";

export type {
  SalesAgentInput,
  SalesAgentContext,
  SalesAgentLogEvent,
  SalesAgentLogger,
  SalesResult,
  SalesProposal,
  SalesProposalRoadmapPhase,
  SalesDiscoveryQuestion,
  SalesServiceRecommendation,
  SalesServiceDefinition,
  SalesServiceId,
  RequirementAnalysis,
  ProjectTask,
} from "./SalesTypes";

export {
  SALES_SUPPORTED_SERVICES,
  DEPARTMENT_SERVICE_MAP,
} from "./SalesTypes";

export {
  SalesError,
  SalesValidationError,
  SalesTaskNotFoundError,
  SalesWrongDepartmentError,
  SalesProposalError,
} from "./SalesErrors";

export type { SalesErrorCode } from "./SalesErrors";

export { analyzeRequirements } from "./RequirementAnalyzer";
export type { RequirementAnalyzerInput } from "./RequirementAnalyzer";

export { generateDiscoveryQuestions } from "./DiscoveryEngine";
export type { DiscoveryEngineInput } from "./DiscoveryEngine";

export {
  recommendServices,
  resolveServiceId,
  SALES_SERVICE_CATALOG,
} from "./SolutionRecommender";
export type { SolutionRecommenderInput } from "./SolutionRecommender";

export { generateSalesProposal } from "./ProposalGenerator";
export type { ProposalGeneratorInput } from "./ProposalGenerator";

// Legacy proposal engine (Sprint 8.x) — preserved for backward compatibility.
export {
  ProposalEngine,
  generateProposal,
  PROPOSAL_EXAMPLE_DENTIST_REQUEST,
  PROPOSAL_EXAMPLE_ENGINE_INPUT,
  PROPOSAL_EXAMPLE_HVAC_REQUEST,
  PROPOSAL_EXAMPLE_LAW_FIRM_REQUEST,
  PROPOSAL_EXAMPLE_PLUMBING_REQUEST,
  PROPOSAL_EXAMPLE_REQUESTS,
  PROPOSAL_EXAMPLE_RESTAURANT_REQUEST,
} from "./proposal";
export type {
  Proposal,
  ProposalDeliverable,
  ProposalEngineInput,
  ProposalEngineResult,
  ProposalExampleKey,
  ProposalMilestone,
} from "./proposal";

export type {
  Agent,
  AgentCapability,
  AgentContext,
  AgentResult,
  AgentTask,
  AssignedAgent,
  ComplexityLevel,
  ExecutionMode,
  ExecutionResult,
  ExecutionStatus,
  NextAction,
  NextActionType,
  ProjectContext,
  ProjectPlan,
  ProjectRequest,
  QueuedTask,
  ClarificationQuestion,
  ClientDiscoveryMetadata,
  ClientDiscoveryProfile,
  DiscoveryOutput,
  FollowUpOutput,
  LeadQualificationOutput,
  MissingFieldReport,
  PriceRange,
  PricingOutput,
  ProjectRisk,
  BusinessAnalysisOutput,
  ProposalEngineOutput,
  RecommendedService,
  SalesAgentOutput,
  SalesDepartmentResult,
  SalesDepartmentStepResult,
  SalesQualificationPackage,
  SalesQualificationStatus,
  SalesRequiredField,
  TimelineEstimate,
} from "./types";

export { createProjectContext, requestFromPlan } from "./types";
export { SALES_AGENT_ID, SALES_DEPARTMENT_ID, SALES_TASK_TYPE } from "./types";

export {
  BaseAgent,
  CEOAgent,
  CEOIntelligenceAgent,
  SalesDepartment,
  SalesAgent,
  LeadQualificationAgent,
  DiscoveryAgent,
  ProposalAgent,
  BusinessAnalysisAgent,
  ProposalEngineAgent,
  PricingAgent,
  FollowUpAgent,
  createDefaultSpecialistAgents,
  createDefaultSalesDepartmentAgents,
} from "./agents";

export {
  SALES_EXAMPLE_COMPLETE_REQUEST,
  SALES_EXAMPLE_INCOMPLETE_REQUEST,
  SALES_EXAMPLE_MINIMAL_REQUEST,
  SALES_EXAMPLE_REGULATED_REQUEST,
  SALES_EXAMPLE_REQUESTS,
  SALES_EXAMPLE_UNDER_BUDGET_REQUEST,
} from "./agents";
export type { SalesExampleRequestKey } from "./agents";

export type {
  CEOBusinessAnalysis,
  CEOCustomerRequest,
  CEOBudgetEstimate,
  CEOTimelineEstimate,
} from "./agents/ceo";

export {
  ProjectOrchestrator,
  getProjectOrchestrator,
  resetProjectOrchestrator,
  TaskManager,
  TaskQueue as OrchestratorTaskQueue,
  planTasks,
  buildExecutionGraph,
  assignInitialTaskStatuses,
  areDependenciesMet,
  deriveDepartmentOrder,
  getReadyTasks,
  sortTasksByDependencies,
  selectDepartments,
  sortDepartments,
  resolveDepartmentDependencies,
  estimateCriticalPathDuration,
  formatDepartmentChain,
  createOrchestratorTask,
  TASK_PRIORITIES,
  TASK_PRIORITY_WEIGHT,
  TASK_STATUSES,
  isTerminalTaskStatus,
  isExecutableTaskStatus,
  OrchestratorError,
  OrchestratorValidationError,
  CyclicDependencyError,
  TaskNotFoundError,
  KNOWN_DEPARTMENTS,
  DEPARTMENT_ORDER,
  DEFAULT_DEPARTMENT_DEPENDENCIES,
  SERVICE_DEPARTMENT_MAP,
  DEPARTMENT_DURATION_HOURS,
  DEPARTMENT_PRIORITY,
} from "./orchestrator";

export type {
  OrchestratorInput,
  OrchestratorLogEvent,
  OrchestratorLogger,
  TaskManagerLogEvent,
  TaskManagerLogger,
  TaskPlanInput,
  DepartmentId,
  KnownDepartmentId,
  DepartmentSelectionInput,
  ProjectExecutionPlan,
  ExecutionGraph,
  ExecutionGraphNode,
  ExecutionGraphEdge,
  OrchestratorTask,
  TaskPriority,
  TaskCreationInput,
  TaskStatus,
  OrchestratorErrorCode,
} from "./orchestrator";

export {
  buildQualificationPackage,
  calculateCompletenessScore,
  detectMissingFields,
  generateClarificationQuestions,
  parseClientDiscoveryProfile,
  SALES_REQUIRED_FIELDS,
} from "./agents/sales/qualification";

export { AgentRegistry } from "./registry";
export {
  WorkflowEngine,
  RuntimeEngine,
  TaskQueue,
  buildExecutionBatches,
  mergeAgentOutputs,
  estimateComplexity,
} from "./core";
export type { RuntimeEngineOptions, TaskQueueOptions, ComplexityEstimate } from "./core";
export { validateProjectRequest, validateBrainRequest } from "./schemas";
export type { BrainRequestPayload } from "./schemas";
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
  SalesAgent as SalesExecutionAgent,
  getSalesAgent,
  resetSalesAgent,
  resolveSalesTask,
  analyzeRequirements,
  generateDiscoveryQuestions,
  recommendServices as recommendSalesServices,
  generateSalesProposal,
  resolveServiceId,
  SALES_SUPPORTED_SERVICES,
  SALES_SERVICE_CATALOG,
  DEPARTMENT_SERVICE_MAP,
} from "./departments/sales";
export type {
  Proposal,
  ProposalDeliverable,
  ProposalEngineInput,
  ProposalEngineResult,
  ProposalExampleKey,
  ProposalMilestone,
  SalesAgentInput,
  SalesAgentContext,
  SalesResult,
  SalesProposal,
  SalesDiscoveryQuestion,
  SalesServiceRecommendation,
  RequirementAnalysis,
  ProjectTask,
  SalesErrorCode,
} from "./departments/sales";
export {
  SalesError,
  SalesValidationError,
  SalesTaskNotFoundError,
  SalesWrongDepartmentError,
  SalesProposalError,
} from "./departments/sales";

export {
  PricingEngine,
  getPricingEngine,
  resetPricingEngine,
  calculatePricing,
  calculateProfit,
  buildPackages,
  buildPaymentPlan,
  recommendUpsells,
  getPricingCatalog,
  resetPricingCatalog,
  DEFAULT_PRICING_CATALOG,
  extractBudgetFromSalesText,
  recommendPaymentPlanType,
} from "./pricing";

export type {
  PricingResult,
  PricingBreakdown,
  PricingLineItem,
  RecommendedPackage,
  RecommendedAddOn,
  RecommendedUpsell,
  PaymentPlan,
  PaymentPlanType,
  PricingEngineInput,
  PricingEngineOptions,
  PricingServiceId,
  PricingCatalogConfig,
} from "./pricing";

export {
  PricingError,
  PricingValidationError,
  PricingCatalogError,
  PricingCalculationError,
} from "./pricing";

export {
  createBrainRegistry,
  executeProjectPlan,
  generateProposalForRequest,
  runSalesDepartment,
  getBrainRegistry,
  getRuntimeEngine,
  getWorkflowEngine,
  processBrainRequest,
  processProjectRequest,
  processProjectRequestPayload,
  resetBrainService,
} from "./services";
export type { BrainServiceResult } from "./services";
export { planStore, executionStore, SharedMemory } from "./memory";
export { DEFAULT_WORKFLOW, validateWorkflowCoverage } from "./workflows";
export { getAllTools, getTool, TOOL_CATALOG } from "./tools";
export type { BrainTool } from "./tools";

export {
  KnowledgeRegistry,
  getKnowledgeRegistry,
  resetKnowledgeRegistry,
} from "./knowledge";
export type {
  IndustryProfile,
  ServiceDefinition,
  Playbook,
  ProposalTemplateBlock,
  ServicePricing,
  PricingPolicy,
  KnowledgePrompt,
} from "./knowledge";

export {
  StrategicReasoner,
  BusinessAnalysisEngine,
  OpportunityEngine,
  RecommendationEngine,
  SolutionDesigner,
} from "./reasoning";

export {
  PromptEngine,
  getPromptEngine,
  resetPromptEngine,
  renderPrompt,
  getPromptRegistry,
  resetPromptRegistry,
} from "./prompts";

export type {
  PromptTemplate,
  RenderedPrompt,
  PromptVariables,
} from "./prompts";
export type {
  StrategicReasoningResult,
  StrategicReasonerInput,
  StrategicReasonerOutput,
  BusinessAnalysisResult,
  OpportunityAnalysis,
  RecommendationResult,
  BusinessSolution,
  BusinessStrategy,
  PriorityRoadmapPhase,
  ExpectedBusinessImpact,
  Recommendation,
  OpportunityItem,
  SolutionComponent,
  ReasoningContext,
} from "./reasoning";

export {
  WebsiteDepartment,
  registerWebsiteDepartment,
  getWebsiteDepartment,
  WebsiteExecutionAgent,
  getWebsiteExecutionAgent,
  resetWebsiteExecutionAgent,
  planWebsiteBlueprint,
  InputBuilder,
  OutputAssembler,
  createPlaceholderPlannerOutputs,
  WEBSITE_DEPARTMENT_ID,
  WEBSITE_TASK_TYPE,
  WEBSITE_PLAN_SCHEMA_VERSION,
} from "./departments/website";

export type {
  WebsitePlan,
  WebsiteDepartmentRequest,
  WebsiteDepartmentResult,
  WebsiteDepartmentInputParams,
  WebsiteDepartmentOptions,
  WebsiteExecutionBlueprint,
  WebsiteExecutionAgentInput,
  WebsiteType,
  RecommendedStack,
  ExecutionSeoPlan as SeoPlan,
  ExecutionContentPlan as ContentPlan,
  DesignSystemPlan,
  PerformanceStrategy,
  DeploymentPlan,
  BuilderFeedback,
  BrandIdentity,
  UserJourney,
  ArchitectureDecision,
  SiteModel,
  ConfidenceLevel,
} from "./departments/website";

export {
  WebsiteExecutionError,
  WebsiteExecutionValidationError,
  WebsiteTaskNotFoundError,
} from "./departments/website";

export {
  BaseDepartment,
  DepartmentRegistry,
  TelemetryCollector,
  buildDepartmentContext,
  getDepartmentRegistry,
  getLifecycleSteps,
  resetDepartmentRegistry,
  runDepartmentLifecycle,
  validateRequest,
  mergeValidationReports,
  emptyValidationReport,
  resolveRequestId,
} from "./sdk";

export type {
  Department,
  DepartmentContext,
  DepartmentRunResult,
  DepartmentSummary,
  DepartmentTelemetry,
  DepartmentRegistration,
  DepartmentExecutionOptions,
  ValidationReport,
  ValidationIssue,
  ValidationRule,
  DepartmentError,
  ValidationError,
  PlannerError,
  ExecutionError,
  KnowledgeError,
} from "./sdk";

export {
  ProviderRegistry,
  getProviderRegistry,
  resetProviderRegistry,
  resolveGenerationOptions,
  resolveProviderTimeoutMs,
  resolveProviderMaxRetries,
  KNOWN_LLM_PROVIDERS,
  LLMError,
  LLMProviderNotFoundError,
  LLMModelNotSupportedError,
  LLMCapabilityNotSupportedError,
  OpenAIProvider,
  createOpenAIProvider,
  registerOpenAIProvider,
  OPENAI_DEFAULT_MODEL,
  OPENAI_MODELS,
  mapLLMRequestToOpenAI,
  mapOpenAIResponseToLLM,
  mapOpenAIError,
  LLMGateway,
  getLLMGateway,
  resetLLMGateway,
} from "./llm";

export type {
  LLMProvider,
  LLMProviderRegistration,
  LLMRequest,
  LLMResponse,
  LLMStreamChunk,
  LLMHealthCheckResult,
  LLMMessage,
  GenerationOptions,
  TokenUsage,
  ModelCapability,
  ModelDefinition,
  LLMProviderId,
  KnownLLMProviderId,
  ModelId,
  LLMConfig,
  ProviderConfig,
  LLMErrorCode,
  LLMErrorDetails,
  ProviderRegistryOptions,
  OpenAIProviderOptions,
  OpenAIClientLike,
  OpenAIModelId,
  GatewayConfig,
  GatewayLogEvent,
  LLMGatewayOptions,
  RoutingStrategy,
} from "./llm";

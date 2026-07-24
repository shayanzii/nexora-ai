export {
  WebsiteDepartment,
  registerWebsiteDepartment,
  getWebsiteDepartment,
  resetWebsiteDepartmentRegistration,
  isWebsiteDepartmentRegistered,
} from "./website-department";

export { InputBuilder } from "./input-builder";
export type { BuiltWebsiteExecutionInput } from "./input-builder";

export { OutputAssembler } from "./output-assembler";
export { createPlaceholderPlannerOutputs } from "./placeholders";
export { createWebsitePlannerOutputs } from "./planner-outputs";
export { BrandAnalyzer } from "./analyzers/BrandAnalyzer";
export { mapAnalyzerBrandToPlanBrand } from "./analyzers/brand-identity-mapper";
export { resolveBrandStrategy } from "./analyzers/brand-strategy";
export { UserJourneyPlanner } from "./planners/UserJourneyPlanner";
export { mapPlannerUserJourneyToPlan } from "./planners/user-journey-mapper";
export { resolveJourneyStrategy } from "./planners/journey-strategy";
export { InformationArchitecturePlanner } from "./planners/InformationArchitecturePlanner";
export { mapPlannerInformationArchitectureToPlan } from "./planners/information-architecture-mapper";
export { resolveArchitectureStrategy } from "./planners/architecture-strategy";
export { SEOPlanner } from "./planners/SEOPlanner";
export { mapPlannerSeoPlanToPlan } from "./planners/seo-plan-mapper";
export { resolveSeoStrategy } from "./planners/seo-strategy";
export { ContentPlanner } from "./planners/ContentPlanner";
export { mapPlannerContentPlanToPlan } from "./planners/content-plan-mapper";
export { resolveContentStrategy } from "./planners/content-strategy";
export { WebsiteGenerator } from "./generator/WebsiteGenerator";
export type { WebsiteGeneratorInput } from "./generator/WebsiteGenerator";

export {
  resolveDepartmentStatus,
  resolveSiteModel,
  isRegulatedIndustry,
  normalizeIndustryId,
} from "./utils";

export {
  WEBSITE_DEPARTMENT_ID,
  WEBSITE_TASK_TYPE,
  WEBSITE_DEPARTMENT_TAGS,
  WEBSITE_PLANNER_IDS,
  INPUT_COMPLETENESS_FIELDS,
} from "./types";

export type {
  WebsitePlannerId,
  WebsiteExecutionInput,
  WebsitePlannerOutputs,
  WebsiteAssemblyMeta,
  InputCompletenessField,
} from "./types";

export {
  WEBSITE_PLAN_SCHEMA_VERSION,
} from "./schema";

export type {
  WebsitePlan,
  WebsiteDepartmentRequest,
  WebsiteDepartmentResult,
  WebsiteDepartmentInputParams,
  WebsiteDepartmentOptions,
  BuilderFeedback,
  BuilderFeedbackIssue,
  BrandIdentity,
  UserJourney,
  ArchitectureDecision,
  SiteArchitecture,
  PagePlan,
  NavigationPlan,
  CTAStrategy,
  SEOPlan,
  LeadGenerationStrategy,
  TrustElement,
  WebsiteGoal,
  WebsitePlanRisk,
  RegenerationScope,
  PlanUpdateSuggestion,
  ConfidenceLevel,
  SiteModel,
  JourneyStageType,
  PageType,
  CTAAction,
  TrustElementType,
  BrandArchetype,
  BuilderIssueType,
  InputSource,
  WebsitePlanSchemaVersion,
  WebsiteBlueprint,
} from "./schema";

export type {
  BlueprintPage,
  BlueprintSiteMetadata,
} from "./types/WebsiteBlueprint";

// Register on module import — additive, does not modify Brain Runtime.
import { registerWebsiteDepartment } from "./website-department";
registerWebsiteDepartment();

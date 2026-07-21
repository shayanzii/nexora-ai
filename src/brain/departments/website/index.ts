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
} from "./schema";

// Register on module import — additive, does not modify Brain Runtime.
import { registerWebsiteDepartment } from "./website-department";
registerWebsiteDepartment();

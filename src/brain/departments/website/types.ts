import type { DepartmentContext } from "../../sdk";
import type {
  BrandIdentity,
  BuilderFeedback,
  CTAStrategy,
  LeadGenerationStrategy,
  NavigationPlan,
  PagePlan,
  SEOPlan,
  SiteArchitecture,
  UserJourney,
  WebsiteDepartmentOptions,
  WebsiteDepartmentRequest,
} from "./schema";

/** Canonical department identifier. */
export const WEBSITE_DEPARTMENT_ID = "website-department" as const;

/** Primary task type for website planning. */
export const WEBSITE_TASK_TYPE = "plan_website" as const;

/** Registry tags for discovery. */
export const WEBSITE_DEPARTMENT_TAGS = [
  "website",
  "planning",
  "department",
] as const;

/** Sprint 1 placeholder planner identifiers. */
export const WEBSITE_PLANNER_IDS = [
  "brand-planner",
  "journey-planner",
  "architecture-planner",
  "pages-planner",
  "conversion-planner",
  "seo-planner",
] as const;

export type WebsitePlannerId = (typeof WEBSITE_PLANNER_IDS)[number];

/** Request snapshot frozen for department execution. */
export type FrozenWebsiteDepartmentRequest = Readonly<
  Omit<WebsiteDepartmentRequest, "goals" | "services"> & {
    goals: readonly string[];
    services: readonly string[];
  }
>;

/** Normalized execution input produced by InputBuilder. */
export interface WebsiteExecutionInput {
  request: FrozenWebsiteDepartmentRequest;
  context: DepartmentContext;
  industryId: string;
  inputCompletenessScore: number;
  inputWarnings: readonly string[];
  options: Readonly<Required<WebsiteDepartmentOptions>>;
  feedback?: BuilderFeedback;
  priorPlanVersion: number;
  priorPlanId?: string;
}

/** Placeholder planner outputs — replaced by real planners in Sprint 2+. */
export interface WebsitePlannerOutputs {
  brandIdentity: BrandIdentity;
  userJourney: UserJourney;
  siteArchitecture: SiteArchitecture;
  navigation: NavigationPlan;
  pages: PagePlan[];
  ctaStrategy: CTAStrategy;
  leadGenerationStrategy: LeadGenerationStrategy;
  seoPlan: SEOPlan;
}

/** Metadata captured during output assembly. */
export interface WebsiteAssemblyMeta {
  stepsExecuted: string[];
  stepsSkipped: string[];
  regenerationApplied: boolean;
  feedbackIssuesResolved: string[];
  feedbackIssuesRemaining: string[];
}

/** Field weights used to compute input completeness. */
export interface InputCompletenessField {
  field: keyof WebsiteDepartmentRequest | "timeline";
  weight: number;
  label: string;
}

export const INPUT_COMPLETENESS_FIELDS: InputCompletenessField[] = [
  { field: "clientName", weight: 15, label: "Client name" },
  { field: "industry", weight: 15, label: "Industry" },
  { field: "country", weight: 10, label: "Country" },
  { field: "goals", weight: 15, label: "Goals" },
  { field: "targetAudience", weight: 15, label: "Target audience" },
  { field: "services", weight: 10, label: "Services" },
  { field: "budget", weight: 10, label: "Budget" },
  { field: "timeline", weight: 10, label: "Timeline" },
];

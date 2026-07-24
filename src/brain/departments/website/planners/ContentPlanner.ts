import type { DepartmentContext } from "../../../sdk";
import type { ProjectRequest } from "../../../types/project";
import { readClientDiscoveryMetadata } from "../utils";
import type { BrandIdentity } from "../types/BrandIdentity";
import type { InformationArchitecture } from "../types/InformationArchitecture";
import type { SEOPlan } from "../types/SEOPlan";
import type { UserJourney } from "../types/UserJourney";
import type { ContentPlan } from "../types/ContentPlan";
import { resolveContentStrategy } from "./content-strategy";
import { buildContentPlanFromStrategy } from "./content-utils";

/** Full planner input — upstream brand, journey, architecture, and SEO context. */
export interface ContentPlannerParams {
  request: ProjectRequest;
  brandIdentity: BrandIdentity;
  userJourney: UserJourney;
  informationArchitecture: InformationArchitecture;
  seoPlan: SEOPlan;
  context: DepartmentContext;
}

/** Result wrapper for content planning execution. */
export interface ContentPlannerResult {
  success: boolean;
  data?: ContentPlan;
  error?: string;
}

/**
 * Content Planner — deterministic rule-based page content engine.
 * Uses industry strategies enriched by brand, journey, architecture, and SEO context.
 */
export class ContentPlanner {
  readonly id = "content-planner";
  readonly version = "1.0.0";

  /** Runs deterministic content planning for the given context. */
  plan(params: ContentPlannerParams): ContentPlannerResult {
    try {
      const industryId = params.context.knowledge.resolveIndustryId(params.request.industry);
      const strategy = resolveContentStrategy(industryId);
      const metadata = readClientDiscoveryMetadata(params.request.metadata);
      const data = buildContentPlanFromStrategy(
        strategy,
        params.seoPlan,
        params.informationArchitecture,
        params.brandIdentity,
        params.userJourney,
        params.request.industry,
        metadata,
        params.request.goal,
      );

      return { success: true, data };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Content planning failed.";
      return { success: false, error: message };
    }
  }
}

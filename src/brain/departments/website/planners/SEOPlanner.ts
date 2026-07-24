import type { DepartmentContext } from "../../../sdk";
import type { ProjectRequest } from "../../../types/project";
import { readClientDiscoveryMetadata } from "../utils";
import type { BrandIdentity } from "../types/BrandIdentity";
import type { InformationArchitecture } from "../types/InformationArchitecture";
import type { SEOPlan } from "../types/SEOPlan";
import type { UserJourney } from "../types/UserJourney";
import { resolveSeoStrategy } from "./seo-strategy";
import {
  buildSeoPlanFromStrategy,
  buildSeoTemplateContext,
} from "./seo-utils";

/** Full planner input — upstream brand, journey, and architecture context. */
export interface SEOPlannerParams {
  request: ProjectRequest;
  brandIdentity: BrandIdentity;
  userJourney: UserJourney;
  informationArchitecture: InformationArchitecture;
  context: DepartmentContext;
}

/** Result wrapper for SEO planning execution. */
export interface SEOPlannerResult {
  success: boolean;
  data?: SEOPlan;
  error?: string;
}

/**
 * SEO Planner — deterministic rule-based search optimization engine.
 * Uses industry strategies enriched by brand, journey, and architecture context.
 */
export class SEOPlanner {
  readonly id = "seo-planner";
  readonly version = "1.0.0";

  /** Runs deterministic SEO planning for the given context. */
  plan(params: SEOPlannerParams): SEOPlannerResult {
    try {
      const industryId = params.context.knowledge.resolveIndustryId(params.request.industry);
      const strategy = resolveSeoStrategy(industryId);
      const metadata = readClientDiscoveryMetadata(params.request.metadata);
      const tokens = buildSeoTemplateContext(
        params.brandIdentity,
        params.request.industry,
        metadata,
        params.request.goal,
      );
      const data = buildSeoPlanFromStrategy(
        strategy,
        params.informationArchitecture,
        params.brandIdentity,
        params.userJourney,
        tokens,
      );

      return { success: true, data };
    } catch (error) {
      const message = error instanceof Error ? error.message : "SEO planning failed.";
      return { success: false, error: message };
    }
  }
}

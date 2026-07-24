import type { DepartmentContext } from "../../../sdk";
import type { ProjectRequest } from "../../../types/project";
import type { BrandIdentity } from "../types/BrandIdentity";
import type { UserJourney, UserJourneyStage } from "../types/UserJourney";
import {
  resolveJourneyStrategy,
  type JourneyStageRule,
  type JourneyStrategyRule,
} from "./journey-strategy";

/** Full planner input — upstream brand context for rule-based journey planning. */
export interface UserJourneyPlannerParams {
  request: ProjectRequest;
  brandIdentity: BrandIdentity;
  context: DepartmentContext;
}

/** Result wrapper for user journey planning execution. */
export interface UserJourneyPlannerResult {
  success: boolean;
  data?: UserJourney;
  error?: string;
}

/**
 * User Journey Planner — deterministic rule-based journey engine.
 * Uses industry strategies enriched by project and brand identity context.
 */
export class UserJourneyPlanner {
  readonly id = "user-journey-planner";
  readonly version = "1.0.0";

  /** Runs deterministic user journey planning for the given context. */
  plan(params: UserJourneyPlannerParams): UserJourneyPlannerResult {
    try {
      const industryId = params.context.knowledge.resolveIndustryId(params.request.industry);
      const strategy = resolveJourneyStrategy(industryId);
      const data = this.buildUserJourney(params, strategy);

      return { success: true, data };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "User journey planning failed.";
      return { success: false, error: message };
    }
  }

  private buildUserJourney(
    params: UserJourneyPlannerParams,
    strategy: JourneyStrategyRule,
  ): UserJourney {
    const [awarenessRule, considerationRule, conversionRule, retentionRule] =
      strategy.stages;

    return {
      awareness: this.buildStage(params, awarenessRule),
      consideration: this.buildStage(params, considerationRule),
      conversion: this.buildStage(params, conversionRule),
      retention: this.buildStage(params, retentionRule),
    };
  }

  private buildStage(
    params: UserJourneyPlannerParams,
    rule: JourneyStageRule,
  ): UserJourneyStage {
    const primaryGoal = params.request.goal.trim() || "achieve their goals";
    const audience = params.brandIdentity.targetAudience;

    return {
      stageName: rule.stageName,
      userGoal: `${rule.userGoal} so ${audience} can ${primaryGoal.toLowerCase()}.`,
      recommendedPages: [...rule.recommendedPages],
      recommendedCTA: rule.recommendedCTA,
      recommendedContent: [...rule.recommendedContent],
      trustSignals: [...rule.trustSignals],
      nextStage: rule.nextStage,
    };
  }
}

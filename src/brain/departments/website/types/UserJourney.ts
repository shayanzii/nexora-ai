/**
 * Planner output model for website user journey planning.
 * Distinct from the v1.1 WebsitePlan `UserJourney` schema in `../schema.ts`.
 */

export type UserJourneyStageName =
  | "awareness"
  | "consideration"
  | "conversion"
  | "retention";

/** Single stage in the four-stage planner journey model. */
export interface UserJourneyStage {
  stageName: UserJourneyStageName;
  userGoal: string;
  recommendedPages: string[];
  recommendedCTA: string;
  recommendedContent: string[];
  trustSignals: string[];
  nextStage: UserJourneyStageName | null;
}

/** Four-stage user journey produced by UserJourneyPlanner. */
export interface UserJourney {
  awareness: UserJourneyStage;
  consideration: UserJourneyStage;
  conversion: UserJourneyStage;
  retention: UserJourneyStage;
}

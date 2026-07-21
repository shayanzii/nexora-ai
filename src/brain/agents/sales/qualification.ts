/** Re-exports shared sales utilities for backward compatibility. */
export { SALES_REQUIRED_FIELDS } from "./shared/constants";
export {
  parseClientDiscoveryProfile,
  detectMissingFields,
  generateClarificationQuestions,
  calculateCompletenessScore,
  listPresentFields,
  isProfileComplete,
} from "./shared/profile";
export { buildProjectSummary, buildBusinessAnalysis, recommendServices } from "./shared/analysis";
export { estimatePriceRange, estimateTimeline, assessProjectRisks, buildPricingSummary } from "./shared/pricing";
export { shouldRequireFollowUp, buildFollowUpActions } from "./shared/follow-up";

import type { ClientDiscoveryProfile, SalesQualificationPackage } from "../../types/sales";
import type { ProjectRequest } from "../../types/project";
import { buildProjectSummary, buildBusinessAnalysis, recommendServices } from "./shared/analysis";
import { buildPricingSummary, isBudgetAligned } from "./shared/pricing";

/**
 * @deprecated Use SalesDepartment pipeline — retained for backward compatibility.
 */
export function buildQualificationPackage(
  profile: ClientDiscoveryProfile,
  request: ProjectRequest,
): SalesQualificationPackage {
  const pricing = buildPricingSummary(profile, request);

  return {
    projectSummary: buildProjectSummary(profile),
    businessAnalysis: buildBusinessAnalysis(profile),
    recommendedServices: recommendServices(profile),
    estimatedComplexity: pricing.estimatedComplexity,
    estimatedTimeline: pricing.estimatedTimeline,
    estimatedPriceRange: pricing.estimatedPriceRange,
    projectRisks: pricing.projectRisks,
    nextStep: isBudgetAligned(profile)
      ? "Proceed to requirements analysis and service architecture planning."
      : "Review scope and budget alignment with the client before proceeding.",
  };
}

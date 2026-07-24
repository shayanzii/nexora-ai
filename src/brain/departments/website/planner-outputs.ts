import { BrandAnalyzer } from "./analyzers/BrandAnalyzer";
import { mapAnalyzerBrandToPlanBrand } from "./analyzers/brand-identity-mapper";
import { ContentPlanner } from "./planners/ContentPlanner";
import { mapPlannerContentPlanToPlan } from "./planners/content-plan-mapper";
import { WebsiteGenerator } from "./generator/WebsiteGenerator";
import { InformationArchitecturePlanner } from "./planners/InformationArchitecturePlanner";
import { mapPlannerInformationArchitectureToPlan } from "./planners/information-architecture-mapper";
import { SEOPlanner } from "./planners/SEOPlanner";
import { mapPlannerSeoPlanToPlan } from "./planners/seo-plan-mapper";
import { UserJourneyPlanner } from "./planners/UserJourneyPlanner";
import { mapPlannerUserJourneyToPlan } from "./planners/user-journey-mapper";
import { createPlaceholderPlannerOutputs } from "./placeholders";
import type { WebsiteExecutionInput, WebsitePlannerOutputs } from "./types";

/**
 * Builds website planner outputs.
 * Brand, journey, architecture, SEO, content, and blueprint use rule-based planners.
 */
export function createWebsitePlannerOutputs(
  input: WebsiteExecutionInput,
): WebsitePlannerOutputs {
  const placeholders = createPlaceholderPlannerOutputs(input);
  const brandAnalyzer = new BrandAnalyzer();
  const journeyPlanner = new UserJourneyPlanner();
  const architecturePlanner = new InformationArchitecturePlanner();
  const seoPlanner = new SEOPlanner();
  const contentPlanner = new ContentPlanner();

  const brandResult = brandAnalyzer.analyze({
    request: input.context.request,
    strategicAnalysis: input.request.strategicAnalysis,
    salesProposal: input.request.proposal,
    context: input.context,
  });

  if (!brandResult.success || !brandResult.data) {
    return placeholders;
  }

  const brandIdentity = brandResult.data;
  const journeyResult = journeyPlanner.plan({
    request: input.context.request,
    brandIdentity,
    context: input.context,
  });

  const plannerJourney = journeyResult.success ? journeyResult.data : undefined;
  const architectureResult =
    plannerJourney &&
    architecturePlanner.plan({
      request: input.context.request,
      brandIdentity,
      userJourney: plannerJourney,
      context: input.context,
    });

  const plannerArchitecture =
    architectureResult?.success ? architectureResult.data : undefined;

  const mappedArchitecture =
    plannerArchitecture && plannerJourney
      ? mapPlannerInformationArchitectureToPlan(
          plannerArchitecture,
          input,
          brandIdentity,
          plannerJourney,
        )
      : undefined;

  const seoResult =
    plannerArchitecture &&
    plannerJourney &&
    seoPlanner.plan({
      request: input.context.request,
      brandIdentity,
      userJourney: plannerJourney,
      informationArchitecture: plannerArchitecture,
      context: input.context,
    });

  const plannerSeo = seoResult?.success ? seoResult.data : undefined;

  const mappedSeo =
    plannerSeo && mappedArchitecture
      ? mapPlannerSeoPlanToPlan(
          plannerSeo,
          input,
          brandIdentity,
          mappedArchitecture.pages,
        )
      : undefined;

  const pagesAfterSeo = mappedSeo?.pages ?? mappedArchitecture?.pages;

  const contentResult =
    plannerSeo &&
    plannerArchitecture &&
    plannerJourney &&
    contentPlanner.plan({
      request: input.context.request,
      brandIdentity,
      userJourney: plannerJourney,
      informationArchitecture: plannerArchitecture,
      seoPlan: plannerSeo,
      context: input.context,
    });

  const mappedContent =
    contentResult?.success &&
    contentResult.data &&
    pagesAfterSeo &&
    plannerArchitecture
      ? mapPlannerContentPlanToPlan(
          contentResult.data,
          input,
          plannerArchitecture,
          pagesAfterSeo,
        )
      : undefined;

  const websiteBlueprint =
    plannerSeo &&
    plannerArchitecture &&
    plannerJourney &&
    contentResult?.success &&
    contentResult.data
      ? new WebsiteGenerator().generate({
          input,
          brandIdentity,
          userJourney: plannerJourney,
          informationArchitecture: plannerArchitecture,
          seoPlan: plannerSeo,
          contentPlan: contentResult.data,
        })
      : undefined;

  return {
    ...placeholders,
    brandIdentity: mapAnalyzerBrandToPlanBrand(brandIdentity, input),
    userJourney:
      plannerJourney && journeyResult.success
        ? mapPlannerUserJourneyToPlan(plannerJourney, input, brandIdentity)
        : placeholders.userJourney,
    ...(mappedArchitecture
      ? {
          siteArchitecture: mappedArchitecture.siteArchitecture,
          navigation: mappedArchitecture.navigation,
          ctaStrategy: mappedArchitecture.ctaStrategy,
        }
      : {}),
    ...(mappedSeo ? { seoPlan: mappedSeo.seoPlan } : {}),
    ...(mappedContent
      ? {
          pages: mappedContent.pages,
          leadGenerationStrategy: mappedContent.leadGenerationStrategy,
        }
      : pagesAfterSeo
        ? { pages: pagesAfterSeo }
        : {}),
    ...(websiteBlueprint ? { websiteBlueprint } : {}),
  };
}

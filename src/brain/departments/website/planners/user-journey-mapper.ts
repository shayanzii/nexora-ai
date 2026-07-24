import type {
  CTAAction,
  JourneyCTA,
  JourneyPageRef,
  JourneyStage,
  JourneyStageType,
  JourneyTrustRequirement,
  TrustElementType,
  UserJourney as PlanUserJourney,
} from "../schema";
import type { WebsiteExecutionInput } from "../types";
import type { BrandIdentity as AnalyzerBrandIdentity } from "../types/BrandIdentity";
import type {
  UserJourney as PlannerUserJourney,
  UserJourneyStage,
  UserJourneyStageName,
} from "../types/UserJourney";

const PAGE_ID_BY_NAME: Readonly<Record<string, string>> = {
  Home: "page-home",
  About: "page-about",
  Services: "page-services",
  Contact: "page-contact",
  FAQ: "page-faq",
  Testimonials: "page-testimonials",
  "Quote Request": "page-quote",
  Support: "page-support",
};

function pageNameToId(pageName: string): string {
  return PAGE_ID_BY_NAME[pageName] ?? `page-${pageName.toLowerCase().replace(/\s+/g, "-")}`;
}

function mapCtaAction(label: string, stage: JourneyStageType): CTAAction {
  const normalized = label.toLowerCase();

  if (
    normalized.includes("book") ||
    normalized.includes("reserve") ||
    normalized.includes("appointment")
  ) {
    return "book-appointment";
  }

  if (normalized.includes("call") || normalized.includes("phone")) {
    return "call-now";
  }

  if (
    normalized.includes("consultation") ||
    normalized.includes("contact") ||
    normalized.includes("quote")
  ) {
    return normalized.includes("quote") ? "request-quote" : "contact-form";
  }

  if (normalized.includes("direction") || normalized.includes("location")) {
    return "get-directions";
  }

  if (
    normalized.includes("menu") ||
    normalized.includes("service") ||
    normalized.includes("learn") ||
    normalized.includes("explore") ||
    normalized.includes("view")
  ) {
    return "view-services";
  }

  return stage === "conversion" ? "contact-form" : "view-services";
}

function mapTrustElementType(signal: string): TrustElementType {
  const normalized = signal.toLowerCase();

  if (normalized.includes("review") || normalized.includes("testimonial")) {
    return "reviews";
  }

  if (
    normalized.includes("credential") ||
    normalized.includes("certification") ||
    normalized.includes("insurance") ||
    normalized.includes("bar")
  ) {
    return "certifications";
  }

  if (normalized.includes("before") || normalized.includes("after")) {
    return "before-after";
  }

  if (normalized.includes("team") || normalized.includes("doctor") || normalized.includes("attorney")) {
    return "team-photos";
  }

  if (normalized.includes("guarantee") || normalized.includes("policy")) {
    return "guarantees";
  }

  return "reviews";
}

function mapPageRefs(pages: readonly string[], stage: JourneyStageType): JourneyPageRef[] {
  return pages.map((pageName, index) => ({
    pageId: pageNameToId(pageName),
    role: index === 0 ? "primary entry" : "support",
    priority: index === 0 ? "primary" : "secondary",
    rationale: `Supports ${stage} with ${pageName} content.`,
  }));
}

function mapPrimaryCta(
  stage: UserJourneyStage,
  schemaStage: JourneyStageType,
): JourneyCTA {
  const pageId = pageNameToId(stage.recommendedPages[0] ?? "Contact");

  return {
    label: stage.recommendedCTA,
    action: mapCtaAction(stage.recommendedCTA, schemaStage),
    pageId,
    placement: schemaStage === "conversion" ? "hero" : "inline",
    rationale: `Primary CTA for ${schemaStage} stage: ${stage.recommendedCTA}.`,
  };
}

function mapTrustRequirements(
  stage: UserJourneyStage,
  schemaStage: JourneyStageType,
): JourneyTrustRequirement[] {
  return stage.trustSignals.map((signal) => ({
    trustElementType: mapTrustElementType(signal),
    description: signal,
    required: schemaStage === "decision" || schemaStage === "conversion",
    pageIds: stage.recommendedPages.map(pageNameToId),
  }));
}

function mapPlannerStage(
  stage: UserJourneyStage,
  schemaStage: JourneyStageType,
  businessObjective: string,
): JourneyStage {
  return {
    stage: schemaStage,
    label: stage.stageName.charAt(0).toUpperCase() + stage.stageName.slice(1),
    visitorIntent: stage.userGoal,
    businessObjective,
    recommendedPages: mapPageRefs(stage.recommendedPages, schemaStage),
    primaryCTA: mapPrimaryCta(stage, schemaStage),
    secondaryCTAs: [],
    trustRequirements: mapTrustRequirements(stage, schemaStage),
    objections: [
      {
        objection: `Hesitation during ${schemaStage}`,
        responseStrategy: `Surface ${stage.trustSignals.join(", ")} to build confidence`,
        addressedOnPages: stage.recommendedPages.map(pageNameToId),
        priority: schemaStage === "decision" ? "high" : "medium",
      },
    ],
    successMetric: {
      metric: `${schemaStage} stage completion`,
      kpiId: `kpi-${schemaStage}`,
      measurementMethod: "Analytics funnel tracking",
      targetDirection: "increase",
    },
    contentEmphasis: [...stage.recommendedContent],
  };
}

function buildDecisionStage(
  journey: PlannerUserJourney,
  brand: AnalyzerBrandIdentity,
): JourneyStage {
  const consideration = journey.consideration;
  const conversion = journey.conversion;
  const decisionPages = [
    consideration.recommendedPages[consideration.recommendedPages.length - 1] ??
      "Testimonials",
    conversion.recommendedPages[0] ?? "Contact",
  ];

  const decisionStage: UserJourneyStage = {
    stageName: "consideration",
    userGoal: `Confirm trust and readiness to ${brand.ctaStrategy.toLowerCase()}.`,
    recommendedPages: decisionPages,
    recommendedCTA: brand.ctaStrategy,
    recommendedContent: [
      ...consideration.recommendedContent.slice(-2),
      conversion.recommendedContent[0] ?? "Conversion path overview",
    ],
    trustSignals: [
      ...consideration.trustSignals,
      ...conversion.trustSignals.slice(0, 1),
    ],
    nextStage: "conversion",
  };

  return mapPlannerStage(
    decisionStage,
    "decision",
    `Move ${brand.targetAudience} from evaluation to committed action.`,
  );
}

function buildPrimaryConversionPath(journey: PlannerUserJourney): string[] {
  const pageNames = [
    journey.awareness.recommendedPages[0],
    journey.consideration.recommendedPages[0],
    journey.conversion.recommendedPages[0],
    journey.retention.recommendedPages[0],
  ].filter((pageName): pageName is string => Boolean(pageName));

  return pageNames.map(pageNameToId);
}

function buildSummary(
  journey: PlannerUserJourney,
  brand: AnalyzerBrandIdentity,
  industry: string,
): string {
  const path = [
    journey.awareness.recommendedCTA,
    journey.consideration.recommendedCTA,
    journey.conversion.recommendedCTA,
    journey.retention.recommendedCTA,
  ].join(" → ");

  return `Rule-based ${industry} journey for ${brand.targetAudience}: ${path}.`;
}

/**
 * Maps planner UserJourney output to the v1.1 WebsitePlan UserJourney schema.
 */
export function mapPlannerUserJourneyToPlan(
  journey: PlannerUserJourney,
  input: WebsiteExecutionInput,
  brand: AnalyzerBrandIdentity,
): PlanUserJourney {
  const primaryGoal =
    input.context.request.goal.trim() || input.request.goals[0] || "business growth";

  return {
    id: `journey-${input.request.requestId}`,
    requestId: input.request.requestId,
    stages: [
      mapPlannerStage(
        journey.awareness,
        "awareness",
        `Introduce the brand and support ${primaryGoal}.`,
      ),
      mapPlannerStage(
        journey.consideration,
        "consideration",
        `Help visitors evaluate fit and value for ${primaryGoal}.`,
      ),
      buildDecisionStage(journey, brand),
      mapPlannerStage(
        journey.conversion,
        "conversion",
        `Convert intent into measurable outcomes for ${primaryGoal}.`,
      ),
      mapPlannerStage(
        journey.retention,
        "retention",
        `Encourage repeat engagement aligned with ${brand.ctaStrategy}.`,
      ),
    ],
    primaryConversionPath: buildPrimaryConversionPath(journey),
    dropOffRisks: [
      {
        stage: "consideration",
        risk: "Insufficient proof during evaluation",
        mitigation: `Emphasize ${journey.consideration.trustSignals.join(", ")}`,
        affectedPages: journey.consideration.recommendedPages.map(pageNameToId),
        severity: "medium",
      },
      {
        stage: "decision",
        risk: "Trust gap before conversion",
        mitigation: `Reinforce ${brand.ctaStrategy} with ${journey.conversion.trustSignals[0] ?? "clear contact options"}`,
        affectedPages: journey.conversion.recommendedPages.map(pageNameToId),
        severity: "high",
      },
    ],
    summary: buildSummary(journey, brand, input.request.industry),
  };
}

/** Maps a planner stage name to the schema stage type (excluding decision). */
export function plannerStageToSchemaStage(
  stageName: UserJourneyStageName,
): JourneyStageType {
  return stageName;
}

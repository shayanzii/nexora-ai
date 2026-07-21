import { mapValidationConfidence } from "../../sdk";
import type { WebsiteExecutionInput, WebsiteAssemblyMeta, WebsitePlannerOutputs } from "./types";
import {
  WEBSITE_PLANNER_IDS,
  WEBSITE_DEPARTMENT_ID,
} from "./types";
import { resolveDepartmentStatus } from "./utils";
import {
  WEBSITE_PLAN_SCHEMA_VERSION,
  type ContentPriority,
  type TrustElement,
  type WebsiteDepartmentResult,
  type WebsitePlan,
  type WebsitePlanRisk,
} from "./schema";

/**
 * Assembles the final WebsitePlan and WebsiteDepartmentResult.
 */
export class OutputAssembler {
  static assemble(
    input: WebsiteExecutionInput,
    plannerOutputs: WebsitePlannerOutputs,
  ): WebsiteDepartmentResult {
    const generatedAt = input.context.createdAt;
    const planId = `website-plan-${input.request.requestId}-v${input.priorPlanVersion}`;
    const primaryGoal = input.request.goals[0] ?? "Generate qualified leads";
    const confidenceLevel = mapValidationConfidence(input.inputCompletenessScore);

    const websiteGoals = input.request.goals.map((goal, index) => ({
      id: `goal-${index + 1}`,
      objective: goal,
      priority: index === 0 ? ("primary" as const) : ("secondary" as const),
      rationale: "Derived from client request.",
      source: "client-request" as const,
      measurableOutcome: `Improve ${goal.toLowerCase()}`,
      linkedKpi: `kpi-goal-${index + 1}`,
    }));

    const trustElements: TrustElement[] = [
      {
        id: "trust-reviews",
        type: "reviews",
        label: "Customer Reviews",
        description: "Display verified customer testimonials.",
        placement: ["page-home"],
        priority: "required",
        industrySpecific: false,
      },
    ];

    const contentPriorities: ContentPriority[] = [
      {
        id: "content-priority-home",
        topic: "Value proposition and trust",
        pageIds: ["page-home"],
        priority: "critical",
        rationale: "Homepage drives first impression and conversion.",
        source: "inferred",
      },
    ];

    const risks: WebsitePlanRisk[] = input.inputWarnings
      .filter((warning) => warning.includes("missing") || warning.includes("not provided"))
      .slice(0, 3)
      .map((warning, index) => ({
        id: `risk-${index + 1}`,
        severity: "medium" as const,
        description: warning,
        mitigation: "Collect missing inputs before build phase.",
        source: "missing-input" as const,
      }));

    const feedbackMeta = OutputAssembler.resolveFeedbackMeta(input);

    const websitePlan: WebsitePlan = {
      id: planId,
      requestId: input.request.requestId,
      clientName: input.request.clientName,
      industry: input.request.industry,
      industryId: input.industryId,
      country: input.request.country,
      generatedAt,
      schemaVersion: WEBSITE_PLAN_SCHEMA_VERSION,
      version: input.priorPlanVersion,
      priorPlanId: input.priorPlanId,
      regeneratedFromFeedbackId: input.feedback?.id,
      websiteGoals,
      targetAudience: {
        primary: input.request.targetAudience,
        segments: [
          {
            id: "segment-primary",
            label: "Primary audience",
            description: input.request.targetAudience,
            priority: "primary",
          },
        ],
        painPoints: ["Needs a trustworthy local provider"],
        decisionFactors: ["Reputation", "Responsiveness", "Pricing clarity"],
        preferredChannels: ["search", "referrals"],
      },
      valueProposition: {
        headline: `${input.request.clientName} — ${primaryGoal}`,
        supportingPoints: [...input.request.goals],
        differentiators: [`Specialized ${input.request.industry} expertise`],
        proofPoints: ["Placeholder proof points pending Content Planner."],
      },
      brandPositioning: {
        positioningStatement: `${input.request.clientName} serves ${input.request.targetAudience} in ${input.request.country}.`,
        toneGuidance: input.request.regulated ? "authoritative" : "professional",
        trustSignals: ["Reviews", "Certifications", "Local presence"],
        competitiveAngle: "Local expertise with clear conversion paths.",
        regulatedIndustryNotes: input.request.regulated
          ? ["Apply compliance-friendly language and disclaimers."]
          : undefined,
      },
      brandIdentity: plannerOutputs.brandIdentity,
      userJourney: plannerOutputs.userJourney,
      siteArchitecture: plannerOutputs.siteArchitecture,
      navigation: plannerOutputs.navigation,
      pages: plannerOutputs.pages,
      ctaStrategy: plannerOutputs.ctaStrategy,
      leadGenerationStrategy: plannerOutputs.leadGenerationStrategy,
      trustElements,
      seoPlan: plannerOutputs.seoPlan,
      contentPriorities,
      recommendedIntegrations: [
        {
          id: "integration-contact-form",
          serviceId: "contact-form",
          name: "Contact Form",
          purpose: "Capture inbound leads",
          placement: ["page-contact"],
          dependencies: [],
          priority: "required",
          phase: 1,
        },
      ],
      analyticsRequirements: [
        {
          id: "analytics-form-submit",
          event: "form_submit",
          trigger: "Contact form submission",
          pages: ["page-contact"],
          kpiMapping: "kpi-conversion",
          tooling: "ga4",
        },
      ],
      assumptions: [
        "Sprint 1 plan uses placeholder planner outputs.",
        "Final content and design decisions occur in downstream build phase.",
      ],
      risks,
      successMetrics: [
        "Increase qualified lead submissions",
        "Improve local search visibility",
      ],
      inputCompletenessScore: input.inputCompletenessScore,
      confidenceLevel,
      summary: `Website plan v${input.priorPlanVersion} for ${input.request.clientName} (${input.request.industry}).`,
      nextSteps: [
        "Review placeholder plan with stakeholders.",
        "Implement Sprint 2 planners for brand, journey, and architecture depth.",
      ],
    };

    const status = resolveDepartmentStatus(
      input.inputCompletenessScore,
      input.inputWarnings.length,
    );

    return {
      departmentId: WEBSITE_DEPARTMENT_ID,
      requestId: input.request.requestId,
      status,
      generatedAt,
      websitePlan,
      stepsExecuted: ["input-builder", ...WEBSITE_PLANNER_IDS, "output-assembler"],
      stepsSkipped: [],
      inputCompletenessScore: input.inputCompletenessScore,
      inputWarnings: [...input.inputWarnings],
      summary: websitePlan.summary,
      nextStep: websitePlan.nextSteps[0] ?? "Review website plan.",
      regenerationApplied: feedbackMeta.regenerationApplied,
      feedbackIssuesResolved: feedbackMeta.feedbackIssuesResolved,
      feedbackIssuesRemaining: feedbackMeta.feedbackIssuesRemaining,
    };
  }

  private static resolveFeedbackMeta(
    input: WebsiteExecutionInput,
  ): Pick<
    WebsiteAssemblyMeta,
    "regenerationApplied" | "feedbackIssuesResolved" | "feedbackIssuesRemaining"
  > {
    if (!input.feedback) {
      return {
        regenerationApplied: false,
        feedbackIssuesResolved: [],
        feedbackIssuesRemaining: [],
      };
    }

    return {
      regenerationApplied: true,
      feedbackIssuesResolved: [],
      feedbackIssuesRemaining: input.feedback.issues.map((issue) => issue.id),
    };
  }
}

export { OutputAssembler as default };

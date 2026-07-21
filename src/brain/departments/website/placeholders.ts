import type { WebsiteExecutionInput, WebsitePlannerOutputs } from "./types";
import { resolveSiteModel } from "./utils";
import type { BrandIdentity, JourneyStageType } from "./schema";

const JOURNEY_STAGES: JourneyStageType[] = [
  "awareness",
  "consideration",
  "decision",
  "conversion",
  "retention",
];

const PLACEHOLDER_RATIONALE = "Placeholder output pending Sprint 2 planner.";

/**
 * Sprint 1 placeholder planner outputs.
 * Real planner modules replace this function in Sprint 2+.
 */
export function createPlaceholderPlannerOutputs(
  input: WebsiteExecutionInput,
): WebsitePlannerOutputs {
  const { request, options } = input;
  const siteModel = resolveSiteModel(options);
  const primaryGoal = request.goals[0] ?? "Generate qualified leads";
  const homePageId = "page-home";
  const decidedAt = input.context.createdAt;

  const brandIdentity = buildPlaceholderBrandIdentity(
    request.regulated,
    request.industry,
  );
  const pages = buildPlaceholderPages(request, primaryGoal, options.prioritizeLocalSeo);

  const userJourney = {
    id: `journey-${request.requestId}`,
    requestId: request.requestId,
    stages: JOURNEY_STAGES.map((stage, index) => {
      const page = pages[Math.min(index, pages.length - 1)]!;
      return {
        stage,
        label: stage.charAt(0).toUpperCase() + stage.slice(1),
        visitorIntent: `Placeholder intent for ${stage} stage`,
        businessObjective: `Support ${primaryGoal} during ${stage}`,
        recommendedPages: [
          {
            pageId: page.id,
            role: stage === "conversion" ? "conversion hub" : "support",
            priority: index <= 2 ? ("primary" as const) : ("secondary" as const),
            rationale: PLACEHOLDER_RATIONALE,
          },
        ],
        primaryCTA: {
          label: stage === "conversion" ? "Contact Us" : "Learn More",
          action:
            stage === "conversion"
              ? ("contact-form" as const)
              : ("view-services" as const),
          pageId: page.id,
          placement: "inline",
          rationale: PLACEHOLDER_RATIONALE,
        },
        secondaryCTAs: [],
        trustRequirements: [
          {
            trustElementType: "reviews" as const,
            description: "Social proof to reduce hesitation",
            required: stage === "decision" || stage === "conversion",
            pageIds: [homePageId],
          },
        ],
        objections: [
          {
            objection: "Is this provider trustworthy?",
            responseStrategy: "Surface reviews and credentials",
            addressedOnPages: [homePageId],
            priority: "high" as const,
          },
        ],
        successMetric: {
          metric: `${stage} engagement`,
          kpiId: `kpi-${stage}`,
          measurementMethod: "Analytics event tracking",
          targetDirection: "increase" as const,
        },
        contentEmphasis: [primaryGoal],
      };
    }),
    primaryConversionPath: pages.map((page) => page.id),
    dropOffRisks: [
      {
        stage: "consideration" as const,
        risk: "Insufficient service detail",
        mitigation: "Expand services page with outcomes and proof",
        affectedPages: ["page-services"],
        severity: "medium" as const,
      },
    ],
    summary: "Placeholder user journey — pending Journey Planner (Sprint 2).",
  };

  const architectureDecision = {
    decision: siteModel,
    score: siteModel === "single-page" ? 72 : 78,
    alternatives: [
      {
        model: "single-page" as const,
        score: 72,
        summary: "Compact footprint for limited scope",
        blockers: request.services.length > 2 ? ["Multiple service lines"] : [],
      },
      {
        model: "multi-page" as const,
        score: 78,
        summary: "Better SEO and journey depth",
        blockers: [],
      },
      {
        model: "hybrid" as const,
        score: 70,
        summary: "Landing + supporting pages",
        blockers: ["Higher content maintenance"],
      },
    ],
    reasoning: [
      {
        step: 1,
        factor: "Service breadth",
        impact: "medium",
        favoredModel: siteModel,
        detail: "Evaluated number of services and content depth requirements.",
      },
    ],
    confidence: "medium" as const,
    scoringDimensions: [
      {
        id: "seo-depth",
        label: "SEO depth",
        weight: 0.35,
        scoreSinglePage: 55,
        scoreMultiPage: 85,
        scoreHybrid: 70,
        evaluatedValue: `${request.services.length} services`,
        rationale: "More services favor multi-page architecture.",
      },
      {
        id: "conversion-focus",
        label: "Conversion focus",
        weight: 0.35,
        scoreSinglePage: 80,
        scoreMultiPage: 70,
        scoreHybrid: 75,
        evaluatedValue: primaryGoal,
        rationale: "Single-page can reduce friction for simple offers.",
      },
      {
        id: "content-maintenance",
        label: "Content maintenance",
        weight: 0.3,
        scoreSinglePage: 85,
        scoreMultiPage: 60,
        scoreHybrid: 65,
        evaluatedValue: request.timeline ?? "unspecified",
        rationale: "Timeline and team capacity affect maintenance burden.",
      },
    ],
    decidedAt,
  };

  return {
    brandIdentity,
    userJourney,
    siteArchitecture: {
      model: siteModel,
      rationale: "Placeholder architecture — pending Architecture Planner (Sprint 2).",
      maxDepth: siteModel === "single-page" ? 1 : 2,
      homepageRole: "Primary entry and conversion anchor",
      conversionPath: [
        { step: 1, stage: "awareness", pageId: homePageId, action: "Land on homepage" },
        { step: 2, stage: "consideration", pageId: "page-services", action: "Review services" },
        { step: 3, stage: "conversion", pageId: "page-contact", action: "Submit contact form" },
      ],
      architectureDecision,
    },
    navigation: {
      primary: pages.map((page, index) => ({
        id: `nav-${page.id}`,
        label: page.name,
        pageId: page.id,
        priority: index + 1,
        cta: page.type === "contact",
      })),
      secondary: [],
      footer: [
        { id: "nav-footer-contact", label: "Contact", pageId: "page-contact", priority: 1 },
        { id: "nav-footer-legal", label: "Privacy", pageId: "page-contact", priority: 2 },
      ],
      mobileStrategy: "Hamburger menu with sticky primary CTA",
      stickyElements: ["primary-cta"],
    },
    pages,
    ctaStrategy: {
      primaryCTA: pages[0]!.ctas[0]!,
      secondaryCTAs: pages[1]?.ctas ?? [],
      placementRules: [
        {
          pageType: "home",
          minCtaCount: 2,
          requiredActions: ["contact-form", "view-services"],
          rationale: "Homepage must offer exploration and conversion paths.",
        },
      ],
      afterHoursStrategy: "Promote callback form and chatbot when available.",
      mobileStrategy: "Sticky bottom CTA on key pages.",
    },
    leadGenerationStrategy: {
      capturePoints: [
        {
          id: "capture-contact",
          location: "Contact page form",
          pageId: "page-contact",
          formType: "contact",
          fields: ["name", "email", "phone", "message"],
          priority: "primary",
        },
      ],
      qualificationFlow: "Route leads to CRM or email notification workflow.",
      routingTarget: "crm",
      followUpSequence: ["Immediate auto-reply", "Sales follow-up within 24 hours"],
      estimatedConversionPoints: 2,
    },
    seoPlan: {
      primaryKeywords: [request.industry, `${request.industry} ${request.country}`],
      localSeoStrategy: {
        googleBusinessProfile: options.prioritizeLocalSeo,
        napConsistency: true,
        serviceAreaPages: options.prioritizeLocalSeo,
        locationKeywords: [request.country],
        reviewStrategy: "Encourage post-service review requests.",
      },
      technicalRequirements: ["Mobile responsive", "Core Web Vitals baseline", "Sitemap"],
      contentSeoPriorities: ["Service pages", "Homepage", "FAQ if applicable"],
      schemaMarkup: [
        {
          type: "LocalBusiness",
          pages: [homePageId],
          rationale: "Supports local search visibility.",
        },
      ],
      pageIndexStrategy:
        siteModel === "single-page"
          ? "Single URL with section anchors"
          : "Index all primary pages",
    },
  };
}

function buildPlaceholderBrandIdentity(
  regulated: boolean,
  industry: string,
): BrandIdentity {
  return {
    personality: {
      traits: ["trustworthy", "professional", "approachable"],
      archetype: regulated ? "expert" : "helper",
      emotionalTone: "Confident and reassuring",
      avoidTraits: ["aggressive", "casual"],
      rationale: "Placeholder brand personality pending Brand Planner (Sprint 2).",
      source: "inferred",
    },
    communicationStyle: {
      voiceDescriptor: "Clear, professional, client-focused",
      readingLevel: regulated ? "professional" : "moderate",
      sentenceStyle: "conversational",
      terminologyGuidance: "Use industry terms sparingly with plain-language explanations.",
      callToActionTone: "Direct and action-oriented",
      regulatedLanguageNotes: regulated
        ? ["Avoid outcome guarantees.", "Include required disclaimers where applicable."]
        : [],
      examples: [
        {
          topic: "Primary CTA",
          do: "Book your free consultation today.",
          dont: "Guaranteed results in 24 hours.",
        },
      ],
    },
    visualDirection: {
      moodKeywords: ["clean", "modern", "trustworthy"],
      layoutPreference: "balanced",
      visualWeight: "balanced",
      mobileFirst: true,
      localBusinessSignals: ["service area", "local contact", "reviews"],
      rationale: "Placeholder visual direction pending Brand Planner (Sprint 2).",
    },
    colorStrategy: {
      primaryRole: {
        purpose: "Brand recognition",
        semanticIntent: "Primary actions and headers",
        usageContexts: ["header", "primary buttons"],
        avoidContexts: ["body text"],
      },
      secondaryRole: {
        purpose: "Support hierarchy",
        semanticIntent: "Secondary accents",
        usageContexts: ["section backgrounds", "icons"],
        avoidContexts: ["primary CTAs"],
      },
      accentRole: {
        purpose: "Highlight conversion points",
        semanticIntent: "CTA emphasis",
        usageContexts: ["buttons", "links"],
        avoidContexts: ["large backgrounds"],
      },
      neutralRole: {
        purpose: "Readable content areas",
        semanticIntent: "Body and surfaces",
        usageContexts: ["backgrounds", "cards"],
        avoidContexts: ["CTA buttons"],
      },
      trustRole: {
        purpose: "Trust and credibility",
        semanticIntent: "Testimonials and badges",
        usageContexts: ["trust sections"],
        avoidContexts: ["hero overlays"],
      },
      contrastRequirement: regulated ? "enhanced" : "standard",
      guidance: "Semantic roles only — no hex values in Sprint 1.",
    },
    typographyGuidance: {
      hierarchyIntent: [
        {
          level: "h1",
          purpose: "Primary page headline",
          emphasis: "high",
          usageGuidance: "One per page, benefit-led.",
        },
        {
          level: "body",
          purpose: "Readable content",
          emphasis: "medium",
          usageGuidance: "Short paragraphs, scannable lists.",
        },
      ],
      readabilityPriority: "high",
      headingStyle: regulated ? "authoritative" : "friendly",
      bodyStyle: "clean-readable",
      mobileReadabilityNotes: "Minimum 16px body on mobile.",
      regulatedContentNotes: regulated
        ? ["Disclaimers in smaller but legible type."]
        : [],
    },
    imageryDirection: {
      photographyStyle: "Authentic local business photography",
      subjectPriorities: ["team", "service delivery", "customer outcomes"],
      avoidImagery: ["generic stock", "misleading before/after"],
      heroImageryGuidance: "Show real service context relevant to the industry.",
      trustImageryGuidance: "Include team and certification imagery where applicable.",
      industrySpecificNotes: [`Tailor imagery to ${industry}.`],
      altTextPolicy: "Descriptive alt text required for all non-decorative images.",
    },
    iconographyGuidance: {
      style: "line",
      usageContexts: ["feature lists", "contact methods"],
      avoidContexts: ["large hero areas"],
      accessibilityNote: "Pair icons with text labels.",
    },
    accessibilityConsiderations: {
      wcagTarget: "AA",
      priorityRequirements: ["Keyboard navigation", "Visible focus states", "Form labels"],
      regulatedIndustryRequirements: regulated
        ? ["Enhanced form error messaging", "Privacy link in footer"]
        : [],
      formAccessibility: "Labels, errors, and success states must be announced.",
      mobileAccessibility: "Touch targets minimum 44px.",
      rationale: "Baseline accessibility requirements for all website plans.",
    },
    summary: "Placeholder brand identity — pending Brand Planner (Sprint 2).",
  };
}

function buildPlaceholderPages(
  request: WebsiteExecutionInput["request"],
  primaryGoal: string,
  prioritizeLocalSeo: boolean,
) {
  return [
    {
      id: "page-home",
      slug: "/",
      name: "Home",
      type: "home" as const,
      priority: "required" as const,
      purpose: "Introduce the business and drive primary conversion.",
      targetAudience: request.targetAudience,
      primaryGoal,
      sections: [
        {
          id: "section-hero",
          name: "Hero",
          purpose: "Communicate value proposition",
          priority: 1,
          contentType: "hero" as const,
          required: true,
        },
        {
          id: "section-trust",
          name: "Trust",
          purpose: "Build credibility",
          priority: 2,
          contentType: "trust" as const,
          required: true,
        },
        {
          id: "section-cta",
          name: "Primary CTA",
          purpose: "Drive conversion",
          priority: 3,
          contentType: "cta" as const,
          required: true,
        },
      ],
      ctas: [
        {
          id: "cta-primary",
          label: "Get Started",
          action: "contact-form" as const,
          placement: "hero" as const,
          priority: "primary" as const,
        },
      ],
      seo: {
        titlePattern: `${request.clientName} | ${request.industry} in ${request.country}`,
        metaDescriptionPattern: `${request.clientName} helps ${request.targetAudience} with ${primaryGoal}.`,
        primaryKeywords: [request.industry, request.clientName, request.country],
        schemaTypes: ["LocalBusiness", "WebSite"],
        localSeo: prioritizeLocalSeo,
      },
      integrations: ["contact-form"],
      contentRequirements: [
        {
          id: "content-hero",
          topic: "Value proposition",
          format: "short-copy" as const,
          priority: "required" as const,
          notes: "Lead with primary customer benefit.",
        },
      ],
      trustElements: ["reviews", "years-in-business"],
    },
    {
      id: "page-services",
      slug: "/services",
      name: "Services",
      type: "services" as const,
      priority: "required" as const,
      purpose: "Explain core services and outcomes.",
      targetAudience: request.targetAudience,
      primaryGoal: "Help visitors evaluate service fit",
      sections: [
        {
          id: "section-services-list",
          name: "Services List",
          purpose: "Outline offerings",
          priority: 1,
          contentType: "services" as const,
          required: true,
        },
      ],
      ctas: [
        {
          id: "cta-services",
          label: "Request a Quote",
          action: "request-quote" as const,
          placement: "inline" as const,
          priority: "primary" as const,
        },
      ],
      seo: {
        titlePattern: `Services | ${request.clientName}`,
        metaDescriptionPattern: `Explore ${request.clientName} services for ${request.industry}.`,
        primaryKeywords: [`${request.industry} services`],
        schemaTypes: ["Service"],
        localSeo: prioritizeLocalSeo,
      },
      integrations: ["contact-form"],
      contentRequirements: [],
      trustElements: ["certifications"],
    },
    {
      id: "page-contact",
      slug: "/contact",
      name: "Contact",
      type: "contact" as const,
      priority: "required" as const,
      purpose: "Capture leads and contact inquiries.",
      targetAudience: request.targetAudience,
      primaryGoal: "Convert visitors into leads",
      sections: [
        {
          id: "section-contact-form",
          name: "Contact Form",
          purpose: "Lead capture",
          priority: 1,
          contentType: "form" as const,
          required: true,
        },
      ],
      ctas: [
        {
          id: "cta-contact",
          label: "Send Message",
          action: "contact-form" as const,
          placement: "inline" as const,
          priority: "primary" as const,
        },
      ],
      seo: {
        titlePattern: `Contact | ${request.clientName}`,
        metaDescriptionPattern: `Contact ${request.clientName} for ${request.industry} services.`,
        primaryKeywords: [`contact ${request.industry}`],
        schemaTypes: ["ContactPage"],
        localSeo: prioritizeLocalSeo,
      },
      integrations: ["contact-form", "crm"],
      contentRequirements: [],
      trustElements: ["service-area-map"],
    },
  ];
}

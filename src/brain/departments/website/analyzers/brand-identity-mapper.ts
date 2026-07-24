import type { BrandIdentity as PlanBrandIdentity } from "../schema";
import type { WebsiteExecutionInput } from "../types";
import type { BrandIdentity as AnalyzerBrandIdentity } from "../types/BrandIdentity";

function colorRole(
  purpose: string,
  semanticIntent: string,
  usageContexts: string[],
  avoidContexts: string[],
) {
  return { purpose, semanticIntent, usageContexts, avoidContexts };
}

/**
 * Maps analyzer BrandIdentity output to the v1.1 WebsitePlan BrandIdentity schema.
 */
export function mapAnalyzerBrandToPlanBrand(
  brand: AnalyzerBrandIdentity,
  input: WebsiteExecutionInput,
): PlanBrandIdentity {
  const regulated = input.request.regulated;
  const industry = input.request.industry;
  const [primaryColor, secondaryColor = "neutral"] = brand.colorPalette;
  const [headingTypography, bodyTypography = "readable body copy"] = brand.typography;

  return {
    personality: {
      traits: [...brand.personality],
      archetype: brand.personality.includes("authoritative")
        ? "expert"
        : brand.personality.includes("welcoming")
          ? "caregiver"
          : "helper",
      emotionalTone: brand.toneOfVoice,
      avoidTraits: regulated
        ? ["casual", "overpromising"]
        : ["aggressive", "generic"],
      rationale: `Rule-based brand strategy for ${industry}.`,
      source: "knowledge-industry",
    },
    communicationStyle: {
      voiceDescriptor: brand.toneOfVoice,
      readingLevel: regulated ? "professional" : "moderate",
      sentenceStyle: brand.personality.includes("authoritative") ? "formal" : "conversational",
      terminologyGuidance: brand.messaging,
      callToActionTone: brand.ctaStrategy,
      regulatedLanguageNotes: regulated
        ? ["Avoid outcome guarantees.", "Include required disclaimers where applicable."]
        : [],
      examples: [
        {
          topic: "Primary CTA",
          do: brand.ctaStrategy,
          dont: regulated ? "Guaranteed results." : "Overly casual slang.",
        },
      ],
    },
    visualDirection: {
      moodKeywords: [...brand.personality, "local", "professional"],
      layoutPreference: "balanced",
      visualWeight: brand.visualStyle.includes("photography") ? "image-led" : "balanced",
      mobileFirst: true,
      localBusinessSignals: ["service area", "reviews", "contact details"],
      rationale: brand.visualStyle,
    },
    colorStrategy: {
      primaryRole: colorRole(
        "Brand recognition",
        primaryColor,
        ["header", "primary buttons"],
        ["body text"],
      ),
      secondaryRole: colorRole(
        "Support hierarchy",
        secondaryColor,
        ["section backgrounds", "accents"],
        ["primary CTAs"],
      ),
      accentRole: colorRole(
        "Conversion emphasis",
        brand.colorPalette[1] ?? secondaryColor,
        ["CTA buttons", "links"],
        ["large backgrounds"],
      ),
      neutralRole: colorRole(
        "Content surfaces",
        "white or light neutral",
        ["backgrounds", "cards"],
        ["CTA buttons"],
      ),
      trustRole: colorRole(
        "Credibility",
        primaryColor,
        ["testimonials", "badges"],
        ["hero overlays"],
      ),
      contrastRequirement: regulated ? "enhanced" : "standard",
      guidance: `Semantic palette: ${brand.colorPalette.join(", ")}.`,
    },
    typographyGuidance: {
      hierarchyIntent: [
        {
          level: "h1",
          purpose: "Primary headline",
          emphasis: "high",
          usageGuidance: headingTypography,
        },
        {
          level: "body",
          purpose: "Readable content",
          emphasis: "medium",
          usageGuidance: bodyTypography,
        },
      ],
      readabilityPriority: "high",
      headingStyle: brand.personality.includes("authoritative")
        ? "authoritative"
        : brand.personality.includes("welcoming")
          ? "friendly"
          : "bold-confident",
      bodyStyle: brand.personality.includes("welcoming")
        ? "warm-conversational"
        : "clean-readable",
      mobileReadabilityNotes: "Minimum 16px body text on mobile.",
      regulatedContentNotes: regulated ? ["Legible disclaimer text required."] : [],
    },
    imageryDirection: {
      photographyStyle: brand.visualStyle,
      subjectPriorities: ["team", "service delivery", "customer outcomes"],
      avoidImagery: ["generic stock", "misleading before/after"],
      heroImageryGuidance: `Hero imagery aligned with ${industry} expectations.`,
      trustImageryGuidance: "Include credentials, team, and social proof where applicable.",
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
    summary: brand.messaging,
  };
}

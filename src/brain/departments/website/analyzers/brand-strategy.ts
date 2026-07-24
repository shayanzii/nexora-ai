/** Rule definition for deterministic industry brand strategies. */
export interface BrandStrategyRule {
  industryIds: readonly string[];
  personality: readonly string[];
  toneOfVoice: string;
  brandValues: readonly string[];
  visualStyle: string;
  colorPalette: readonly string[];
  typography: readonly string[];
  primaryCta: string;
  keywordSeeds: readonly string[];
}

export const RESTAURANT_BRAND_STRATEGY: BrandStrategyRule = {
  industryIds: ["restaurant"],
  personality: ["energetic", "welcoming"],
  toneOfVoice: "Warm, upbeat, and inviting — celebrate food and hospitality.",
  brandValues: ["hospitality", "quality", "community"],
  visualStyle: "Vibrant, appetite-forward photography with warm ambient tones.",
  colorPalette: ["red", "orange"],
  typography: ["bold display headings", "friendly readable body"],
  primaryCta: "Reserve a table",
  keywordSeeds: ["restaurant", "dining", "reservations", "local food"],
};

export const DENTIST_BRAND_STRATEGY: BrandStrategyRule = {
  industryIds: ["dentist", "dental"],
  personality: ["trustworthy", "caring"],
  toneOfVoice: "Reassuring, calm, and professional — reduce dental anxiety.",
  brandValues: ["trust", "comfort", "clinical excellence"],
  visualStyle: "Clean, bright, clinical-friendly imagery with soft natural light.",
  colorPalette: ["blue", "white"],
  typography: ["calm authoritative headings", "highly readable body copy"],
  primaryCta: "Book an appointment",
  keywordSeeds: ["dentist", "dental care", "family dentist", "appointments"],
};

export const LAW_FIRM_BRAND_STRATEGY: BrandStrategyRule = {
  industryIds: ["law-firm"],
  personality: ["authoritative"],
  toneOfVoice: "Confident, precise, and compliance-aware — establish credibility.",
  brandValues: ["integrity", "expertise", "discretion"],
  visualStyle: "Refined, structured layouts with professional portrait photography.",
  colorPalette: ["navy", "gold"],
  typography: ["authoritative serif-style headings", "formal readable body"],
  primaryCta: "Schedule a consultation",
  keywordSeeds: ["law firm", "legal services", "consultation", "attorney"],
};

export const GENERIC_BRAND_STRATEGY: BrandStrategyRule = {
  industryIds: ["default"],
  personality: ["professional", "trustworthy", "approachable"],
  toneOfVoice: "Clear, confident, and customer-focused.",
  brandValues: ["reliability", "quality", "service"],
  visualStyle: "Clean modern local-business aesthetic with authentic photography.",
  colorPalette: ["blue", "gray"],
  typography: ["bold headline hierarchy", "clean readable body"],
  primaryCta: "Contact us today",
  keywordSeeds: ["local business", "services", "trusted provider"],
};

const BRAND_STRATEGIES: readonly BrandStrategyRule[] = [
  RESTAURANT_BRAND_STRATEGY,
  DENTIST_BRAND_STRATEGY,
  LAW_FIRM_BRAND_STRATEGY,
];

/** Resolves the brand strategy rule for a normalized industry id. */
export function resolveBrandStrategy(industryId: string): BrandStrategyRule {
  const normalized = industryId.toLowerCase().trim();

  for (const strategy of BRAND_STRATEGIES) {
    if (strategy.industryIds.includes(normalized)) {
      return strategy;
    }
  }

  return GENERIC_BRAND_STRATEGY;
}

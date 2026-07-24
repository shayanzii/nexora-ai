/**
 * Analyzer output model for website brand planning.
 * Distinct from the v1.1 WebsitePlan `BrandIdentity` schema in `../schema.ts`.
 */
export interface BrandIdentity {
  personality: string[];
  toneOfVoice: string;
  targetAudience: string;
  valueProposition: string;
  brandValues: string[];
  visualStyle: string;
  colorPalette: string[];
  typography: string[];
  messaging: string;
  ctaStrategy: string;
  keywords: string[];
}

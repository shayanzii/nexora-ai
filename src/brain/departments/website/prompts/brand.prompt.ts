/** Input contract for brand identity analysis. */
export interface BrandAnalyzerInput {
  requestId: string;
  clientName: string;
  industry: string;
  industryId: string;
  country: string;
  targetAudience: string;
  goals: readonly string[];
  regulated: boolean;
}

/** Knowledge registry prompt id for brand analysis (future wiring). */
export const BRAND_ANALYZER_PROMPT_ID = "website-brand-analyzer";

/**
 * Builds the structured prompt payload for brand identity analysis.
 * Sprint 2: template only — no LLM invocation.
 */
export function buildBrandPrompt(input: BrandAnalyzerInput): string {
  const goals = input.goals.length > 0 ? input.goals.join("; ") : "Not specified";
  const regulatedNote = input.regulated
    ? "Regulated industry: apply compliance-friendly language and avoid outcome guarantees."
    : "Standard local service business tone.";

  return [
    "You are a strategic brand analyst for local service business websites.",
    "Produce a structured brand identity plan — no UI mockups or hex color codes.",
    "",
    `Request ID: ${input.requestId}`,
    `Client: ${input.clientName}`,
    `Industry: ${input.industry}`,
    `Target audience: ${input.targetAudience}`,
    `Goals: ${goals}`,
    regulatedNote,
    "",
    "Return JSON matching the BrandIdentity analyzer schema:",
    "- personality (string[])",
    "- toneOfVoice (string)",
    "- targetAudience (string)",
    "- valueProposition (string)",
    "- brandValues (string[])",
    "- visualStyle (string)",
    "- colorPalette (string[] — semantic roles, not hex values)",
    "- typography (string[] — hierarchy guidance, not font files)",
    "- messaging (string)",
    "- ctaStrategy (string)",
    "- keywords (string[])",
  ].join("\n");
}

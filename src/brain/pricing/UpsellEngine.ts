import type { PricingCatalog } from "./PricingCatalog";
import { normalizeIndustryId } from "./PricingRules";
import type { PricingContext, RecommendedUpsell } from "./PricingTypes";

export interface UpsellEngineInput {
  context: PricingContext;
  catalog: PricingCatalog;
  selectedServiceIds: ReadonlySet<string>;
  businessText: string;
}

/** Recommends industry-specific upsells based on customer needs. */
export function recommendUpsells(input: UpsellEngineInput): RecommendedUpsell[] {
  const industryId = normalizeIndustryId(input.context.industry);
  const candidates = input.catalog.getIndustryUpsells(industryId);
  const text = input.businessText.toLowerCase();
  const upsells: RecommendedUpsell[] = [];

  for (const candidate of candidates) {
    if (upsells.some((upsell) => upsell.id === candidate.id)) continue;

    const alreadySelected =
      input.selectedServiceIds.has(candidate.id) ||
      (candidate.id === "voice-receptionist" && input.selectedServiceIds.has("voice-ai")) ||
      (candidate.id === "crm-upsell" && input.selectedServiceIds.has("crm"));

    if (alreadySelected) continue;

    const relevance = candidate.triggers.some((trigger) => text.includes(trigger.toLowerCase()));
    if (!relevance && upsells.length >= 3) continue;

    upsells.push({
      id: candidate.id,
      name: candidate.name,
      oneTimePrice: candidate.oneTimePrice,
      monthlyPrice: candidate.monthlyPrice,
      rationale: candidate.rationale,
      industry: industryId,
    });
  }

  if (upsells.length < 3) {
    for (const candidate of candidates) {
      if (upsells.length >= 3) break;
      if (upsells.some((upsell) => upsell.id === candidate.id)) continue;
      upsells.push({
        id: candidate.id,
        name: candidate.name,
        oneTimePrice: candidate.oneTimePrice,
        monthlyPrice: candidate.monthlyPrice,
        rationale: candidate.rationale,
        industry: industryId,
      });
    }
  }

  return upsells.slice(0, 5);
}

import { resolveArchitectureStrategy } from "./planners/architecture-strategy";
import { titleToSlug } from "./planners/architecture-utils";
import { mapArchitectureIndustryId } from "./PagePlanner";
import { normalizeIndustryId } from "./utils";
import type { BlueprintPage, PageSectionPlan } from "./WebsiteTypes";

/** Maps industry page rules to section plans. */
export function planSections(
  industry: string,
  pages: readonly BlueprintPage[],
): PageSectionPlan[] {
  const industryId = mapArchitectureIndustryId(normalizeIndustryId(industry));
  const strategy = resolveArchitectureStrategy(industryId);
  const ruleBySlug = new Map(
    strategy.pages.map((rule) => [titleToSlug(rule.title), rule.requiredSections]),
  );

  return pages.map((page) => ({
    pageSlug: page.slug,
    sections: [...(ruleBySlug.get(page.slug) ?? defaultSections(page))],
  }));
}

function defaultSections(page: BlueprintPage): string[] {
  if (page.slug === "home") {
    return ["Hero", "Features", "Testimonials", "Services", "CTA", "Footer"];
  }
  if (page.conversionPage) {
    return ["Hero", "Form", "Trust Signals", "FAQ", "CTA"];
  }
  if (page.slug === "blog") {
    return ["Featured Posts", "Categories", "Newsletter CTA"];
  }
  return ["Hero", "Content", "CTA"];
}

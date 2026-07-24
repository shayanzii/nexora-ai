import type { SiteModel, WebsiteDepartmentOptions } from "./schema";

/** Normalized industry IDs treated as regulated for compliance defaults. */
export const REGULATED_INDUSTRY_IDS = new Set([
  "law-firm",
  "dental",
  "dentist",
  "healthcare",
  "medical",
]);

const REGULATED_INDUSTRY_PATTERN = /law|legal|dental|medical|health/i;

/** Normalizes a display industry name to a slug id. */
export function normalizeIndustryId(industry: string): string {
  return industry.toLowerCase().replace(/\s+/g, "-");
}

/** Determines whether an industry requires regulated content handling. */
export function isRegulatedIndustry(
  industry: string,
  industryId?: string,
): boolean {
  const normalized = industryId ?? normalizeIndustryId(industry);
  return (
    REGULATED_INDUSTRY_IDS.has(normalized) ||
    REGULATED_INDUSTRY_PATTERN.test(industry)
  );
}

/** Resolves site model from department options. */
export function resolveSiteModel(options: WebsiteDepartmentOptions): SiteModel {
  if (options.siteModel && options.siteModel !== "auto") {
    return options.siteModel;
  }
  return options.maxPages !== undefined && options.maxPages <= 3
    ? "single-page"
    : "multi-page";
}

/** Maps completeness score and warning count to result status. */
export function resolveDepartmentStatus(
  inputCompletenessScore: number,
  inputWarningsCount: number,
): "complete" | "partial" {
  return inputCompletenessScore >= 75 && inputWarningsCount <= 2
    ? "complete"
    : "partial";
}

/** Default options applied when request omits explicit website options. */
export function resolveWebsiteOptions(
  options?: WebsiteDepartmentOptions,
): Required<WebsiteDepartmentOptions> {
  return {
    siteModel: options?.siteModel ?? "auto",
    includeOptionalPages: options?.includeOptionalPages ?? false,
    maxPages: options?.maxPages ?? 8,
    prioritizeLocalSeo: options?.prioritizeLocalSeo ?? true,
    includeBlog: options?.includeBlog ?? false,
  };
}

/** Parses client discovery metadata without type assertions. */
export function readClientDiscoveryMetadata(
  metadata: Record<string, unknown> | undefined,
): {
  businessName?: string;
  country?: string;
  targetAudience?: string;
  timeline?: string;
} {
  if (!metadata) return {};

  const readString = (key: string): string | undefined => {
    const value = metadata[key];
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
  };

  return {
    businessName: readString("businessName"),
    country: readString("country"),
    targetAudience: readString("targetAudience"),
    timeline: readString("timeline"),
  };
}

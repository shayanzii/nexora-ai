import { randomUUID } from "crypto";

import type { ProjectRequest } from "../../types/project";

/** Customer request accepted by the CEO Agent. */
export interface CEOCustomerRequest {
  requestId?: string;
  company?: string;
  industry: string;
  goal: string;
  budget: number;
  services?: string[];
  metadata?: Readonly<Record<string, unknown>>;
}

/** Normalized execution context for CEO Agent planning. */
export interface CEOContext {
  requestId: string;
  company: string;
  industry: string;
  industryId: string;
  goal: string;
  budget: number;
  services: readonly string[];
  country?: string;
  targetAudience?: string;
  timeline?: string;
  regulated: boolean;
  metadata: Readonly<Record<string, unknown>>;
}

/** Builds a normalized CEO context from a customer request. */
export function buildCEOContext(request: CEOCustomerRequest): CEOContext {
  const metadata = request.metadata ?? {};
  const company =
    request.company?.trim() ||
    (typeof metadata.businessName === "string" ? metadata.businessName : "") ||
    "Unknown business";

  return {
    requestId: request.requestId ?? randomUUID(),
    company,
    industry: request.industry.trim(),
    industryId: normalizeIndustryId(request.industry),
    goal: request.goal.trim(),
    budget: request.budget,
    services: request.services?.length ? [...request.services] : [],
    country: typeof metadata.country === "string" ? metadata.country : undefined,
    targetAudience:
      typeof metadata.targetAudience === "string" ? metadata.targetAudience : undefined,
    timeline: typeof metadata.timeline === "string" ? metadata.timeline : undefined,
    regulated: metadata.regulated === true,
    metadata,
  };
}

/** Adapts a ProjectRequest into a CEO customer request. */
export function ceoContextFromProjectRequest(
  request: ProjectRequest,
  requestId?: string,
): CEOContext {
  return buildCEOContext({
    requestId,
    company:
      typeof request.metadata?.businessName === "string"
        ? request.metadata.businessName
        : undefined,
    industry: request.industry,
    goal: request.goal,
    budget: request.budget,
    services: request.services,
    metadata: request.metadata,
  });
}

function normalizeIndustryId(industry: string): string {
  return industry.trim().toLowerCase().replace(/\s+/g, "-");
}

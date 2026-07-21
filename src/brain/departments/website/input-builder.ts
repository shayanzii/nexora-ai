import type { DepartmentContext } from "../../sdk";
import type { ProjectRequest } from "../../types/project";
import type {
  WebsiteDepartmentInputParams,
  WebsiteDepartmentRequest,
} from "./schema";
import type { WebsiteExecutionInput, FrozenWebsiteDepartmentRequest } from "./types";
import { INPUT_COMPLETENESS_FIELDS } from "./types";
import {
  isRegulatedIndustry,
  normalizeIndustryId,
  readClientDiscoveryMetadata,
  resolveWebsiteOptions,
} from "./utils";

function normalizeGoals(request: ProjectRequest): string[] {
  const goal = request.goal?.trim();
  return goal ? [goal] : [];
}

function scoreField(
  request: WebsiteDepartmentRequest,
  field: (typeof INPUT_COMPLETENESS_FIELDS)[number]["field"],
): boolean {
  switch (field) {
    case "clientName":
      return Boolean(request.clientName.trim());
    case "industry":
      return Boolean(request.industry.trim());
    case "country":
      return Boolean(request.country.trim());
    case "goals":
      return request.goals.length > 0;
    case "targetAudience":
      return Boolean(request.targetAudience.trim());
    case "services":
      return request.services.length > 0;
    case "budget":
      return request.budget > 0;
    case "timeline":
      return Boolean(request.timeline?.trim());
    default:
      return false;
  }
}

/**
 * Builds and normalizes website department input from upstream params.
 * Pure functions — no I/O or mutation of input arguments.
 */
export class InputBuilder {
  /** Creates a WebsiteDepartmentRequest from generic brain input params. */
  static fromParams(params: WebsiteDepartmentInputParams): WebsiteDepartmentRequest {
    const metadata = readClientDiscoveryMetadata(params.request.metadata);
    const proposal = params.proposal;
    const industry = params.request.industry.trim();
    const goals = normalizeGoals(params.request);

    const fallbackGoal = params.request.goal?.trim();
    const resolvedGoals =
      goals.length > 0 ? goals : fallbackGoal ? [fallbackGoal] : [];

    return {
      requestId: params.requestId,
      clientName: metadata.businessName ?? proposal?.clientName?.trim() ?? "Unknown Client",
      industry,
      country: metadata.country ?? proposal?.country?.trim() ?? "Canada",
      goals: resolvedGoals,
      targetAudience:
        metadata.targetAudience ??
        proposal?.clientChallenges?.[0] ??
        "Local customers",
      services:
        params.request.services.length > 0 ? [...params.request.services] : ["website"],
      budget: params.request.budget,
      timeline: metadata.timeline ?? proposal?.timeline.summary,
      regulated: isRegulatedIndustry(industry),
      strategicAnalysis: params.strategicAnalysis,
      salesResult: params.salesResult,
      proposal: params.proposal,
      options: params.options ? { ...params.options } : undefined,
    };
  }

  /** Computes input completeness score (0–100) and warnings. */
  static assessCompleteness(request: WebsiteDepartmentRequest): {
    score: number;
    warnings: readonly string[];
  } {
    let earned = 0;
    const warnings: string[] = [];

    for (const fieldDef of INPUT_COMPLETENESS_FIELDS) {
      if (scoreField(request, fieldDef.field)) {
        earned += fieldDef.weight;
      } else {
        warnings.push(`${fieldDef.label} is missing or incomplete.`);
      }
    }

    if (!request.strategicAnalysis) {
      warnings.push("Strategic analysis not provided — plan will rely on client input.");
    }
    if (!request.proposal) {
      warnings.push("Proposal not provided — scope alignment may be limited.");
    }
    if (request.budget > 0 && request.budget < 1500) {
      warnings.push("Budget is below typical website project minimum.");
    }

    return { score: Math.min(100, earned), warnings: Object.freeze(warnings) };
  }

  /** Builds immutable execution input from department context and request. */
  static buildExecutionInput(
    context: DepartmentContext,
    request: WebsiteDepartmentRequest,
    feedback?: WebsiteDepartmentRequest["feedback"],
  ): WebsiteExecutionInput {
    const industryProfile = context.knowledge.getIndustry(request.industry);
    const industryId = industryProfile?.id ?? normalizeIndustryId(request.industry);
    const { score, warnings } = InputBuilder.assessCompleteness(request);
    const options = resolveWebsiteOptions(request.options);
    const activeFeedback = feedback ?? request.feedback;
    const priorPlanVersion = activeFeedback ? 2 : 1;
    const regulated =
      request.regulated || isRegulatedIndustry(request.industry, industryId);

    const frozenRequest: FrozenWebsiteDepartmentRequest = Object.freeze({
      ...request,
      goals: Object.freeze([...request.goals]),
      services: Object.freeze([...request.services]),
      regulated,
    });

    return Object.freeze({
      request: frozenRequest,
      context,
      industryId,
      inputCompletenessScore: score,
      inputWarnings: warnings,
      options: Object.freeze(options),
      feedback: activeFeedback,
      priorPlanVersion,
      priorPlanId: activeFeedback?.websitePlanId,
    });
  }
}

/** @deprecated Use WebsiteExecutionInput from ./types */
export type BuiltWebsiteExecutionInput = WebsiteExecutionInput;

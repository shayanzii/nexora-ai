import type { DepartmentContext } from "../../../sdk";
import type { StrategicReasoningResult } from "../../../reasoning/types";
import type { ProjectRequest } from "../../../types/project";
import type { Proposal } from "../../sales/proposal/schema";
import { readClientDiscoveryMetadata } from "../utils";
import type { BrandIdentity } from "../types/BrandIdentity";
import {
  buildBrandPrompt,
  type BrandAnalyzerInput,
} from "../prompts/brand.prompt";
import {
  resolveBrandStrategy,
  type BrandStrategyRule,
} from "./brand-strategy";

export type { BrandAnalyzerInput } from "../prompts/brand.prompt";

/** Full analyzer input — upstream context for rule-based brand planning. */
export interface BrandAnalyzerParams {
  request: ProjectRequest;
  strategicAnalysis?: StrategicReasoningResult;
  salesProposal?: Proposal;
  context: DepartmentContext;
}

/** Result wrapper for brand analysis execution. */
export interface BrandAnalyzerResult {
  success: boolean;
  data?: BrandIdentity;
  error?: string;
}

/**
 * Brand Analyzer — deterministic rule-based brand identity engine.
 * Uses industry strategies enriched by project, strategic, and proposal context.
 */
export class BrandAnalyzer {
  readonly id = "brand-analyzer";
  readonly version = "1.0.0";

  /** Runs deterministic brand analysis for the given context. */
  analyze(params: BrandAnalyzerParams): BrandAnalyzerResult {
    try {
      const industryId = params.context.knowledge.resolveIndustryId(params.request.industry);
      const strategy = resolveBrandStrategy(industryId);
      const data = this.buildBrandIdentity(params, strategy, industryId);

      return { success: true, data };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Brand analysis failed.";
      return { success: false, error: message };
    }
  }

  /** Builds prompt payload from analyzer params (future LLM path). */
  buildPromptFromParams(params: BrandAnalyzerParams): string {
    return buildBrandPrompt(this.toPromptInput(params));
  }

  /** Builds the LLM-ready prompt from a compact input. */
  buildPrompt(input: BrandAnalyzerInput): string {
    return buildBrandPrompt(input);
  }

  private buildBrandIdentity(
    params: BrandAnalyzerParams,
    strategy: BrandStrategyRule,
    industryId: string,
  ): BrandIdentity {
    const metadata = readClientDiscoveryMetadata(params.request.metadata);
    const clientName =
      metadata.businessName ??
      params.salesProposal?.clientName ??
      "Local Business";
    const country = metadata.country ?? params.salesProposal?.country ?? "Canada";
    const targetAudience =
      metadata.targetAudience ??
      params.strategicAnalysis?.solution.objective ??
      "Local customers";
    const primaryGoal = params.request.goal.trim() || "Grow the business online";

    const valueProposition = this.resolveValueProposition(params, clientName, targetAudience);
    const messaging = this.resolveMessaging(params, strategy, clientName, primaryGoal);
    const keywords = this.buildKeywords(params, strategy, industryId, country, clientName);

    return {
      personality: [...strategy.personality],
      toneOfVoice: strategy.toneOfVoice,
      targetAudience,
      valueProposition,
      brandValues: [...strategy.brandValues],
      visualStyle: strategy.visualStyle,
      colorPalette: [...strategy.colorPalette],
      typography: [...strategy.typography],
      messaging,
      ctaStrategy: strategy.primaryCta,
      keywords,
    };
  }

  private resolveValueProposition(
    params: BrandAnalyzerParams,
    clientName: string,
    targetAudience: string,
  ): string {
    if (params.salesProposal?.recommendedSolution?.trim()) {
      return params.salesProposal.recommendedSolution.trim();
    }

    if (params.strategicAnalysis?.strategy.positioning?.trim()) {
      return params.strategicAnalysis.strategy.positioning.trim();
    }

    if (params.salesProposal?.executiveSummary?.trim()) {
      return params.salesProposal.executiveSummary.trim();
    }

    return `${clientName} helps ${targetAudience} with reliable ${params.request.industry} services.`;
  }

  private resolveMessaging(
    params: BrandAnalyzerParams,
    strategy: BrandStrategyRule,
    clientName: string,
    primaryGoal: string,
  ): string {
    if (params.strategicAnalysis?.executiveSummary?.trim()) {
      return params.strategicAnalysis.executiveSummary.trim();
    }

    if (params.salesProposal?.executiveSummary?.trim()) {
      return params.salesProposal.executiveSummary.trim();
    }

    return `${clientName}: ${strategy.toneOfVoice} Focus on ${primaryGoal.toLowerCase()}.`;
  }

  private buildKeywords(
    params: BrandAnalyzerParams,
    strategy: BrandStrategyRule,
    industryId: string,
    country: string,
    clientName: string,
  ): string[] {
    const keywords = new Set<string>([
      ...strategy.keywordSeeds,
      industryId,
      params.request.industry.toLowerCase(),
      country.toLowerCase(),
      clientName.toLowerCase(),
    ]);

    for (const service of params.request.services) {
      keywords.add(service.toLowerCase());
    }

    const topPriority = params.strategicAnalysis?.recommendations.topPriorities[0]?.title;
    if (topPriority) {
      keywords.add(topPriority.toLowerCase());
    }

    return [...keywords].filter(Boolean).slice(0, 12);
  }

  private toPromptInput(params: BrandAnalyzerParams): BrandAnalyzerInput {
    const metadata = readClientDiscoveryMetadata(params.request.metadata);
    const industryId = params.context.knowledge.resolveIndustryId(params.request.industry);

    return {
      requestId: params.context.requestId,
      clientName: metadata.businessName ?? params.salesProposal?.clientName ?? "Local Business",
      industry: params.request.industry,
      industryId,
      country: metadata.country ?? params.salesProposal?.country ?? "Canada",
      targetAudience:
        metadata.targetAudience ??
        params.strategicAnalysis?.solution.objective ??
        "Local customers",
      goals: params.request.goal ? [params.request.goal] : [],
      regulated: params.context.knowledge.isRegulatedIndustry(params.request.industry),
    };
  }
}

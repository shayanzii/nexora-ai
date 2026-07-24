/**
 * Brand Analyzer — rule-based engine tests.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildDepartmentContext } from "../../../sdk";
import type { StrategicReasoningResult } from "../../../reasoning/types";
import type { ProjectRequest } from "../../../types/project";
import type { Proposal } from "../../sales/proposal/schema";
import {
  BrandAnalyzer,
  type BrandAnalyzerParams,
} from "../analyzers/BrandAnalyzer";
import { mapAnalyzerBrandToPlanBrand } from "../analyzers/brand-identity-mapper";
import {
  DENTIST_BRAND_STRATEGY,
  GENERIC_BRAND_STRATEGY,
  LAW_FIRM_BRAND_STRATEGY,
  RESTAURANT_BRAND_STRATEGY,
  resolveBrandStrategy,
} from "../analyzers/brand-strategy";
import { BRAND_ANALYZER_PROMPT_ID, buildBrandPrompt } from "../prompts/brand.prompt";
import { InputBuilder } from "../input-builder";
import { createWebsitePlannerOutputs } from "../planner-outputs";
import { WebsiteDepartment } from "../website-department";
import type { WebsiteDepartmentRequest } from "../schema";

function projectRequest(overrides: Partial<ProjectRequest> = {}): ProjectRequest {
  return {
    industry: "HVAC",
    goal: "Generate leads",
    budget: 4000,
    services: ["website"],
    metadata: {
      businessName: "Summit Services",
      country: "Canada",
      targetAudience: "Local homeowners",
    },
    ...overrides,
  };
}

function analyzerParams(
  request: ProjectRequest,
  extras: Partial<Omit<BrandAnalyzerParams, "request" | "context">> = {},
): BrandAnalyzerParams {
  const context = buildDepartmentContext({
    requestId: "req-brand-test",
    request,
  });

  return {
    request,
    context,
    ...extras,
  };
}

function minimalStrategicAnalysis(
  overrides: Partial<StrategicReasoningResult> = {},
): StrategicReasoningResult {
  return {
    requestId: "req-brand-test",
    generatedAt: new Date().toISOString(),
    businessAnalysis: {
      requestId: "req-brand-test",
      businessType: "service",
      industryId: "restaurant",
      regulated: false,
      goals: ["Increase bookings"],
      risks: [],
      strengths: [],
      weaknesses: [],
      customerJourney: [],
      growthBottlenecks: [],
      summary: "Strong local demand.",
    },
    opportunities: {
      automation: [],
      ai: [],
      marketing: [],
      operational: [],
      revenue: [],
      all: [],
      summary: "",
    },
    recommendations: {
      recommendations: [],
      topPriorities: [{ id: "rec-1", category: "marketing", title: "Local SEO", description: "", rationale: "", score: 90, priority: "high", impact: "high", effort: "medium", relatedServices: ["website"], source: "test" }],
      summary: "",
    },
    solution: {
      id: "sol-1",
      requestId: "req-brand-test",
      name: "Growth solution",
      objective: "Diners seeking memorable experiences",
      components: [],
      architecture: "",
      integrationPoints: [],
      estimatedTimeline: { minimumWeeks: 4, maximumWeeks: 8, summary: "4-8 weeks" },
      estimatedInvestment: { currency: "CAD", minimum: 3000, maximum: 6000, basis: "estimate" },
      summary: "",
    },
    strategy: {
      vision: "Become the top local choice.",
      objectives: ["Increase reservations"],
      positioning: "Premium neighborhood dining with warm hospitality.",
      competitiveAdvantages: [],
      riskMitigation: [],
      successMetrics: [],
    },
    roadmap: [],
    expectedImpact: {
      shortTerm: [],
      mediumTerm: [],
      longTerm: [],
      kpis: [],
      confidenceLevel: "medium",
    },
    executiveSummary: "Focus on reservations and repeat visits.",
    nextStep: "Launch website refresh.",
    ...overrides,
  };
}

function minimalProposal(overrides: Partial<Proposal> = {}): Proposal {
  return {
    id: "proposal-1",
    requestId: "req-brand-test",
    clientName: "Bistro Nova",
    industry: "Restaurant",
    country: "Canada",
    generatedAt: new Date().toISOString(),
    executiveSummary: "Modern website to drive table bookings.",
    clientChallenges: ["Low online visibility"],
    recommendedSolution: "Conversion-focused restaurant website with online reservations.",
    recommendedServices: [],
    deliverables: [],
    timeline: { minimumWeeks: 4, maximumWeeks: 6, summary: "4-6 weeks" },
    milestones: [],
    estimatedPriceRange: { currency: "CAD", minimum: 3000, maximum: 5000, basis: "estimate" },
    assumptions: [],
    risks: [],
    nextSteps: [],
    ...overrides,
  };
}

describe("BrandAnalyzer — rule-based engine", () => {
  it("exposes analyzer metadata", () => {
    const analyzer = new BrandAnalyzer();
    assert.equal(analyzer.id, "brand-analyzer");
    assert.equal(analyzer.version, "1.0.0");
  });

  it("resolves industry-specific brand strategies", () => {
    assert.equal(resolveBrandStrategy("restaurant"), RESTAURANT_BRAND_STRATEGY);
    assert.equal(resolveBrandStrategy("dentist"), DENTIST_BRAND_STRATEGY);
    assert.equal(resolveBrandStrategy("dental"), DENTIST_BRAND_STRATEGY);
    assert.equal(resolveBrandStrategy("law-firm"), LAW_FIRM_BRAND_STRATEGY);
    assert.equal(resolveBrandStrategy("real-estate"), GENERIC_BRAND_STRATEGY);
  });

  it("analyzes restaurant brand identity deterministically", () => {
    const analyzer = new BrandAnalyzer();
    const result = analyzer.analyze(
      analyzerParams(projectRequest({ industry: "Restaurant", goal: "Fill tables on weeknights" })),
    );

    assert.equal(result.success, true);
    assert.deepEqual(result.data?.personality, ["energetic", "welcoming"]);
    assert.deepEqual(result.data?.colorPalette, ["red", "orange"]);
    assert.equal(result.data?.ctaStrategy, "Reserve a table");
    assert.ok(result.data?.keywords.includes("restaurant"));
  });

  it("analyzes dentist brand identity deterministically", () => {
    const analyzer = new BrandAnalyzer();
    const result = analyzer.analyze(
      analyzerParams(projectRequest({ industry: "Dental", goal: "Book new patient appointments" })),
    );

    assert.equal(result.success, true);
    assert.deepEqual(result.data?.personality, ["trustworthy", "caring"]);
    assert.deepEqual(result.data?.colorPalette, ["blue", "white"]);
    assert.equal(result.data?.ctaStrategy, "Book an appointment");
  });

  it("analyzes law firm brand identity deterministically", () => {
    const analyzer = new BrandAnalyzer();
    const result = analyzer.analyze(
      analyzerParams(projectRequest({ industry: "Law Firm", goal: "Generate consultation requests" })),
    );

    assert.equal(result.success, true);
    assert.deepEqual(result.data?.personality, ["authoritative"]);
    assert.deepEqual(result.data?.colorPalette, ["navy", "gold"]);
    assert.equal(result.data?.ctaStrategy, "Schedule a consultation");
  });

  it("falls back to generic branding for unknown industries", () => {
    const analyzer = new BrandAnalyzer();
    const result = analyzer.analyze(
      analyzerParams(projectRequest({ industry: "Real Estate", goal: "Capture seller leads" })),
    );

    assert.equal(result.success, true);
    assert.deepEqual(result.data?.personality, ["professional", "trustworthy", "approachable"]);
    assert.deepEqual(result.data?.colorPalette, ["blue", "gray"]);
    assert.equal(result.data?.ctaStrategy, "Contact us today");
  });

  it("enriches value proposition and messaging from proposal and strategic analysis", () => {
    const analyzer = new BrandAnalyzer();
    const result = analyzer.analyze(
      analyzerParams(projectRequest({ industry: "Restaurant" }), {
        salesProposal: minimalProposal(),
        strategicAnalysis: minimalStrategicAnalysis(),
      }),
    );

    assert.equal(result.success, true);
    assert.equal(
      result.data?.valueProposition,
      "Conversion-focused restaurant website with online reservations.",
    );
    assert.equal(result.data?.messaging, "Focus on reservations and repeat visits.");
    assert.ok(result.data?.keywords.includes("local seo"));
  });

  it("maps analyzer output to WebsitePlan brand schema", () => {
    const department = new WebsiteDepartment();
    const request: WebsiteDepartmentRequest = {
      requestId: "req-map-001",
      clientName: "Harbor Legal",
      industry: "Law Firm",
      country: "Canada",
      goals: ["Generate consultation requests"],
      targetAudience: "Small business owners",
      services: ["website"],
      budget: 6000,
      regulated: true,
    };
    const context = department.buildContext(request);
    const executionInput = InputBuilder.buildExecutionInput(context, request);
    const brand = new BrandAnalyzer().analyze({
      request: context.request,
      context,
    });

    assert.equal(brand.success, true);
    const mapped = mapAnalyzerBrandToPlanBrand(brand.data!, executionInput);

    assert.equal(mapped.personality.archetype, "expert");
    assert.equal(mapped.colorStrategy.contrastRequirement, "enhanced");
    assert.ok(mapped.summary.length > 0);
    assert.equal(mapped.communicationStyle.examples[0]?.do, "Schedule a consultation");
  });

  it("integrates BrandAnalyzer into website planner outputs", () => {
    const department = new WebsiteDepartment();
    const request: WebsiteDepartmentRequest = {
      requestId: "req-planner-001",
      clientName: "Bistro Nova",
      industry: "Restaurant",
      country: "Canada",
      goals: ["Increase reservations"],
      targetAudience: "Local diners",
      services: ["website"],
      budget: 3500,
      regulated: false,
    };
    const context = department.buildContext(request);
    const executionInput = InputBuilder.buildExecutionInput(context, request);
    const outputs = createWebsitePlannerOutputs(executionInput);

    assert.deepEqual(outputs.brandIdentity.personality.traits, ["energetic", "welcoming"]);
    assert.ok(outputs.brandIdentity.summary.includes("Bistro Nova"));
    assert.notEqual(
      outputs.brandIdentity.personality.rationale,
      "Placeholder brand personality pending Brand Planner (Sprint 2).",
    );
  });

  it("builds regulated prompt guidance and stable prompt id", () => {
    assert.equal(BRAND_ANALYZER_PROMPT_ID, "website-brand-analyzer");

    const prompt = buildBrandPrompt({
      requestId: "req-001",
      clientName: "Legal Partners",
      industry: "Law Firm",
      industryId: "law-firm",
      country: "Canada",
      targetAudience: "Business owners",
      goals: ["Consultations"],
      regulated: true,
    });

    assert.ok(prompt.includes("Regulated industry"));
    assert.ok(prompt.includes("compliance-friendly"));
  });
});

/**
 * Website Execution Agent tests — blueprint planning only, no code generation.
 */
import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";

import type { CEOBusinessAnalysis } from "../../../agents/ceo/CEOOutput";
import { ProjectOrchestrator } from "../../../orchestrator";
import { PricingCatalog } from "../../../pricing/PricingCatalog";
import { PricingEngine } from "../../../pricing/PricingEngine";
import { SalesAgent, resolveSalesTask } from "../../sales/SalesAgent";
import {
  WebsiteExecutionAgent,
  WebsiteExecutionValidationError,
  WebsiteTaskNotFoundError,
  getWebsiteExecutionAgent,
  planSeo,
  planWebsiteBlueprint,
  resetWebsiteExecutionAgent,
} from "../index";

const dentalAnalysis: CEOBusinessAnalysis = {
  business: "Smile Dental",
  industry: "Dental Clinic",
  goals: ["Increase booked appointments"],
  requirements: [
    "Modern website optimized for conversions",
    "Local SEO to improve search visibility",
    "Chatbot integration for appointment booking",
  ],
  missingInformation: ["timeline"],
  recommendedDepartments: ["sales", "website"],
  estimatedComplexity: "medium",
  estimatedBudget: {
    min: 5000,
    max: 7000,
    currency: "CAD",
    rationale: "Website, SEO, and chatbot scope",
  },
  estimatedTimeline: { minWeeks: 4, maxWeeks: 8, summary: "Multi-service delivery" },
  confidence: 0.85,
  followUpQuestions: ["What timeline are you targeting?"],
};

function buildPipelineInput() {
  const plan = new ProjectOrchestrator(() => {}).orchestrate({
    requestId: "website-exec-001",
    analysis: dentalAnalysis,
    services: ["website", "seo", "chatbot"],
  });

  const salesResult = new SalesAgent(() => {}).execute({
    task: resolveSalesTask(plan),
    analysis: dentalAnalysis,
    plan,
    context: {
      budget: 7000,
      country: "Canada",
      targetAudience: "Local dental patients",
      services: ["website", "seo", "chatbot"],
    },
  });

  const pricingResult = new PricingEngine(new PricingCatalog(), () => {}).price(salesResult);

  return { plan, salesResult, pricingResult };
}

describe("Website blueprint generation", () => {
  beforeEach(() => {
    resetWebsiteExecutionAgent();
  });

  it("generates a complete dental clinic website blueprint", () => {
    const { plan, salesResult, pricingResult } = buildPipelineInput();
    const agent = new WebsiteExecutionAgent(() => {});

    const blueprint = agent.plan({
      analysis: dentalAnalysis,
      plan,
      salesResult,
      pricingResult,
      metadata: { country: "Canada", city: "Toronto", targetAudience: "Local dental patients" },
    });

    assert.equal(blueprint.websiteType, "dental-clinic");
    assert.equal(blueprint.websiteTypeLabel, "Dental Clinic Website");
    assert.match(blueprint.projectSummary, /Smile Dental/);
    assert.ok(blueprint.pages.length >= 6);
    assert.ok(blueprint.components.length >= 5);
    assert.equal(blueprint.recommendedStack.framework, "Next.js");
    assert.equal(blueprint.recommendedStack.styling, "Tailwind CSS");
    assert.equal(blueprint.recommendedStack.hosting, "Vercel");
    assert.equal(blueprint.performanceStrategy.lighthouseTarget, 95);
    assert.ok(blueprint.confidenceScore > 0);
  });

  it("includes core dental pages and components", () => {
    const { plan, salesResult, pricingResult } = buildPipelineInput();
    const blueprint = planWebsiteBlueprint({
      analysis: dentalAnalysis,
      plan,
      salesResult,
      pricingResult,
      metadata: { country: "Canada", city: "Toronto" },
    });

    const pageTitles = blueprint.pages.map((page) => page.title);
    assert.ok(pageTitles.includes("Home"));
    assert.ok(pageTitles.includes("Services"));
    assert.ok(pageTitles.includes("Booking"));
    assert.ok(pageTitles.includes("FAQ"));
    assert.ok(pageTitles.includes("Contact"));
    assert.ok(pageTitles.includes("Blog"));

    const componentNames = blueprint.components.map((component) => component.name);
    assert.ok(componentNames.includes("Navbar"));
    assert.ok(componentNames.includes("Hero"));
    assert.ok(componentNames.includes("Booking Form"));
    assert.ok(componentNames.includes("Contact Form"));
    assert.ok(componentNames.includes("Footer"));
  });
});

describe("Navigation and SEO planning", () => {
  it("builds header navigation from pages", () => {
    const { plan, salesResult, pricingResult } = buildPipelineInput();
    const blueprint = planWebsiteBlueprint({
      analysis: dentalAnalysis,
      plan,
      salesResult,
      pricingResult,
      metadata: { city: "Toronto", country: "Canada" },
    });

    assert.ok(blueprint.navigation.header.length > 0);
    assert.ok(blueprint.navigation.header.some((item) => item.slug === "booking"));
  });

  it("generates SEO plan with local primary keyword", () => {
    const seo = planSeo({
      business: "Smile Dental",
      industry: "Dental Clinic",
      websiteType: "dental-clinic",
      city: "Toronto",
      country: "Canada",
      pages: [
        {
          slug: "home",
          title: "Home",
          purpose: "Intro",
          priority: "required",
          inHeaderNav: true,
          inFooterNav: false,
          conversionPage: false,
        },
      ],
      goals: ["Increase booked appointments"],
    });

    assert.equal(seo.primaryKeywords[0], "Toronto Dental Clinic");
    assert.ok(seo.localSeoRecommendations.length > 0);
    assert.ok(seo.schemaRecommendations.includes("MedicalBusiness"));
  });
});

describe("Content and design planning", () => {
  it("generates content plan with CTA per page", () => {
    const { plan, salesResult, pricingResult } = buildPipelineInput();
    const blueprint = planWebsiteBlueprint({
      analysis: dentalAnalysis,
      plan,
      salesResult,
      pricingResult,
      metadata: { targetAudience: "Local dental patients" },
    });

    assert.ok(blueprint.contentPlan.pages.length > 0);
    for (const page of blueprint.contentPlan.pages) {
      assert.ok(page.callsToAction.length > 0);
      assert.ok(page.requiredContent.length > 0);
    }
    assert.ok(blueprint.designSystem.colorPalette.length >= 3);
  });

  it("includes performance and deployment strategies", () => {
    const { plan, salesResult, pricingResult } = buildPipelineInput();
    const blueprint = planWebsiteBlueprint({
      analysis: dentalAnalysis,
      plan,
      salesResult,
      pricingResult,
    });

    assert.ok(blueprint.performanceStrategy.coreWebVitals.length > 0);
    assert.equal(blueprint.deploymentPlan.platform, "Vercel");
    assert.ok(blueprint.responsiveStrategy.mobile.length > 0);
  });
});

describe("Error handling", () => {
  it("requires website department in execution plan", () => {
    const { plan, salesResult, pricingResult } = buildPipelineInput();
    const agent = new WebsiteExecutionAgent(() => {});

    assert.throws(
      () =>
        agent.plan({
          analysis: dentalAnalysis,
          plan: { ...plan, departments: ["sales"] },
          salesResult,
          pricingResult,
        }),
      WebsiteTaskNotFoundError,
    );
  });

  it("validates CEO business name", () => {
    const { plan, salesResult, pricingResult } = buildPipelineInput();
    const agent = new WebsiteExecutionAgent(() => {});

    assert.throws(
      () =>
        agent.plan({
          analysis: { ...dentalAnalysis, business: "" },
          plan,
          salesResult,
          pricingResult,
        }),
      WebsiteExecutionValidationError,
    );
  });

  it("exposes a default singleton agent", () => {
    const a = getWebsiteExecutionAgent();
    const b = getWebsiteExecutionAgent();
    assert.equal(a, b);
  });
});

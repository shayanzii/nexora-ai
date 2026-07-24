/**
 * Pricing Engine v2 tests — deterministic, no LLM.
 */
import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";

import type { SalesResult } from "../../departments/sales/SalesTypes";
import {
  PricingEngine,
  PricingValidationError,
  calculateProfit,
  extractBudgetFromSalesText,
  getPricingEngine,
  normalizeIndustryId,
  recommendPackageTier,
  resetPricingEngine,
} from "../index";
import { DEFAULT_PRICING_CATALOG, PricingCatalog } from "../PricingCatalog";

function buildDentalSalesResult(): SalesResult {
  return {
    taskId: "sales-task-001",
    requestId: "pricing-test-001",
    department: "sales",
    customerSummary:
      "Smile Dental is a Dental Clinic business operating in Canada, focused on increase booked appointments. They are evaluating 6 departments with an estimated investment up to $7,000.",
    businessChallenges: [
      "Achieving goal: Increase booked appointments",
      "Requirement gap: Chatbot integration for appointment booking",
      "Requirement gap: Local SEO to improve search visibility",
    ],
    recommendedServices: [
      {
        serviceId: "website",
        name: "Website",
        rationale: "Required website workstream.",
        priority: "primary",
        expectedOutcomes: ["Professional online presence"],
      },
      {
        serviceId: "seo",
        name: "SEO",
        rationale: "Required SEO workstream.",
        priority: "primary",
        expectedOutcomes: ["Higher local rankings"],
      },
      {
        serviceId: "ai-chatbot",
        name: "AI Chatbot",
        rationale: "Required automation workstream.",
        priority: "primary",
        expectedOutcomes: ["24/7 engagement"],
      },
    ],
    discoveryQuestions: [
      { id: "q1", question: "What is your current website?", category: "technical", priority: "required" },
      { id: "q2", question: "Do you already use online booking?", category: "technical", priority: "required" },
    ],
    proposal: {
      executiveSummary:
        "Smile Dental is a Dental Clinic business seeking to increase booked appointments. Nexora AI recommends a medium-complexity engagement focused on Website, SEO, AI Chatbot with an estimated investment of $6,000–$7,000 over 6–10 weeks.",
      businessChallenges: ["Increase booked appointments"],
      recommendedServices: [],
      expectedOutcomes: ["More appointments"],
      implementationRoadmap: [],
      nextSteps: ["Schedule discovery call"],
      generatedAt: new Date().toISOString(),
    },
    confidenceScore: 0.85,
    completedAt: new Date().toISOString(),
  };
}

describe("Pricing rules", () => {
  it("extracts budget from sales text", () => {
    assert.equal(
      extractBudgetFromSalesText("investment up to $7,000", "$6,000–$7,000"),
      7000,
    );
  });

  it("normalizes industry ids", () => {
    assert.equal(normalizeIndustryId("Dental Clinic"), "dental-clinic");
  });

  it("recommends website professional tier for medium budget", () => {
    const group = DEFAULT_PRICING_CATALOG.packages.find((entry) => entry.category === "website");
    assert.ok(group);

    const tier = recommendPackageTier(group.tiers, {
      category: "website",
      budget: 7000,
      complexity: "medium",
      industry: "dental-clinic",
      goals: ["Increase booked appointments"],
      hasService: true,
    });

    assert.equal(tier.tier, "professional");
  });
});

describe("Profit calculation", () => {
  it("calculates gross profit and margin", () => {
    const result = calculateProfit(6500, 2850);
    assert.equal(result.grossProfit, 3650);
    assert.equal(result.profitMargin, 56);
  });
});

describe("PricingEngine", () => {
  beforeEach(() => {
    resetPricingEngine();
  });

  it("generates dental clinic pricing breakdown", () => {
    const engine = new PricingEngine(new PricingCatalog(), () => {});
    const result = engine.price(buildDentalSalesResult());

    assert.equal(result.requestId, "pricing-test-001");
    assert.equal(result.currency, "CAD");
    assert.equal(result.oneTimePrice, 6500);
    assert.equal(result.monthlyRecurringRevenue, 635);

    const oneTimeLabels = result.pricingBreakdown.oneTimeItems.map((item) => item.label);
    assert.ok(oneTimeLabels.includes("Website"));
    assert.ok(oneTimeLabels.includes("Booking System"));
    assert.ok(oneTimeLabels.includes("AI Chatbot"));

    const monthlyLabels = result.pricingBreakdown.monthlyItems.map((item) => item.label);
    assert.ok(monthlyLabels.includes("Hosting"));
    assert.ok(monthlyLabels.includes("Maintenance"));
    assert.ok(monthlyLabels.includes("SEO"));
    assert.ok(monthlyLabels.includes("AI Support"));
    assert.ok(monthlyLabels.includes("Analytics"));
  });

  it("recommends dental clinic upsells", () => {
    const engine = new PricingEngine(new PricingCatalog(), () => {});
    const result = engine.price(buildDentalSalesResult());

    const upsellNames = result.recommendedUpsells.map((upsell) => upsell.name);
    assert.ok(upsellNames.includes("Voice AI Receptionist"));
    assert.ok(upsellNames.includes("Patient Portal"));
    assert.ok(upsellNames.includes("Google Reviews Automation"));
  });

  it("builds payment plan installments", () => {
    const engine = new PricingEngine(new PricingCatalog(), () => {});
    const result = engine.price(buildDentalSalesResult(), { paymentPlanType: "50-50" });

    assert.equal(result.paymentPlan.type, "50-50");
    assert.equal(result.paymentPlan.installments.length, 2);
    assert.equal(result.paymentPlan.installments[0].amount, 3250);
    assert.equal(result.paymentPlan.installments[1].amount, 3250);
  });

  it("calculates estimated cost and profit margin", () => {
    const engine = new PricingEngine(new PricingCatalog(), () => {});
    const result = engine.price(buildDentalSalesResult());

    assert.ok(result.estimatedCost > 0);
    assert.ok(result.grossProfit > 0);
    assert.ok(result.profitMargin >= 40 && result.profitMargin <= 65);
    assert.ok(result.confidenceScore > 0);
  });

  it("validates sales result input", () => {
    const engine = new PricingEngine(new PricingCatalog(), () => {});
    const invalid = { ...buildDentalSalesResult(), requestId: "" };

    assert.throws(() => engine.price(invalid), PricingValidationError);
  });

  it("exposes a default singleton engine", () => {
    const a = getPricingEngine();
    const b = getPricingEngine();
    assert.equal(a, b);
  });
});

describe("Edge cases", () => {
  it("supports custom payment plan type", () => {
    const engine = new PricingEngine(new PricingCatalog(), () => {});
    const result = engine.price(buildDentalSalesResult(), { paymentPlanType: "100-upfront" });

    assert.equal(result.paymentPlan.type, "100-upfront");
    assert.equal(result.paymentPlan.installments[0].amount, result.oneTimePrice);
  });

  it("recommends packages for each selected category", () => {
    const engine = new PricingEngine(new PricingCatalog(), () => {});
    const result = engine.price(buildDentalSalesResult());

    const categories = result.recommendedPackages.map((pkg) => pkg.category);
    assert.ok(categories.includes("website"));
    assert.ok(categories.includes("seo"));
  });
});

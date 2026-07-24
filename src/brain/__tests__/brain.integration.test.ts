/**
 * Nexora Brain end-to-end integration tests.
 * Validates metadata propagation, sales pipeline, proposal, reasoning, and workflow.
 */
import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";

import {
  createProjectContext,
  getWorkflowEngine,
  processBrainRequest,
  resetBrainService,
  runSalesDepartment,
  validateWorkflowCoverage,
} from "../index";
import { SharedMemory } from "../memory/shared-memory";
import type { ProjectRequest } from "../types/project";

const EXPECTED_SALES_STEPS = [
  "lead-qualification-agent",
  "discovery-agent",
  "business-analysis-agent",
  "pricing-agent",
  "proposal-engine-agent",
];

interface IndustryFixture {
  label: string;
  industry: string;
  goal: string;
  budget: number;
  services: string[];
  expectedIndustryId?: string;
  regulated?: boolean;
}

const FIXTURES: IndustryFixture[] = [
  {
    label: "Dentist",
    industry: "Dental",
    goal: "Automate appointment booking and reduce front desk calls",
    budget: 4500,
    services: ["chatbot", "booking", "support"],
    expectedIndustryId: "dentist",
    regulated: true,
  },
  {
    label: "HVAC",
    industry: "HVAC",
    goal: "Generate leads and book service appointments after hours",
    budget: 3500,
    services: ["chatbot", "receptionist", "leads"],
    expectedIndustryId: "hvac",
    regulated: false,
  },
  {
    label: "Plumbing",
    industry: "Plumbing",
    goal: "Capture emergency calls and route leads faster",
    budget: 2800,
    services: ["receptionist", "chatbot", "crm"],
    expectedIndustryId: "plumbing",
    regulated: false,
  },
  {
    label: "Restaurant",
    industry: "Restaurant",
    goal: "Handle reservations and catering inquiries automatically",
    budget: 2200,
    services: ["chatbot", "booking"],
    expectedIndustryId: "restaurant",
    regulated: false,
  },
  {
    label: "Law Firm",
    industry: "Law Firm",
    goal: "Qualify intake leads and schedule consultations",
    budget: 6000,
    services: ["chatbot", "crm", "website"],
    expectedIndustryId: "law-firm",
    regulated: true,
  },
  {
    label: "Unknown industry",
    industry: "Real Estate",
    goal: "Capture and qualify website leads faster",
    budget: 3200,
    services: ["website", "chatbot", "leads", "crm"],
  },
];

function buildRequest(fixture: IndustryFixture): ProjectRequest {
  return {
    industry: fixture.industry,
    goal: fixture.goal,
    budget: fixture.budget,
    services: fixture.services,
    metadata: {
      businessName: `${fixture.label} Test Co`,
      country: "Canada",
      targetAudience: "Local customers",
      timeline: "4 weeks",
    },
  };
}

describe("Nexora Brain integration", () => {
  beforeEach(() => {
    resetBrainService();
  });

  for (const fixture of FIXTURES) {
    describe(fixture.label, () => {
      it("preserves metadata through plan and context", () => {
        const request = buildRequest(fixture);
        const plan = getWorkflowEngine().plan(request);

        assert.equal(plan.metadata?.businessName, `${fixture.label} Test Co`);
        assert.equal(plan.metadata?.country, "Canada");
        assert.equal(plan.metadata?.targetAudience, "Local customers");
        assert.equal(plan.metadata?.timeline, "4 weeks");

        const memory = new SharedMemory();
        const context = createProjectContext(plan, memory);

        assert.equal(context.request.metadata?.businessName, `${fixture.label} Test Co`);
        assert.equal(context.request.metadata?.country, "Canada");
        assert.equal(context.requestId, plan.requestId);
        assert.equal(context.plan.requestId, plan.requestId);
      });

      it("runs sales pipeline with shared memory, pricing, and proposal", async () => {
        const request = buildRequest(fixture);
        const plan = getWorkflowEngine().plan(request);
        const salesResult = await runSalesDepartment(request, plan);

        assert.equal(salesResult.status, "qualified");
        assert.deepEqual(
          salesResult.stepsExecuted.slice(0, EXPECTED_SALES_STEPS.length),
          EXPECTED_SALES_STEPS,
        );
        assert.ok(salesResult.pricing);
        assert.ok(salesResult.pricing.estimatedPriceRange.minimum > 0);
        assert.ok(
          salesResult.pricing.estimatedPriceRange.maximum >=
            salesResult.pricing.estimatedPriceRange.minimum,
        );
        assert.equal(typeof salesResult.pricing.budgetAligned, "boolean");
        assert.ok(salesResult.proposalDocument);
        assert.ok(salesResult.proposalDocument.deliverables.length > 0);
        assert.equal(salesResult.proposalDocument.requestId, plan.requestId);
      });

      it("passes workflow coverage validation", () => {
        const request = buildRequest(fixture);
        const plan = getWorkflowEngine().plan(request);
        const coverage = validateWorkflowCoverage(plan);

        assert.equal(coverage.valid, true, `Missing steps: ${coverage.missingSteps.join(", ")}`);
        assert.ok(plan.executionOrder.includes("sales-department"));
      });

      it("produces full brain output with proposal and strategic analysis", async () => {
        const request = buildRequest(fixture);
        const result = await processBrainRequest({
          ...request,
          includeProposal: true,
          includeStrategicAnalysis: true,
        });

        assert.equal(result.success, true, result.errors?.join("; "));
        assert.ok(result.plan?.metadata?.businessName);
        assert.ok(result.proposal?.id);
        assert.equal(result.proposal?.requestId, result.plan?.requestId);
        assert.ok(result.strategicAnalysis?.strategy.vision);
        assert.ok(result.strategicAnalysis!.solution.components.length > 0);
        assert.ok(result.strategicAnalysis!.roadmap.length > 0);
        assert.ok(result.strategicAnalysis!.expectedImpact.kpis.length > 0);

        if (fixture.expectedIndustryId) {
          assert.equal(
            result.strategicAnalysis!.businessAnalysis.industryId,
            fixture.expectedIndustryId,
          );
        }

        if (fixture.regulated !== undefined) {
          assert.equal(result.strategicAnalysis!.businessAnalysis.regulated, fixture.regulated);
        }
      });
    });
  }

  it("preserves metadata through runtime execution path", async () => {
    const request = buildRequest(FIXTURES[1]);
    const result = await processBrainRequest({
      ...request,
      execute: true,
      includeProposal: true,
      includeStrategicAnalysis: true,
    });

    assert.equal(result.success, true, result.errors?.join("; "));
    assert.equal(result.execution?.status, "completed");
    assert.ok(result.plan?.metadata?.businessName);
    assert.ok(result.proposal);
    assert.ok(result.strategicAnalysis);
  });

  it("remains backward compatible without optional flags", async () => {
    const request = buildRequest(FIXTURES[0]);
    const result = await processBrainRequest(request);

    assert.equal(result.success, true);
    assert.ok(result.plan);
    assert.equal(result.execution, undefined);
    assert.equal(result.proposal, undefined);
    assert.equal(result.strategicAnalysis, undefined);
  });
});

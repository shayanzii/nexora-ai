/**
 * Website Department Sprint 1 — core lifecycle and stabilization tests.
 */
import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";

import {
  getDepartmentRegistry,
  resetDepartmentRegistry,
  runDepartmentLifecycle,
} from "../../../sdk";

import {
  InputBuilder,
  OutputAssembler,
  WebsiteDepartment,
  WEBSITE_DEPARTMENT_ID,
  WEBSITE_PLAN_SCHEMA_VERSION,
  WEBSITE_PLANNER_IDS,
  WEBSITE_TASK_TYPE,
  createPlaceholderPlannerOutputs,
  registerWebsiteDepartment,
  resetWebsiteDepartmentRegistration,
  resolveDepartmentStatus,
  type WebsiteDepartmentRequest,
} from "../index";

const baseRequest: WebsiteDepartmentRequest = {
  requestId: "req-web-test-001",
  clientName: "Summit HVAC",
  industry: "HVAC",
  country: "Canada",
  goals: ["Generate emergency service leads"],
  targetAudience: "Homeowners in the Greater Toronto Area",
  services: ["website"],
  budget: 4500,
  timeline: "6 weeks",
  regulated: false,
};

const emptyRequest: WebsiteDepartmentRequest = {
  requestId: "",
  clientName: "",
  industry: "",
  country: "",
  goals: [],
  targetAudience: "",
  services: [],
  budget: 0,
  regulated: false,
};

describe("Website Department — Sprint 1", () => {
  beforeEach(() => {
    resetDepartmentRegistry();
    resetWebsiteDepartmentRegistration();
  });

  describe("InputBuilder", () => {
    it("builds request from ProjectRequest params", () => {
      const request = InputBuilder.fromParams({
        requestId: "req-001",
        request: {
          industry: "Dental",
          goal: "Book appointments",
          budget: 3500,
          services: ["website"],
          metadata: {
            businessName: "Bright Smile Dental",
            country: "Canada",
            targetAudience: "Local families",
            timeline: "4 weeks",
          },
        },
      });

      assert.equal(request.clientName, "Bright Smile Dental");
      assert.equal(request.industry, "Dental");
      assert.deepEqual(request.goals, ["Book appointments"]);
      assert.equal(request.country, "Canada");
    });

    it("is deterministic for identical params", () => {
      const params = {
        requestId: "req-deterministic",
        request: {
          industry: "Plumbing",
          goal: "Get quote requests",
          budget: 2800,
          services: ["website"],
          metadata: { businessName: "Pipe Pro", country: "Canada" },
        },
      };

      const first = InputBuilder.fromParams(params);
      const second = InputBuilder.fromParams(params);
      assert.deepEqual(first, second);
    });

    it("computes completeness score and warnings", () => {
      const assessment = InputBuilder.assessCompleteness(baseRequest);
      assert.ok(assessment.score >= 75);
      assert.ok(Object.isFrozen(assessment.warnings));
    });

    it("warns when strategic analysis and proposal are missing", () => {
      const assessment = InputBuilder.assessCompleteness(baseRequest);
      assert.ok(
        assessment.warnings.some((warning) => warning.includes("Strategic analysis")),
      );
      assert.ok(
        assessment.warnings.some((warning) => warning.includes("Proposal")),
      );
    });

    it("returns frozen immutable execution input", () => {
      const department = new WebsiteDepartment();
      const context = department.buildContext(baseRequest);
      const executionInput = InputBuilder.buildExecutionInput(context, baseRequest);

      assert.ok(Object.isFrozen(executionInput));
      assert.ok(Object.isFrozen(executionInput.request));
      assert.ok(Object.isFrozen(executionInput.request.goals));
      assert.ok(Object.isFrozen(executionInput.inputWarnings));
    });
  });

  describe("OutputAssembler", () => {
    it("produces v1.1 WebsitePlan with required sections", () => {
      const department = new WebsiteDepartment();
      const context = department.buildContext(baseRequest);
      const executionInput = InputBuilder.buildExecutionInput(context, baseRequest);
      const plannerOutputs = createPlaceholderPlannerOutputs(executionInput);
      const result = OutputAssembler.assemble(executionInput, plannerOutputs);

      assert.equal(result.departmentId, WEBSITE_DEPARTMENT_ID);
      assert.equal(result.websitePlan?.schemaVersion, WEBSITE_PLAN_SCHEMA_VERSION);
      assert.equal(result.websitePlan?.version, 1);
      assert.ok(result.websitePlan?.brandIdentity);
      assert.ok(result.websitePlan?.userJourney);
      assert.equal(result.websitePlan?.userJourney.stages.length, 5);
      assert.ok(result.websitePlan?.siteArchitecture.architectureDecision);
      assert.ok(result.websitePlan?.pages.length >= 3);
      assert.equal(result.status, "complete");
      assert.equal(result.websitePlan?.generatedAt, context.createdAt);
    });

    it("records placeholder planner steps as executed", () => {
      const department = new WebsiteDepartment();
      const context = department.buildContext(baseRequest);
      const executionInput = InputBuilder.buildExecutionInput(context, baseRequest);
      const result = OutputAssembler.assemble(
        executionInput,
        createPlaceholderPlannerOutputs(executionInput),
      );

      assert.ok(result.stepsExecuted.includes("input-builder"));
      assert.ok(result.stepsExecuted.includes("brand-planner"));
      assert.ok(result.stepsExecuted.includes("output-assembler"));
      assert.deepEqual(result.stepsSkipped, []);
      assert.equal(result.stepsExecuted.length, WEBSITE_PLANNER_IDS.length + 2);
    });

    it("resolves status consistently via resolveDepartmentStatus", () => {
      assert.equal(resolveDepartmentStatus(90, 2), "complete");
      assert.equal(resolveDepartmentStatus(90, 3), "partial");
      assert.equal(resolveDepartmentStatus(50, 0), "partial");
    });
  });

  describe("Placeholder planners", () => {
    it("produce deterministic output for identical input", () => {
      const department = new WebsiteDepartment();
      const context = department.buildContext(baseRequest);
      const executionInput = InputBuilder.buildExecutionInput(context, baseRequest);

      const first = createPlaceholderPlannerOutputs(executionInput);
      const second = createPlaceholderPlannerOutputs(executionInput);

      assert.deepEqual(
        first.pages.map((page) => page.id),
        second.pages.map((page) => page.id),
      );
      assert.equal(
        first.siteArchitecture.architectureDecision.decidedAt,
        second.siteArchitecture.architectureDecision.decidedAt,
      );
      assert.equal(
        first.siteArchitecture.architectureDecision.decidedAt,
        context.createdAt,
      );
    });

    it("orders journey stages in canonical order", () => {
      const department = new WebsiteDepartment();
      const context = department.buildContext(baseRequest);
      const executionInput = InputBuilder.buildExecutionInput(context, baseRequest);
      const outputs = createPlaceholderPlannerOutputs(executionInput);

      assert.deepEqual(
        outputs.userJourney.stages.map((stage) => stage.stage),
        ["awareness", "consideration", "decision", "conversion", "retention"],
      );
    });
  });

  describe("WebsiteDepartment lifecycle", () => {
    it("accepts a valid request", async () => {
      const department = new WebsiteDepartment();
      const validation = department.validate(baseRequest);

      assert.equal(validation.valid, true);
      assert.equal(validation.errors.length, 0);

      const result = await department.runWebsitePlan(baseRequest);
      assert.equal(result.status, "complete");
      assert.ok(result.websitePlan);
    });

    it("validates required fields on invalid request", () => {
      const department = new WebsiteDepartment();
      const report = department.validate({
        ...baseRequest,
        requestId: "",
        clientName: "",
        goals: [],
      });

      assert.equal(report.valid, false);
      assert.ok(report.errors.length > 0);
    });

    it("rejects empty request", async () => {
      const department = new WebsiteDepartment();
      const validation = department.validate(emptyRequest);

      assert.equal(validation.valid, false);
      assert.ok(validation.errors.length >= 5);

      const result = await department.runWebsitePlan(emptyRequest);
      assert.equal(result.status, "failed");
      assert.ok(result.error);
      assert.equal(result.inputCompletenessScore, 0);
    });

    it("runs full SDK lifecycle via runWebsitePlan()", async () => {
      const department = new WebsiteDepartment();
      const result = await department.runWebsitePlan(baseRequest);

      assert.equal(result.status, "complete");
      assert.equal(result.websitePlan?.clientName, "Summit HVAC");
      assert.equal(result.websitePlan?.industryId, "hvac");
      assert.ok(result.summary.length > 0);
      assert.equal(result.regenerationApplied, false);
    });

    it("returns partial status for low completeness input", async () => {
      const department = new WebsiteDepartment();
      const result = await department.runWebsitePlan({
        ...baseRequest,
        timeline: undefined,
        budget: 800,
      });

      assert.equal(result.status, "partial");
      assert.ok(result.inputWarnings.length > 0);
    });

    it("generates SDK summary with confidence and warnings", async () => {
      const department = new WebsiteDepartment();
      const runResult = await department.run(baseRequest);

      assert.equal(runResult.success, true);
      assert.ok(runResult.summary);
      assert.equal(runResult.summary?.departmentId, WEBSITE_DEPARTMENT_ID);
      assert.equal(runResult.summary?.requestId, baseRequest.requestId);
      assert.ok(runResult.summary?.headline.includes("Summit HVAC"));
      assert.ok(["low", "medium", "high"].includes(runResult.summary!.confidence));
      assert.ok(runResult.telemetry.success);
      assert.ok(runResult.telemetry.lifecycleSteps.length >= 4);
    });

    it("supports BuilderFeedback regeneration entry point", async () => {
      const department = new WebsiteDepartment();
      const feedback = {
        id: "feedback-001",
        websitePlanId: "website-plan-req-web-test-001-v1",
        requestId: baseRequest.requestId,
        submittedAt: new Date().toISOString(),
        submittedBy: "qa-agent" as const,
        builderVersion: "0.1.0",
        issues: [
          {
            id: "issue-001",
            issueType: "weak-cta" as const,
            severity: "medium" as const,
            affectedPages: ["page-home"],
            affectedSections: ["section-cta"],
            affectedJourneyStages: ["conversion" as const],
            title: "Primary CTA too generic",
            description: "CTA label lacks urgency.",
            recommendation: "Use action-specific CTA copy.",
            suggestedPlanUpdates: [],
            evidence: "QA review",
          },
        ],
        overallSeverity: "medium" as const,
        regenerationScope: {
          regenerateBrandIdentity: false,
          regenerateUserJourney: true,
          regenerateArchitecture: false,
          regeneratePages: true,
          regenerateConversion: true,
          regenerateSeo: false,
          affectedPageIds: ["page-home"],
          preserveUnaffected: true,
        },
        notes: "Sprint 1 feedback stub",
      };

      const result = await department.runWebsitePlan(baseRequest, feedback);

      assert.equal(result.regenerationApplied, true);
      assert.equal(result.websitePlan?.version, 2);
      assert.equal(result.websitePlan?.priorPlanId, feedback.websitePlanId);
      assert.deepEqual(result.feedbackIssuesRemaining, ["issue-001"]);
    });

    it("fails gracefully on invalid request", async () => {
      const department = new WebsiteDepartment();
      const result = await department.runWebsitePlan(emptyRequest);

      assert.equal(result.status, "failed");
      assert.ok(result.error);
    });
  });

  describe("Department Registry", () => {
    it("registers with correct metadata", () => {
      const registry = getDepartmentRegistry();
      registerWebsiteDepartment(registry);

      assert.equal(registry.has(WEBSITE_DEPARTMENT_ID), true);

      const byTask = registry.discover({ taskType: WEBSITE_TASK_TYPE });
      assert.equal(byTask.length, 1);
      assert.equal(byTask[0]?.department.id, WEBSITE_DEPARTMENT_ID);

      const byTag = registry.discover({ tag: "website" });
      assert.ok(byTag.some((entry) => entry.department.id === WEBSITE_DEPARTMENT_ID));
    });

    it("returns the same instance on repeated registration", () => {
      const registry = getDepartmentRegistry();
      const first = registerWebsiteDepartment(registry);
      const second = registerWebsiteDepartment(registry);

      assert.equal(first, second);
    });

    it("runs lifecycle through registry-resolved department", async () => {
      const registry = getDepartmentRegistry();
      const department = registerWebsiteDepartment(registry);
      const resolved = registry.resolve(WEBSITE_DEPARTMENT_ID);
      assert.ok(resolved);
      assert.equal(resolved, department);

      const runResult = await runDepartmentLifecycle(department, baseRequest);
      assert.equal(runResult.success, true);
      assert.equal(runResult.departmentId, WEBSITE_DEPARTMENT_ID);
    });
  });
});

/**
 * Department SDK integration tests.
 * Uses a mock department — does not modify Sales or existing departments.
 */
import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";

import {
  BaseDepartment,
  DepartmentRegistry,
  TelemetryCollector,
  ValidationError,
  buildDepartmentContext,
  emptyValidationReport,
  getDepartmentRegistry,
  getLifecycleSteps,
  mergeValidationReports,
  resetDepartmentRegistry,
  runDepartmentLifecycle,
  validateRequest,
  type DepartmentContext,
  type DepartmentSummary,
  type ValidationReport,
} from "../index";
import type { ProjectRequest } from "../../types/project";

interface MockRequest {
  requestId: string;
  industry: string;
  goal: string;
  budget: number;
}

interface MockResult {
  message: string;
  industryId: string;
}

class MockDepartment extends BaseDepartment<MockRequest, MockResult> {
  readonly id = "mock-department";
  readonly name = "Mock Department";
  readonly description = "Test department for SDK validation.";
  readonly version = "1.0.0";

  shouldFailExecute = false;

  protected validateRequest(request: MockRequest): ValidationReport {
    return validateRequest(
      request,
      [
        { field: "requestId", required: true },
        { field: "industry", required: true },
        { field: "goal", required: true },
        { field: "budget", required: true },
      ],
      [
        (req) =>
          req.budget < 1000
            ? {
                code: "LOW_BUDGET",
                message: "Budget is below recommended minimum.",
                severity: "warning",
                field: "budget",
              }
            : null,
      ],
    );
  }

  protected createContextParams(request: MockRequest) {
    const projectRequest: ProjectRequest = {
      industry: request.industry,
      goal: request.goal,
      budget: request.budget,
      services: ["website"],
      metadata: {
        businessName: "Mock Business",
        country: "Canada",
        targetAudience: "Local customers",
        timeline: "4 weeks",
      },
    };

    return {
      requestId: request.requestId,
      request: projectRequest,
    };
  }

  protected async executeDepartment(
    context: DepartmentContext,
    request: MockRequest,
  ): Promise<MockResult> {
    if (this.shouldFailExecute) {
      throw new ValidationError("Simulated execution failure.", {
        severity: "high",
        departmentId: this.id,
        step: "execute",
      });
    }

    const industry = context.knowledge.getIndustry(request.industry);
    return {
      message: `Plan for ${request.goal}`,
      industryId: industry?.id ?? request.industry.toLowerCase(),
    };
  }

  protected buildSummary(
    context: DepartmentContext,
    result: MockResult,
  ): DepartmentSummary {
    return {
      departmentId: this.id,
      requestId: context.requestId,
      headline: result.message,
      nextStep: "Proceed to review.",
      warnings: [],
      confidence: "high",
    };
  }
}

const validRequest: MockRequest = {
  requestId: "req-sdk-001",
  industry: "HVAC",
  goal: "Generate leads",
  budget: 3000,
};

describe("Department SDK", () => {
  beforeEach(() => {
    resetDepartmentRegistry();
  });

  describe("Validation Framework", () => {
    it("passes valid requests", () => {
      const report = validateRequest(validRequest, [
        { field: "requestId", required: true },
        { field: "industry", required: true },
      ]);
      assert.equal(report.valid, true);
      assert.equal(report.errors.length, 0);
    });

    it("returns errors for missing required fields", () => {
      const report = validateRequest(
        { requestId: "", industry: "", goal: "", budget: 0 },
        [
          { field: "requestId", required: true },
          { field: "industry", required: true },
        ],
      );
      assert.equal(report.valid, false);
      assert.ok(report.errors.length >= 2);
    });

    it("merges validation reports", () => {
      const a = emptyValidationReport();
      const b = validateRequest(
        { requestId: "", industry: "HVAC" },
        [{ field: "requestId", required: true }],
      );
      const merged = mergeValidationReports([a, b]);
      assert.ok(merged.errors.length >= 1);
    });
  });

  describe("DepartmentContext", () => {
    it("preserves metadata immutably", () => {
      const context = buildDepartmentContext({
        requestId: "req-001",
        request: {
          industry: "Dental",
          goal: "Book appointments",
          budget: 2000,
          services: ["chatbot"],
          metadata: { businessName: "Bright Smile", country: "Canada" },
        },
      });

      assert.equal(context.metadata.businessName, "Bright Smile");
      assert.equal(context.request.metadata?.businessName, "Bright Smile");
      assert.ok(context.knowledge);
      assert.ok(context.memory);
      assert.ok(Object.isFrozen(context.metadata));
    });
  });

  describe("BaseDepartment Lifecycle", () => {
    it("runs full lifecycle: validate → context → execute → summarize → telemetry", async () => {
      const dept = new MockDepartment();
      const result = await dept.run(validRequest);

      assert.equal(result.success, true);
      assert.equal(result.status, "complete");
      assert.equal(result.departmentId, "mock-department");
      assert.equal(result.requestId, "req-sdk-001");
      assert.ok(result.result?.message);
      assert.equal(result.result?.industryId, "hvac");
      assert.ok(result.summary?.headline);
      assert.equal(result.validation.valid, true);
      assert.ok(result.telemetry.totalDurationMs >= 0);
      assert.equal(result.telemetry.success, true);

      const steps = result.telemetry.lifecycleSteps.map((s) => s.step);
      assert.ok(steps.includes("validate"));
      assert.ok(steps.includes("build-context"));
      assert.ok(steps.includes("execute"));
      assert.ok(steps.includes("summarize"));
    });

    it("returns partial status when warnings exist", async () => {
      const dept = new MockDepartment();
      const result = await dept.run({ ...validRequest, budget: 500 });

      assert.equal(result.success, true);
      assert.equal(result.status, "partial");
      assert.ok(result.validation.warnings.length > 0);
      assert.ok(result.telemetry.warnings.length > 0);
    });

    it("fails on validation errors when stopOnValidationError is true", async () => {
      const dept = new MockDepartment();
      const result = await dept.run({
        requestId: "",
        industry: "",
        goal: "",
        budget: 0,
      });

      assert.equal(result.success, false);
      assert.equal(result.status, "failed");
      assert.ok(result.error instanceof ValidationError);
    });

    it("fails on execution errors with telemetry", async () => {
      const dept = new MockDepartment();
      dept.shouldFailExecute = true;
      const result = await dept.run(validRequest);

      assert.equal(result.success, false);
      assert.equal(result.status, "failed");
      assert.ok(result.telemetry.failures.length > 0);
    });
  });

  describe("TelemetryCollector", () => {
    it("tracks lifecycle and planner timings", async () => {
      const collector = new TelemetryCollector("test-dept", "req-001");
      collector.recordLifecycleStep("validate", Date.now() - 10, true);
      await collector.trackPlanner("mock-planner", async () => "ok");
      collector.addWarning("Test warning");
      const telemetry = collector.complete(true);

      assert.equal(telemetry.departmentId, "test-dept");
      assert.equal(telemetry.lifecycleSteps.length, 1);
      assert.equal(telemetry.plannerTimings.length, 1);
      assert.equal(telemetry.warnings.length, 1);
      assert.equal(telemetry.success, true);
    });
  });

  describe("DepartmentRegistry", () => {
    it("registers, resolves, discovers, lists, and unregisters", () => {
      const registry = new DepartmentRegistry();
      const dept = new MockDepartment();

      registry.register({
        department: dept,
        tags: ["mock", "test"],
        supportedTaskTypes: ["plan_mock"],
        priority: 5,
      });

      assert.equal(registry.has("mock-department"), true);
      assert.equal(registry.resolve("mock-department")?.id, "mock-department");

      const byTag = registry.discover({ tag: "mock" });
      assert.equal(byTag.length, 1);

      const byTask = registry.discover({ taskType: "plan_mock" });
      assert.equal(byTask.length, 1);

      assert.equal(registry.list().length, 1);
      assert.equal(registry.unregister("mock-department"), true);
      assert.equal(registry.has("mock-department"), false);
    });

    it("singleton registry is accessible", () => {
      const registry = getDepartmentRegistry();
      registry.clear();
      assert.ok(registry);
    });
  });

  describe("Lifecycle Utils", () => {
    it("exposes standard lifecycle steps", () => {
      const steps = getLifecycleSteps();
      assert.deepEqual(steps, [
        "validate",
        "build-context",
        "execute",
        "summarize",
        "telemetry",
      ]);
    });

    it("runDepartmentLifecycle delegates to department.run()", async () => {
      const dept = new MockDepartment();
      const result = await runDepartmentLifecycle(dept, validRequest);
      assert.equal(result.success, true);
    });
  });
});

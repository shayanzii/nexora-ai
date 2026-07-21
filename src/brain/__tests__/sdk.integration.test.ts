/**
 * Department SDK integration tests.
 * Uses a mock department — does not modify Sales or existing departments.
 */
import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";

import {
  BaseDepartment,
  DepartmentRegistry,
  ExecutionError,
  TelemetryCollector,
  ValidationError,
  buildDepartmentContext,
  emptyValidationReport,
  getDepartmentRegistry,
  getLifecycleSteps,
  resetDepartmentRegistry,
  runDepartmentLifecycle,
  validateRequest,
  type BuildDepartmentContextParams,
  type DepartmentContext,
  type DepartmentSummary,
  type ValidationReport,
} from "../sdk";

interface MockRequest {
  requestId: string;
  industry: string;
  goal: string;
  budget: number;
  services: string[];
  metadata?: Record<string, unknown>;
  failExecution?: boolean;
}

interface MockResult {
  plan: string;
  industryId: string;
}

class MockDepartment extends BaseDepartment<MockRequest, MockResult> {
  readonly id = "mock-department";
  readonly name = "Mock Department";
  readonly description = "Test department for SDK validation.";

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
            ? [
                {
                  code: "LOW_BUDGET",
                  message: "Budget may limit scope.",
                  severity: "warning",
                  field: "budget",
                },
              ]
            : [],
      ],
    );
  }

  protected createContextParams(
    request: MockRequest,
  ): BuildDepartmentContextParams {
    return {
      requestId: request.requestId,
      request: {
        industry: request.industry,
        goal: request.goal,
        budget: request.budget,
        services: request.services,
        metadata: request.metadata,
      },
    };
  }

  protected async executeDepartment(
    context: DepartmentContext,
    request: MockRequest,
  ): Promise<MockResult> {
    if (request.failExecution) {
      throw new ExecutionError("Simulated execution failure.", {
        severity: "high",
        departmentId: this.id,
        step: "execute",
      });
    }

    const industry = context.knowledge.getIndustry(request.industry);
    return {
      plan: `Plan for ${request.goal}`,
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
      headline: result.plan,
      nextStep: "Review plan.",
      warnings: [],
      confidence: "high",
    };
  }
}

describe("Department SDK", () => {
  beforeEach(() => {
    resetDepartmentRegistry();
  });

  describe("Validation Framework", () => {
    it("passes valid requests", () => {
      const report = validateRequest(
        { requestId: "r1", industry: "HVAC", goal: "Leads", budget: 3000 },
        [
          { field: "requestId", required: true },
          { field: "industry", required: true },
        ],
      );
      assert.equal(report.valid, true);
      assert.equal(report.errors.length, 0);
    });

    it("returns errors for missing required fields", () => {
      const report = validateRequest(
        { industry: "", goal: "Leads" },
        [
          { field: "requestId", required: true },
          { field: "industry", required: true },
        ],
      );
      assert.equal(report.valid, false);
      assert.ok(report.errors.length >= 2);
    });

    it("collects warnings without failing validation", () => {
      const report = validateRequest(
        { requestId: "r1", industry: "HVAC", goal: "Leads", budget: 500 },
        [{ field: "requestId", required: true }],
        [
          () => [
            {
              code: "WARN",
              message: "Low budget.",
              severity: "warning",
            },
          ],
        ],
      );
      assert.equal(report.valid, true);
      assert.equal(report.warnings.length, 1);
    });
  });

  describe("Department Context", () => {
    it("preserves metadata immutably", () => {
      const context = buildDepartmentContext({
        requestId: "req-001",
        request: {
          industry: "Dental",
          goal: "Bookings",
          budget: 3000,
          services: ["chatbot"],
          metadata: {
            businessName: "Bright Smile",
            country: "Canada",
          },
        },
      });

      assert.equal(context.metadata.businessName, "Bright Smile");
      assert.equal(context.request.metadata?.businessName, "Bright Smile");
      assert.ok(context.knowledge);
      assert.ok(context.memory);
      assert.ok(Object.isFrozen(context));
    });
  });

  describe("BaseDepartment Lifecycle", () => {
    it("runs full lifecycle successfully", async () => {
      const dept = new MockDepartment();
      const result = await dept.run({
        requestId: "req-hvac",
        industry: "HVAC",
        goal: "Generate leads",
        budget: 3500,
        services: ["chatbot"],
        metadata: { businessName: "Arctic Air" },
      });

      assert.equal(result.success, true);
      assert.equal(result.status, "complete");
      assert.equal(result.result?.industryId, "hvac");
      assert.ok(result.summary?.headline);
      assert.equal(result.telemetry.success, true);
      assert.equal(result.telemetry.lifecycleSteps.length, 3);
      assert.ok(result.telemetry.totalDurationMs >= 0);
    });

    it("returns partial status when warnings exist", async () => {
      const dept = new MockDepartment();
      const result = await dept.run({
        requestId: "req-low",
        industry: "HVAC",
        goal: "Leads",
        budget: 500,
        services: ["chatbot"],
      });

      assert.equal(result.success, true);
      assert.equal(result.status, "partial");
      assert.ok(result.validation.warnings.length > 0);
    });

    it("fails on validation errors", async () => {
      const dept = new MockDepartment();
      const result = await dept.run({
        requestId: "",
        industry: "",
        goal: "",
        budget: 0,
        services: [],
      });

      assert.equal(result.success, false);
      assert.equal(result.status, "failed");
      assert.ok(result.error instanceof ValidationError);
    });

    it("fails on execution errors", async () => {
      const dept = new MockDepartment();
      const result = await dept.run({
        requestId: "req-fail",
        industry: "HVAC",
        goal: "Leads",
        budget: 3000,
        services: ["chatbot"],
        failExecution: true,
      });

      assert.equal(result.success, false);
      assert.ok(result.error instanceof ExecutionError);
      assert.equal(result.telemetry.failures.length, 1);
    });
  });

  describe("Telemetry", () => {
    it("tracks planner timings", async () => {
      const collector = new TelemetryCollector("test-dept", "req-001");
      await collector.trackPlanner("planner-a", async () => {
        return "done";
      });
      const telemetry = collector.complete(true);
      assert.equal(telemetry.plannerTimings.length, 1);
      assert.equal(telemetry.plannerTimings[0].step, "planner-a");
      assert.equal(telemetry.plannerTimings[0].success, true);
    });
  });

  describe("Department Registry", () => {
    it("registers, resolves, discovers, and unregisters", () => {
      const registry = new DepartmentRegistry();
      const dept = new MockDepartment();

      registry.register({
        department: dept,
        tags: ["mock", "test"],
        supportedTaskTypes: ["mock_task"],
        priority: 5,
      });

      assert.equal(registry.has("mock-department"), true);
      assert.equal(registry.resolve("mock-department")?.id, "mock-department");
      assert.equal(registry.discover({ tag: "mock" }).length, 1);
      assert.equal(registry.discover({ taskType: "mock_task" }).length, 1);
      assert.equal(registry.list().length, 1);

      assert.equal(registry.unregister("mock-department"), true);
      assert.equal(registry.has("mock-department"), false);
    });

    it("singleton registry is accessible", () => {
      const registry = getDepartmentRegistry();
      registry.clear();
      registry.register({
        department: new MockDepartment(),
        tags: ["mock"],
        supportedTaskTypes: [],
        priority: 0,
      });
      assert.equal(registry.list().length, 1);
      registry.clear();
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
      const result = await runDepartmentLifecycle(dept, {
        requestId: "req-utils",
        industry: "Plumbing",
        goal: "Emergency leads",
        budget: 2800,
        services: ["receptionist"],
      });
      assert.equal(result.success, true);
      assert.equal(result.result?.industryId, "plumbing");
    });
  });

  describe("Future department compatibility", () => {
    it("supports custom request/result types for new departments", async () => {
      class VoiceDepartment extends BaseDepartment<
        { requestId: string; phoneGoal: string },
        { callFlow: string }
      > {
        readonly id = "voice-department";
        readonly name = "Voice Department";
        readonly description = "Plans voice agent call flows.";

        protected validateRequest(): ValidationReport {
          return emptyValidationReport();
        }

        protected createContextParams(req: {
          requestId: string;
          phoneGoal: string;
        }): BuildDepartmentContextParams {
          return {
            requestId: req.requestId,
            request: {
              industry: "general",
              goal: req.phoneGoal,
              budget: 0,
              services: ["receptionist"],
            },
          };
        }

        protected async executeDepartment(): Promise<{ callFlow: string }> {
          return { callFlow: "greeting → qualify → book" };
        }

        protected buildSummary(
          ctx: DepartmentContext,
          result: { callFlow: string },
        ): DepartmentSummary {
          return {
            departmentId: this.id,
            requestId: ctx.requestId,
            headline: result.callFlow,
            nextStep: "Configure voice agent.",
            warnings: [],
            confidence: "high",
          };
        }
      }

      const result = await new VoiceDepartment().run({
        requestId: "voice-001",
        phoneGoal: "Answer after-hours calls",
      });

      assert.equal(result.success, true);
      assert.equal(result.result?.callFlow, "greeting → qualify → book");
    });
  });
});

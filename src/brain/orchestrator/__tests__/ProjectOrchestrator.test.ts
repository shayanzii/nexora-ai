/**
 * Project Orchestrator tests — planning only, no agent execution.
 */
import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";

import type { CEOBusinessAnalysis } from "../../agents/ceo/CEOOutput";
import {
  CyclicDependencyError,
  OrchestratorValidationError,
  ProjectOrchestrator,
  TaskManager,
  TaskNotFoundError,
  TaskQueue,
  assignInitialTaskStatuses,
  createOrchestratorTask,
  formatDepartmentChain,
  getProjectOrchestrator,
  planTasks,
  resetProjectOrchestrator,
  selectDepartments,
  sortTasksByDependencies,
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
  estimatedTimeline: {
    minWeeks: 4,
    maxWeeks: 8,
    summary: "Multi-service delivery",
  },
  confidence: 0.85,
  followUpQuestions: ["What timeline are you targeting?"],
};

describe("Department selection", () => {
  it("selects sales, website, seo, automation, qa, and delivery for dental clinic services", () => {
    const departments = selectDepartments({
      analysis: dentalAnalysis,
      services: ["website", "seo", "chatbot"],
    });

    assert.deepEqual(departments, [
      "sales",
      "website",
      "seo",
      "automation",
      "qa",
      "delivery",
    ]);
  });

  it("always includes sales even when not explicitly recommended", () => {
    const departments = selectDepartments({
      analysis: {
        ...dentalAnalysis,
        recommendedDepartments: ["website"],
      },
      services: ["website"],
    });

    assert.ok(departments.includes("sales"));
  });
});

describe("Task creation and dependencies", () => {
  it("creates tasks with required fields", () => {
    const task = createOrchestratorTask({
      requestId: "req-1",
      department: "sales",
      title: "Discovery",
      description: "Run discovery",
      priority: "critical",
    });

    assert.equal(task.department, "sales");
    assert.equal(task.priority, "critical");
    assert.equal(task.status, "pending");
    assert.ok(task.id.includes("req-1"));
    assert.ok(task.createdAt);
  });

  it("plans website task depending on sales and qa depending on build tasks", () => {
    const departments = selectDepartments({
      analysis: dentalAnalysis,
      services: ["website", "seo", "chatbot"],
    });

    const tasks = planTasks({
      requestId: "req-dental",
      analysis: dentalAnalysis,
      departments,
    });

    const sales = tasks.find((task) => task.department === "sales");
    const website = tasks.find((task) => task.department === "website");
    const qa = tasks.find((task) => task.department === "qa");
    const delivery = tasks.find((task) => task.department === "delivery");

    assert.ok(sales);
    assert.ok(website);
    assert.ok(qa);
    assert.ok(delivery);

    assert.ok(website!.dependencies.includes(sales!.id));
    assert.ok(qa!.dependencies.includes(website!.id));
    assert.ok(delivery!.dependencies.includes(qa!.id));
  });
});

describe("Task scheduler", () => {
  it("sorts tasks by dependency order", () => {
    const tasks = planTasks({
      requestId: "req-sort",
      analysis: dentalAnalysis,
      departments: ["sales", "website", "seo", "automation", "qa", "delivery"],
    });

    const sorted = sortTasksByDependencies(tasks);
    const departments = sorted.map((task) => task.department);

    assert.equal(departments[0], "sales");
    assert.ok(departments.indexOf("website") < departments.indexOf("qa"));
    assert.ok(departments.indexOf("qa") < departments.indexOf("delivery"));
  });

  it("throws on cyclic dependencies", () => {
    const a = createOrchestratorTask({
      requestId: "cyclic",
      department: "a",
      title: "A",
      description: "A",
      dependencies: [],
    });
    const b = createOrchestratorTask({
      requestId: "cyclic",
      department: "b",
      title: "B",
      description: "B",
      dependencies: [a.id],
    });
    a.dependencies = [b.id];

    assert.throws(
      () => sortTasksByDependencies([a, b]),
      CyclicDependencyError,
    );
  });

  it("marks sales as ready and website as pending initially", () => {
    const tasks = assignInitialTaskStatuses(
      planTasks({
        requestId: "req-status",
        analysis: dentalAnalysis,
        departments: ["sales", "website", "qa", "delivery"],
      }),
    );

    const sales = tasks.find((task) => task.department === "sales");
    const website = tasks.find((task) => task.department === "website");

    assert.equal(sales?.status, "ready");
    assert.equal(website?.status, "pending");
  });
});

describe("TaskManager", () => {
  it("transitions tasks and unlocks dependents after completion", () => {
    const tasks = planTasks({
      requestId: "req-manager",
      analysis: dentalAnalysis,
      departments: ["sales", "website", "qa", "delivery"],
    });

    const manager = new TaskManager(tasks, () => {});
    const sales = manager.getTasks().find((task) => task.department === "sales");
    assert.ok(sales);

    manager.markCompleted(sales!.id);
    const website = manager.getTasks().find((task) => task.department === "website");
    assert.equal(website?.status, "ready");
  });

  it("throws when updating unknown task", () => {
    const manager = new TaskManager([], () => {});
    assert.throws(() => manager.updateStatus("missing", "failed"), TaskNotFoundError);
  });
});

describe("TaskQueue", () => {
  it("dequeues ready tasks in dependency order", () => {
    const tasks = assignInitialTaskStatuses(
      planTasks({
        requestId: "req-queue",
        analysis: dentalAnalysis,
        departments: ["sales", "website"],
      }),
    );

    const queue = new TaskQueue(tasks);
    const first = queue.dequeueReady();
    assert.equal(first?.department, "sales");
  });
});

describe("ProjectOrchestrator", () => {
  beforeEach(() => {
    resetProjectOrchestrator();
  });

  it("generates execution plan for dental clinic example", () => {
    const orchestrator = new ProjectOrchestrator(() => {});
    const plan = orchestrator.orchestrate({
      requestId: "dental-demo-001",
      analysis: dentalAnalysis,
      services: ["website", "seo", "chatbot"],
    });

    assert.equal(plan.business, "Smile Dental");
    assert.deepEqual(plan.departmentOrder, [
      "sales",
      "website",
      "seo",
      "automation",
      "qa",
      "delivery",
    ]);
    assert.equal(plan.tasks.length, 6);
    assert.ok(plan.estimatedTotalDuration > 0);
    assert.equal(plan.executionGraph.nodes.length, 6);
    assert.ok(plan.executionGraph.edges.length > 0);
    assert.match(plan.summary, /Smile Dental/);
    assert.equal(
      formatDepartmentChain(plan.departmentOrder),
      "Sales → Website → Seo → Automation → Qa → Delivery",
    );
  });

  it("validates required input fields", () => {
    const orchestrator = new ProjectOrchestrator(() => {});

    assert.throws(
      () =>
        orchestrator.orchestrate({
          requestId: "",
          analysis: dentalAnalysis,
        }),
      OrchestratorValidationError,
    );
  });

  it("exposes a default singleton orchestrator", () => {
    const a = getProjectOrchestrator();
    const b = getProjectOrchestrator();
    assert.equal(a, b);
  });
});

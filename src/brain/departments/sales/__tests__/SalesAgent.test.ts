/**
 * Sales Agent tests — first executable Brain department.
 */
import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";

import type { CEOBusinessAnalysis } from "../../../agents/ceo/CEOOutput";
import { ProjectOrchestrator } from "../../../orchestrator";
import {
  SalesAgent,
  SalesProposalError,
  SalesTaskNotFoundError,
  SalesValidationError,
  SalesWrongDepartmentError,
  analyzeRequirements,
  generateDiscoveryQuestions,
  generateSalesProposal,
  getSalesAgent,
  recommendServices,
  resetSalesAgent,
  resolveSalesTask,
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

function buildDentalPlan() {
  return new ProjectOrchestrator(() => {}).orchestrate({
    requestId: "sales-test-001",
    analysis: dentalAnalysis,
    services: ["website", "seo", "chatbot"],
  });
}

describe("Requirement analysis", () => {
  it("summarizes customer context and identifies missing information", () => {
    const plan = buildDentalPlan();
    const requirements = analyzeRequirements({
      analysis: dentalAnalysis,
      plan,
      context: {
        budget: 7000,
        country: "Canada",
        targetAudience: "Local dental patients",
        services: ["website", "seo", "chatbot"],
      },
    });

    assert.match(requirements.customerSummary, /Smile Dental/);
    assert.ok(requirements.businessGoals.length > 0);
    assert.ok(requirements.businessChallenges.length > 0);
    assert.ok(requirements.missingInformation.includes("timeline"));
    assert.ok(requirements.completenessScore > 0);
  });
});

describe("Discovery questions", () => {
  it("generates intelligent business discovery questions", () => {
    const plan = buildDentalPlan();
    const requirements = analyzeRequirements({ analysis: dentalAnalysis, plan });
    const questions = generateDiscoveryQuestions({
      analysis: dentalAnalysis,
      requirements,
      services: ["website", "seo", "chatbot"],
    });

    const text = questions.map((question) => question.question).join(" ");
    assert.match(text, /current website/i);
    assert.match(text, /online booking/i);
    assert.match(text, /target customer/i);
    assert.match(text, /different/i);
    assert.match(text, /Google Ads/i);
    assert.ok(questions.some((question) => question.question.includes("timeline")));
  });
});

describe("Service recommendation", () => {
  it("recommends only relevant services for dental clinic scope", () => {
    const plan = buildDentalPlan();
    const services = recommendServices({
      analysis: dentalAnalysis,
      plan,
      requestedServices: ["website", "seo", "chatbot"],
    });

    const ids = services.map((service) => service.serviceId);
    assert.ok(ids.includes("website"));
    assert.ok(ids.includes("seo"));
    assert.ok(ids.includes("ai-chatbot"));
    assert.ok(services.some((service) => service.priority === "primary"));
  });
});

describe("Proposal generation", () => {
  it("builds structured proposal sections", () => {
    const plan = buildDentalPlan();
    const requirements = analyzeRequirements({ analysis: dentalAnalysis, plan });
    const recommendedServices = recommendServices({
      analysis: dentalAnalysis,
      plan,
      requestedServices: ["website", "seo", "chatbot"],
    });

    const proposal = generateSalesProposal({
      analysis: dentalAnalysis,
      plan,
      requirements,
      recommendedServices,
    });

    assert.ok(proposal.executiveSummary.includes("Smile Dental"));
    assert.ok(proposal.businessChallenges.length > 0);
    assert.ok(proposal.recommendedServices.length > 0);
    assert.ok(proposal.expectedOutcomes.length > 0);
    assert.ok(proposal.implementationRoadmap.length >= 2);
    assert.ok(proposal.nextSteps.length > 0);
  });
});

describe("SalesAgent", () => {
  beforeEach(() => {
    resetSalesAgent();
  });

  it("executes sales task and returns SalesResult", () => {
    const plan = buildDentalPlan();
    const task = resolveSalesTask(plan);
    const agent = new SalesAgent(() => {});

    const result = agent.execute({
      task,
      analysis: dentalAnalysis,
      plan,
      context: {
        budget: 7000,
        country: "Canada",
        targetAudience: "Local dental patients",
        services: ["website", "seo", "chatbot"],
      },
    });

    assert.equal(result.taskId, task.id);
    assert.equal(result.requestId, plan.requestId);
    assert.match(result.customerSummary, /Smile Dental/);
    assert.ok(result.recommendedServices.length >= 3);
    assert.ok(result.discoveryQuestions.length >= 5);
    assert.ok(result.proposal.executiveSummary.includes("Smile Dental"));
    assert.ok(result.confidenceScore > 0);
  });

  it("rejects non-sales tasks", () => {
    const plan = buildDentalPlan();
    const websiteTask = plan.tasks.find((task) => task.department === "website");
    assert.ok(websiteTask);

    const agent = new SalesAgent(() => {});
    assert.throws(
      () =>
        agent.execute({
          task: websiteTask!,
          analysis: dentalAnalysis,
          plan,
        }),
      SalesWrongDepartmentError,
    );
  });

  it("throws when task is missing from plan", () => {
    const plan = buildDentalPlan();
    const task = resolveSalesTask(plan);

    const agent = new SalesAgent(() => {});
    assert.throws(
      () =>
        agent.execute({
          task: { ...task, id: "missing-task" },
          analysis: dentalAnalysis,
          plan,
        }),
      SalesTaskNotFoundError,
    );
  });

  it("validates required CEO analysis fields", () => {
    const plan = buildDentalPlan();
    const task = resolveSalesTask(plan);
    const agent = new SalesAgent(() => {});

    assert.throws(
      () =>
        agent.execute({
          task,
          analysis: { ...dentalAnalysis, business: "" },
          plan,
        }),
      SalesValidationError,
    );
  });

  it("exposes a default singleton agent", () => {
    const a = getSalesAgent();
    const b = getSalesAgent();
    assert.equal(a, b);
  });
});

describe("Error handling", () => {
  it("throws when resolving unknown sales task id", () => {
    const plan = buildDentalPlan();
    assert.throws(() => resolveSalesTask(plan, "unknown-id"), SalesTaskNotFoundError);
  });

  it("throws when no services can be recommended", () => {
    const plan = buildDentalPlan();
    const task = resolveSalesTask(plan);
    const minimalAnalysis: CEOBusinessAnalysis = {
      ...dentalAnalysis,
      business: "Minimal Co",
      goals: ["Improve operations"],
      requirements: [],
      recommendedDepartments: ["sales"],
      followUpQuestions: [],
    };
    const salesOnlyPlan = {
      ...plan,
      requestId: "sales-empty-001",
      departments: ["sales"],
      departmentOrder: ["sales"],
      tasks: [task],
    };

    const agent = new SalesAgent(() => {});
    assert.throws(
      () =>
        agent.execute({
          task,
          analysis: minimalAnalysis,
          plan: salesOnlyPlan,
        }),
      SalesProposalError,
    );
  });
});

/**
 * CEO Agent tests — mock LLM Gateway, no real API calls.
 */
import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";

import { LLMError } from "../../../llm/errors/llm-errors";
import type { LLMGateway } from "../../../llm/gateway/LLMGateway";
import {
  PromptEngine,
  PromptRegistry,
  resetPromptEngine,
  resetPromptRegistry,
  type PromptTemplate,
} from "../../../prompts";
import {
  CEOAgent,
  CEOOutputValidationError,
  buildDeterministicCEOAnalysis,
  buildCEOContext,
  generateFollowUpQuestions,
  parseCEOOutputFromJson,
  recommendDepartments,
  validateCEOOutput,
} from "../index";

const analysisPrompt: PromptTemplate = {
  id: "ceo.business-analysis",
  version: "1.0.0",
  department: "ceo",
  description: "CEO analysis test prompt",
  tags: ["ceo"],
  template:
    "Analyze {{company}} in {{industry}} with goal {{goal}} and budget {{budget}}.",
  requiredVariables: ["company", "industry", "goal", "budget"],
};

const validAnalysisJson = {
  business: "Nexora Dental",
  industry: "Dentist",
  goals: ["Increase booked appointments"],
  requirements: ["Launch conversion-focused website", "Add AI chatbot"],
  missingInformation: ["timeline"],
  recommendedDepartments: ["sales", "website"],
  estimatedComplexity: "medium",
  estimatedBudget: {
    min: 3000,
    max: 5000,
    currency: "CAD",
    rationale: "Website plus chatbot scope",
  },
  estimatedTimeline: {
    minWeeks: 3,
    maxWeeks: 5,
    summary: "Standard multi-service delivery window",
  },
  confidence: 0.88,
};

function createMockGateway(content: string | Error): LLMGateway {
  return {
    generate: async () => {
      if (content instanceof Error) {
        throw content;
      }

      return {
        id: "mock-response",
        provider: "openai",
        model: "gpt-5-mini",
        content,
        finishReason: "stop",
        usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
      };
    },
    stream: async function* () {
      yield { id: "mock", delta: "", done: true };
    },
    healthCheck: async () => ({
      provider: "openai",
      healthy: true,
      checkedAt: new Date().toISOString(),
    }),
    config: {} as LLMGateway["config"],
  } as LLMGateway;
}

function createTestAgent(gateway: LLMGateway): CEOAgent {
  const registry = new PromptRegistry();
  registry.register({ template: analysisPrompt });
  const promptEngine = new PromptEngine(registry);

  return new CEOAgent({
    gateway,
    promptEngine,
    config: { fallbackOnLlmFailure: false },
  });
}

const sampleRequest = {
  requestId: "ceo-test-1",
  company: "Nexora Dental",
  industry: "dentist",
  goal: "Increase booked appointments",
  budget: 5000,
  services: ["website", "chatbot"],
  metadata: {
    country: "Canada",
    targetAudience: "Local families",
  },
};

describe("CEO output validation", () => {
  it("validates a complete CEO business analysis object", () => {
    const validated = validateCEOOutput(validAnalysisJson);
    assert.equal(validated.business, "Nexora Dental");
    assert.equal(validated.estimatedComplexity, "medium");
    assert.equal(validated.confidence, 0.88);
  });

  it("parses JSON from LLM content with optional code fences", () => {
    const parsed = parseCEOOutputFromJson(
      "```json\n" + JSON.stringify(validAnalysisJson) + "\n```",
    );
    assert.equal(parsed.industry, "Dentist");
  });

  it("rejects invalid schema values", () => {
    assert.throws(
      () =>
        validateCEOOutput({
          ...validAnalysisJson,
          confidence: 1.5,
        }),
      CEOOutputValidationError,
    );
  });
});

describe("CEO planner", () => {
  it("recommends sales and website departments for website projects", () => {
    const context = buildCEOContext(sampleRequest);
    const departments = recommendDepartments(context);

    assert.ok(departments.includes("sales"));
    assert.ok(departments.includes("website"));
  });

  it("builds deterministic business analysis", () => {
    const analysis = buildDeterministicCEOAnalysis(buildCEOContext(sampleRequest));

    assert.equal(analysis.business, "Nexora Dental");
    assert.ok(analysis.requirements.length > 0);
    assert.ok(analysis.estimatedBudget.max >= analysis.estimatedBudget.min);
    assert.ok(analysis.followUpQuestions.length >= 0);
  });
});

describe("CEO question generation", () => {
  it("generates follow-up questions for missing fields", () => {
    const context = buildCEOContext({
      industry: "dentist",
      goal: "Get more leads",
      budget: 3000,
    });

    const questions = generateFollowUpQuestions(
      ["timeline", "services", "company"],
      context,
    );

    assert.ok(questions.some((question) => /timeline/i.test(question)));
    assert.ok(questions.some((question) => /services/i.test(question)));
  });
});

describe("CEOAgent", () => {
  beforeEach(() => {
    resetPromptRegistry();
    resetPromptEngine();
  });

  it("returns structured business analysis from mocked gateway", async () => {
    const agent = createTestAgent(
      createMockGateway(JSON.stringify(validAnalysisJson)),
    );

    const analysis = await agent.analyze(sampleRequest);

    assert.equal(analysis.business, "Nexora Dental");
    assert.deepEqual(analysis.recommendedDepartments, ["sales", "website"]);
    assert.equal(analysis.estimatedComplexity, "medium");
    assert.ok(analysis.followUpQuestions.length > 0);
  });

  it("falls back to deterministic analysis when configured", async () => {
    const registry = new PromptRegistry();
    registry.register({ template: analysisPrompt });
    const promptEngine = new PromptEngine(registry);

    const agent = new CEOAgent({
      gateway: createMockGateway(new LLMError("Gateway unavailable", {
        code: "GENERATION_FAILED",
        retryable: false,
      })),
      promptEngine,
      config: { fallbackOnLlmFailure: true },
    });

    const analysis = await agent.analyze(sampleRequest);
    assert.equal(analysis.business, "Nexora Dental");
    assert.ok(analysis.recommendedDepartments.includes("website"));
  });

  it("propagates gateway failures when fallback is disabled", async () => {
    const agent = createTestAgent(
      createMockGateway(new LLMError("Gateway unavailable", {
        code: "GENERATION_FAILED",
        retryable: false,
      })),
    );

    await assert.rejects(() => agent.analyze(sampleRequest));
  });

  it("handles invalid LLM JSON when fallback is enabled", async () => {
    const registry = new PromptRegistry();
    registry.register({ template: analysisPrompt });
    const promptEngine = new PromptEngine(registry);

    const agent = new CEOAgent({
      gateway: createMockGateway("{ invalid json"),
      promptEngine,
      config: { fallbackOnLlmFailure: true },
    });

    const analysis = await agent.analyze(sampleRequest);
    assert.equal(analysis.business, "Nexora Dental");
  });
});

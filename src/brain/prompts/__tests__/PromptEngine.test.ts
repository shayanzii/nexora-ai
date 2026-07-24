/**
 * Prompt Engine tests.
 */
import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";

import {
  PromptEngine,
  InvalidPromptIdError,
  PromptNotFoundError,
  PromptRenderError,
  PromptRegistry,
  comparePromptVersions,
  extractTemplateVariables,
  formatPromptVersion,
  parsePromptVersion,
  renderPromptTemplate,
  resetPromptEngine,
  resetPromptRegistry,
  validatePromptTemplate,
  type PromptTemplate,
} from "../index";

const sampleVariables = {
  company: "Nexora Dental",
  industry: "Dentist",
  goal: "Increase booked appointments",
  budget: "$8,000 CAD",
};

const versionedTemplateV1: PromptTemplate = {
  id: "test.versioned",
  version: "1.0.0",
  department: "test",
  description: "Version one",
  tags: ["test"],
  template: "Hello {{company}} from v1",
  requiredVariables: ["company"],
};

const versionedTemplateV2: PromptTemplate = {
  ...versionedTemplateV1,
  version: "1.1.0",
  description: "Version two",
  template: "Hello {{company}} from v2",
};

describe("Prompt rendering", () => {
  it("replaces {{variable}} placeholders", () => {
    const rendered = renderPromptTemplate(
      "Company: {{company}} | Industry: {{industry}} | Goal: {{goal}} | Budget: {{budget}}",
      sampleVariables,
    );

    assert.match(rendered, /Nexora Dental/);
    assert.match(rendered, /Dentist/);
    assert.match(rendered, /Increase booked appointments/);
    assert.match(rendered, /\$8,000 CAD/);
  });

  it("extracts variable names from templates", () => {
    const variables = extractTemplateVariables(
      "{{company}} in {{industry}} with {{ goal }} and {{budget}}",
    );
    assert.deepEqual(variables.sort(), ["budget", "company", "goal", "industry"]);
  });
});

describe("Prompt validation", () => {
  it("validates required variables are referenced", () => {
    const result = validatePromptTemplate({
      id: "test.invalid",
      version: "1.0.0",
      department: "test",
      description: "Invalid template",
      tags: ["test"],
      template: "No variables here",
      requiredVariables: ["company"],
    });

    assert.equal(result.valid, false);
    assert.match(result.errors.join(" "), /Required variable 'company'/);
  });

  it("rejects missing required variables at render time", () => {
    const engine = new PromptEngine(new PromptRegistry());
    engine.register(versionedTemplateV1);

    assert.throws(
      () => engine.render("test.versioned", {}),
      PromptRenderError,
    );
  });
});

describe("Prompt versioning", () => {
  it("parses, formats, and compares semantic versions", () => {
    const parts = parsePromptVersion("1.2.3");
    assert.equal(formatPromptVersion(parts), "1.2.3");
    assert.ok(comparePromptVersions(parsePromptVersion("1.1.0"), parsePromptVersion("1.0.0")) > 0);
  });
});

describe("PromptRegistry", () => {
  let registry: PromptRegistry;

  beforeEach(() => {
    registry = new PromptRegistry();
  });

  it("registers, looks up, and resolves latest version", () => {
    registry.register({ template: versionedTemplateV1 });
    registry.register({ template: versionedTemplateV2 });

    assert.equal(registry.lookup("test.versioned", "1.0.0")?.description, "Version one");
    assert.equal(registry.lookupLatest("test.versioned")?.version, "1.1.0");
  });

  it("discovers prompts by department and tag", () => {
    registry.register({ template: versionedTemplateV1 });

    assert.equal(registry.discover({ department: "test" }).length, 1);
    assert.equal(registry.discover({ tag: "test" }).length, 1);
    assert.equal(registry.discover({ department: "missing" }).length, 0);
  });
});

describe("PromptEngine", () => {
  beforeEach(() => {
    resetPromptRegistry();
    resetPromptEngine();
  });

  it("renders CEO business analysis prompt templates", () => {
    const engine = new PromptEngine(new PromptRegistry());
    engine.register({
      id: "ceo.business-analysis",
      version: "1.0.0",
      department: "ceo",
      description: "Test",
      tags: ["ceo"],
      template: "Company: {{company}} Industry: {{industry}} Goal: {{goal}} Budget: {{budget}}",
      requiredVariables: ["company", "industry", "goal", "budget"],
    });

    const rendered = engine.render("ceo.business-analysis", sampleVariables);
    assert.match(rendered.content, /Nexora Dental/);
    assert.equal(rendered.department, "ceo");
  });

  it("throws for invalid prompt ids", () => {
    const engine = new PromptEngine(new PromptRegistry());

    assert.throws(
      () => engine.get("INVALID ID"),
      InvalidPromptIdError,
    );

    assert.throws(
      () => engine.get("missing.prompt"),
      PromptNotFoundError,
    );
  });

  it("lists versions for a prompt id", () => {
    const engine = new PromptEngine(new PromptRegistry());
    engine.register(versionedTemplateV1);
    engine.register(versionedTemplateV2);

    const versions = engine.listVersions("test.versioned").map((template) => template.version);
    assert.deepEqual(versions, ["1.1.0", "1.0.0"]);
  });

  it("rejects invalid templates at registration", () => {
    const engine = new PromptEngine(new PromptRegistry());

    assert.throws(
      () =>
        engine.register({
          ...versionedTemplateV1,
          id: "bad id",
        }),
      InvalidPromptIdError,
    );
  });
});

describe("Built-in prompt templates", () => {
  beforeEach(() => {
    resetPromptRegistry();
    resetPromptEngine();
  });

  it("registers built-in templates through module bootstrap", async () => {
    const promptModule = await import("../index");
    promptModule.resetPromptRegistry();
    promptModule.resetPromptEngine();
    promptModule.createPromptEngine();

    const engine = promptModule.getPromptEngine();
    assert.equal(engine.has("website.seo"), true);
    assert.equal(engine.has("sales.proposal"), true);

    const rendered = engine.render("website.seo", {
      ...sampleVariables,
    });
    assert.match(rendered.content, /SEO strategist/);
  });
});

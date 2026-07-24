/**
 * Website Generator — aggregation engine tests.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildDepartmentContext } from "../../../sdk";
import type { ProjectRequest } from "../../../types/project";
import { BrandAnalyzer } from "../analyzers/BrandAnalyzer";
import { WebsiteGenerator, type WebsiteGeneratorInput } from "../generator/WebsiteGenerator";
import { InputBuilder } from "../input-builder";
import { createWebsitePlannerOutputs } from "../planner-outputs";
import { ContentPlanner } from "../planners/ContentPlanner";
import { InformationArchitecturePlanner } from "../planners/InformationArchitecturePlanner";
import { SEOPlanner } from "../planners/SEOPlanner";
import { UserJourneyPlanner } from "../planners/UserJourneyPlanner";
import { WebsiteDepartment } from "../website-department";
import type { WebsiteDepartmentRequest } from "../schema";

function projectRequest(overrides: Partial<ProjectRequest> = {}): ProjectRequest {
  return {
    industry: "HVAC",
    goal: "Generate leads",
    budget: 4000,
    services: ["website"],
    metadata: {
      businessName: "Summit Services",
      country: "Canada",
      targetAudience: "Local homeowners",
    },
    ...overrides,
  };
}

function generatorInput(request: ProjectRequest, requestId = "req-generator-test"): WebsiteGeneratorInput {
  const context = buildDepartmentContext({ requestId, request });
  const brandResult = new BrandAnalyzer().analyze({ request, context });
  assert.equal(brandResult.success, true);

  const journeyResult = new UserJourneyPlanner().plan({
    request,
    brandIdentity: brandResult.data!,
    context,
  });
  assert.equal(journeyResult.success, true);

  const architectureResult = new InformationArchitecturePlanner().plan({
    request,
    brandIdentity: brandResult.data!,
    userJourney: journeyResult.data!,
    context,
  });
  assert.equal(architectureResult.success, true);

  const seoResult = new SEOPlanner().plan({
    request,
    brandIdentity: brandResult.data!,
    userJourney: journeyResult.data!,
    informationArchitecture: architectureResult.data!,
    context,
  });
  assert.equal(seoResult.success, true);

  const contentResult = new ContentPlanner().plan({
    request,
    brandIdentity: brandResult.data!,
    userJourney: journeyResult.data!,
    informationArchitecture: architectureResult.data!,
    seoPlan: seoResult.data!,
    context,
  });
  assert.equal(contentResult.success, true);

  const websiteRequest: WebsiteDepartmentRequest = {
    requestId,
    clientName: (request.metadata?.businessName as string | undefined) ?? "Summit Services",
    industry: request.industry,
    country: (request.metadata?.country as string | undefined) ?? "Canada",
    goals: [request.goal],
    targetAudience: (request.metadata?.targetAudience as string | undefined) ?? "Local customers",
    services: [...request.services],
    budget: request.budget,
    regulated: false,
  };

  const department = new WebsiteDepartment();
  const departmentContext = department.buildContext(websiteRequest);
  const executionInput = InputBuilder.buildExecutionInput(departmentContext, websiteRequest);

  return {
    input: executionInput,
    brandIdentity: brandResult.data!,
    userJourney: journeyResult.data!,
    informationArchitecture: architectureResult.data!,
    seoPlan: seoResult.data!,
    contentPlan: contentResult.data!,
  };
}

describe("WebsiteGenerator", () => {
  it("exposes stable generator metadata", () => {
    const generator = new WebsiteGenerator();
    assert.equal(generator.id, "website-generator");
    assert.equal(generator.version, "1.0.0");
  });

  it("generates a restaurant website blueprint with required sections", () => {
    const blueprint = new WebsiteGenerator().generate(
      generatorInput(
        projectRequest({
          industry: "Restaurant",
          goal: "Increase reservations",
          metadata: { businessName: "Bistro Nova", country: "Canada", targetAudience: "Local diners" },
        }),
      ),
    );

    assert.equal(blueprint.siteMetadata.industry, "Restaurant");
    assert.equal(blueprint.siteMetadata.businessName, "Bistro Nova");
    assert.ok(blueprint.navigation.header.length >= 5);
    assert.ok(blueprint.pages.some((page) => page.slug === "menu"));
    assert.ok(blueprint.pageContent.menu);
    assert.ok(blueprint.seo.primaryKeywords.length > 0);
    assert.ok(blueprint.components.includes("MenuTabs"));
    assert.ok(blueprint.forms.some((form) => form.slug === "reservations"));
    assert.ok(blueprint.ctaLocations.some((cta) => cta.scope === "site"));
    assert.ok(blueprint.footer.legalPageSlugs.includes("privacy"));
    assert.equal(blueprint.blogStrategy.enabled, false);
    assert.ok(blueprint.analyticsRecommendations.length >= 5);
  });

  it("generates a dentist website blueprint with trust-focused content", () => {
    const blueprint = new WebsiteGenerator().generate(
      generatorInput(projectRequest({ industry: "Dentist", goal: "Book more appointments" })),
    );

    assert.ok(blueprint.pages.some((page) => page.slug === "book-appointment"));
    const home = blueprint.pages.find((page) => page.slug === "home");
    assert.ok(home);
    assert.ok(home.content.hero.headline.includes("Gentle Dental Care"));
    assert.ok(home.content.trustSignals.length > 0);
    assert.ok(blueprint.forms.some((form) => form.formType === "booking"));
  });

  it("generates a law firm website blueprint with consultation focus", () => {
    const blueprint = new WebsiteGenerator().generate(
      generatorInput(
        projectRequest({ industry: "Law Firm", goal: "Generate consultation requests" }),
      ),
    );

    assert.ok(blueprint.pages.some((page) => page.slug === "consultation"));
    assert.ok(blueprint.pages.some((page) => page.slug === "attorneys"));
    assert.equal(blueprint.blogStrategy.enabled, true);
    assert.ok(blueprint.blogStrategy.recommendedTopics.length > 0);
  });

  it("falls back to generic blueprint for unknown industries", () => {
    const blueprint = new WebsiteGenerator().generate(
      generatorInput(projectRequest({ industry: "Real Estate", goal: "Capture seller leads" })),
    );

    assert.deepEqual(
      blueprint.pages.map((page) => page.slug),
      ["home", "about", "services", "testimonials", "contact", "quote-request"],
    );
    assert.ok(blueprint.forms.some((form) => form.formType === "quote"));
  });

  it("includes complete page fields on every blueprint page", () => {
    const blueprint = new WebsiteGenerator().generate(
      generatorInput(projectRequest({ industry: "Restaurant" })),
    );

    for (const page of blueprint.pages) {
      assert.ok(page.slug.length > 0);
      assert.ok(page.title.length > 0);
      assert.ok(page.sections.length > 0);
      assert.ok(page.components.length > 0);
      assert.ok(page.seo.title.length > 0);
      assert.ok(page.content.headline.length > 0);
      assert.ok(page.cta.label.length > 0);
      assert.ok(page.priority.length > 0);
      assert.deepEqual(blueprint.pageContent[page.slug], page.content);
    }
  });

  it("returns deterministic output for identical inputs", () => {
    const params = generatorInput(projectRequest({ industry: "Dentist" }));
    const generator = new WebsiteGenerator();
    const first = generator.generate(params);
    const second = generator.generate(params);

    assert.deepEqual(first, second);
  });

  it("integrates into website planner outputs", () => {
    const department = new WebsiteDepartment();
    const request: WebsiteDepartmentRequest = {
      requestId: "req-blueprint-planner-001",
      clientName: "Bistro Nova",
      industry: "Restaurant",
      country: "Canada",
      goals: ["Increase reservations"],
      targetAudience: "Local diners",
      services: ["website"],
      budget: 3500,
      timeline: "6 weeks",
      regulated: false,
    };
    const context = department.buildContext(request);
    const executionInput = InputBuilder.buildExecutionInput(context, request);
    const outputs = createWebsitePlannerOutputs(executionInput);

    assert.ok(outputs.websiteBlueprint);
    assert.equal(outputs.websiteBlueprint.siteMetadata.businessName, "Bistro Nova");
    assert.ok(outputs.websiteBlueprint.pages.length >= 6);
  });

  it("integrates through WebsiteDepartment lifecycle execution", async () => {
    const department = new WebsiteDepartment();
    const request: WebsiteDepartmentRequest = {
      requestId: "req-blueprint-lifecycle-001",
      clientName: "Smile Dental",
      industry: "Dentist",
      country: "Canada",
      goals: ["Book more appointments"],
      targetAudience: "Families",
      services: ["website"],
      budget: 5000,
      timeline: "8 weeks",
      regulated: true,
    };
    const result = await department.runWebsitePlan(request);

    assert.equal(result.status, "complete");
    assert.ok(result.websitePlan?.websiteBlueprint);
    assert.equal(result.websitePlan.websiteBlueprint.siteMetadata.industry, "Dentist");
    assert.ok(result.websitePlan.websiteBlueprint.components.length > 0);
    assert.ok(result.stepsExecuted.includes("website-generator"));
    assert.ok(result.websitePlan.assumptions[0]?.includes("blueprint"));
    assert.ok(result.websitePlan.analyticsRequirements.length >= 5);
  });
});

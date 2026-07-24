/**
 * Content Planner — rule-based engine tests.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildDepartmentContext } from "../../../sdk";
import type { ProjectRequest } from "../../../types/project";
import { BrandAnalyzer } from "../analyzers/BrandAnalyzer";
import { InputBuilder } from "../input-builder";
import { createWebsitePlannerOutputs } from "../planner-outputs";
import { ContentPlanner, type ContentPlannerParams } from "../planners/ContentPlanner";
import { mapPlannerContentPlanToPlan } from "../planners/content-plan-mapper";
import {
  DENTIST_CONTENT_STRATEGY,
  GENERIC_CONTENT_STRATEGY,
  LAW_FIRM_CONTENT_STRATEGY,
  RESTAURANT_CONTENT_STRATEGY,
  resolveContentStrategy,
} from "../planners/content-strategy";
import { InformationArchitecturePlanner } from "../planners/InformationArchitecturePlanner";
import { mapPlannerInformationArchitectureToPlan } from "../planners/information-architecture-mapper";
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

function plannerParams(request: ProjectRequest): ContentPlannerParams {
  const context = buildDepartmentContext({
    requestId: "req-content-test",
    request,
  });
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

  return {
    request,
    context,
    brandIdentity: brandResult.data!,
    userJourney: journeyResult.data!,
    informationArchitecture: architectureResult.data!,
    seoPlan: seoResult.data!,
  };
}

describe("ContentPlanner", () => {
  it("exposes stable planner metadata", () => {
    const planner = new ContentPlanner();
    assert.equal(planner.id, "content-planner");
    assert.equal(planner.version, "1.0.0");
  });

  it("resolves industry content strategies", () => {
    assert.equal(resolveContentStrategy("restaurant"), RESTAURANT_CONTENT_STRATEGY);
    assert.equal(resolveContentStrategy("dentist"), DENTIST_CONTENT_STRATEGY);
    assert.equal(resolveContentStrategy("dental"), DENTIST_CONTENT_STRATEGY);
    assert.equal(resolveContentStrategy("law-firm"), LAW_FIRM_CONTENT_STRATEGY);
    assert.equal(resolveContentStrategy("unknown"), GENERIC_CONTENT_STRATEGY);
  });

  it("plans menu-focused restaurant content", () => {
    const result = new ContentPlanner().plan(
      plannerParams(
        projectRequest({
          industry: "Restaurant",
          goal: "Increase reservations",
          metadata: { businessName: "Bistro Nova", country: "Canada" },
        }),
      ),
    );

    assert.equal(result.success, true);
    const menuPage = result.data!.pages.find((page) => page.slug === "menu");
    assert.ok(menuPage);
    assert.ok(menuPage.headline.includes("Menu"));
    assert.ok(menuPage.serviceHighlights.some((item) => item.includes("Appetizers")));
    assert.ok(menuPage.sections.some((section) => section.sectionName === "Menu Categories"));
    assert.equal(menuPage.cta, "Reserve a Table");
  });

  it("plans trust-focused dentist content", () => {
    const result = new ContentPlanner().plan(
      plannerParams(projectRequest({ industry: "Dentist", goal: "Book more appointments" })),
    );

    assert.equal(result.success, true);
    const home = result.data!.pages.find((page) => page.slug === "home");
    const booking = result.data!.pages.find((page) => page.slug === "book-appointment");

    assert.ok(home);
    assert.ok(home.hero.headline.includes("Gentle Dental Care"));
    assert.ok(home.trustSignals.some((signal) => signal.includes("Licensed")));
    assert.ok(booking);
    assert.equal(booking.cta, "Book Appointment");
    assert.ok(booking.sections.some((section) => section.sectionName === "Appointment Form"));
  });

  it("plans authority-focused law firm content", () => {
    const result = new ContentPlanner().plan(
      plannerParams(
        projectRequest({ industry: "Law Firm", goal: "Generate consultation requests" }),
      ),
    );

    assert.equal(result.success, true);
    const consultation = result.data!.pages.find((page) => page.slug === "consultation");
    const attorneys = result.data!.pages.find((page) => page.slug === "attorneys");

    assert.ok(consultation);
    assert.ok(consultation.headline.includes("Consultation"));
    assert.ok(consultation.faq.some((item) => item.includes("confidential")));
    assert.ok(attorneys);
    assert.ok(attorneys.headline.includes("Attorney Profiles"));
  });

  it("falls back to generic business content for unknown industries", () => {
    const result = new ContentPlanner().plan(
      plannerParams(projectRequest({ industry: "Real Estate", goal: "Capture seller leads" })),
    );

    assert.equal(result.success, true);
    assert.deepEqual(result.data?.pages.map((page) => page.slug), [
      "home",
      "about",
      "services",
      "testimonials",
      "contact",
      "quote-request",
    ]);
    assert.ok(result.data!.pages[0]?.headline.includes("Professional Real Estate Services"));
  });

  it("includes complete page content metadata on every page", () => {
    const result = new ContentPlanner().plan(
      plannerParams(projectRequest({ industry: "Restaurant" })),
    );

    assert.equal(result.success, true);

    for (const page of result.data!.pages) {
      assert.ok(page.hero.headline.length > 0);
      assert.ok(page.hero.subheadline.length > 0);
      assert.ok(page.hero.cta.length > 0);
      assert.ok(page.headline.length > 0);
      assert.ok(page.subheadline.length > 0);
      assert.ok(page.cta.length > 0);
      assert.ok(page.sections.length > 0);
      assert.ok(page.faq.length > 0);
      assert.ok(page.trustSignals.length > 0);
      assert.ok(page.testimonials.length > 0);
      assert.ok(page.serviceHighlights.length > 0);
      assert.ok(page.contactStrategy.length > 0);

      for (const section of page.sections) {
        assert.ok(section.sectionName.length > 0);
        assert.ok(section.purpose.length > 0);
        assert.ok(section.contentGuidelines.length > 0);
        assert.ok(section.recommendedComponents.length > 0);
      }
    }
  });

  it("returns deterministic output for identical inputs", () => {
    const params = plannerParams(projectRequest({ industry: "Dentist" }));
    const planner = new ContentPlanner();
    const first = planner.plan(params);
    const second = planner.plan(params);

    assert.equal(first.success, true);
    assert.equal(second.success, true);
    assert.deepEqual(first.data, second.data);
  });

  it("maps planner output into WebsitePlan page content fields", () => {
    const department = new WebsiteDepartment();
    const request: WebsiteDepartmentRequest = {
      requestId: "req-content-map-001",
      clientName: "Harbor Bistro",
      industry: "Restaurant",
      country: "Canada",
      goals: ["Increase reservations"],
      targetAudience: "Local diners",
      services: ["website"],
      budget: 3500,
      regulated: false,
    };
    const context = department.buildContext(request);
    const executionInput = InputBuilder.buildExecutionInput(context, request);
    const params = plannerParams(
      projectRequest({
        industry: "Restaurant",
        metadata: { businessName: "Harbor Bistro", country: "Canada" },
      }),
    );
    const content = new ContentPlanner().plan(params);
    const architecture = mapPlannerInformationArchitectureToPlan(
      params.informationArchitecture,
      executionInput,
      params.brandIdentity,
      params.userJourney,
    );

    assert.equal(content.success, true);
    const mapped = mapPlannerContentPlanToPlan(
      content.data!,
      executionInput,
      params.informationArchitecture,
      architecture.pages,
    );

    const menuPage = mapped.pages.find((page) => page.id === "page-menu");
    assert.ok(menuPage);
    assert.ok(menuPage.sections.some((section) => section.name === "Hero"));
    assert.ok(menuPage.contentRequirements.length > 0);
    assert.ok(mapped.leadGenerationStrategy.capturePoints.length >= 2);
    assert.notEqual(
      mapped.leadGenerationStrategy.qualificationFlow,
      "Route leads to CRM or email notification workflow.",
    );
  });

  it("integrates ContentPlanner into website planner outputs", () => {
    const department = new WebsiteDepartment();
    const request: WebsiteDepartmentRequest = {
      requestId: "req-content-planner-001",
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

    const menuPage = outputs.pages.find((page) => page.id === "page-menu");
    assert.ok(menuPage);
    assert.ok(menuPage.sections.length >= 2);
    assert.ok(menuPage.contentRequirements.some((req) => req.topic === "Menu Categories"));
    assert.ok(outputs.leadGenerationStrategy.capturePoints.length >= 2);
  });

  it("integrates through WebsiteDepartment lifecycle execution", async () => {
    const department = new WebsiteDepartment();
    const request: WebsiteDepartmentRequest = {
      requestId: "req-content-lifecycle-001",
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
    assert.ok(result.websitePlan?.pages.some((page) => page.id === "page-book-appointment"));
    assert.ok(
      result.websitePlan?.pages
        .find((page) => page.id === "page-home")
        ?.contentRequirements.some((req) => req.notes.includes("Components:")),
    );
    assert.ok(result.websitePlan?.leadGenerationStrategy.estimatedConversionPoints >= 2);
  });
});

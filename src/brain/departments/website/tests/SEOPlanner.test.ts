/**
 * SEO Planner — rule-based engine tests.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildDepartmentContext } from "../../../sdk";
import type { ProjectRequest } from "../../../types/project";
import { BrandAnalyzer } from "../analyzers/BrandAnalyzer";
import { InputBuilder } from "../input-builder";
import { createWebsitePlannerOutputs } from "../planner-outputs";
import { InformationArchitecturePlanner } from "../planners/InformationArchitecturePlanner";
import { mapPlannerInformationArchitectureToPlan } from "../planners/information-architecture-mapper";
import { SEOPlanner, type SEOPlannerParams } from "../planners/SEOPlanner";
import { mapPlannerSeoPlanToPlan } from "../planners/seo-plan-mapper";
import {
  DENTIST_SEO_STRATEGY,
  GENERIC_SEO_STRATEGY,
  LAW_FIRM_SEO_STRATEGY,
  RESTAURANT_SEO_STRATEGY,
  resolveSeoStrategy,
} from "../planners/seo-strategy";
import { buildCanonicalUrl } from "../planners/seo-utils";
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

function plannerParams(request: ProjectRequest): SEOPlannerParams {
  const context = buildDepartmentContext({
    requestId: "req-seo-test",
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

  return {
    request,
    context,
    brandIdentity: brandResult.data!,
    userJourney: journeyResult.data!,
    informationArchitecture: architectureResult.data!,
  };
}

describe("SEOPlanner", () => {
  it("exposes stable planner metadata", () => {
    const planner = new SEOPlanner();
    assert.equal(planner.id, "seo-planner");
    assert.equal(planner.version, "1.0.0");
  });

  it("resolves industry SEO strategies", () => {
    assert.equal(resolveSeoStrategy("restaurant"), RESTAURANT_SEO_STRATEGY);
    assert.equal(resolveSeoStrategy("dentist"), DENTIST_SEO_STRATEGY);
    assert.equal(resolveSeoStrategy("dental"), DENTIST_SEO_STRATEGY);
    assert.equal(resolveSeoStrategy("law-firm"), LAW_FIRM_SEO_STRATEGY);
    assert.equal(resolveSeoStrategy("unknown"), GENERIC_SEO_STRATEGY);
  });

  it("plans restaurant SEO for specified pages", () => {
    const result = new SEOPlanner().plan(
      plannerParams(
        projectRequest({
          industry: "Restaurant",
          goal: "Increase reservations",
          metadata: { businessName: "Bistro Nova", country: "Canada" },
        }),
      ),
    );

    assert.equal(result.success, true);
    assert.deepEqual(result.data?.pages.map((page) => page.slug), [
      "home",
      "menu",
      "reservations",
      "gallery",
      "about",
      "contact",
    ]);

    const home = result.data!.pages[0]!;
    assert.ok(home.title.includes("Bistro Nova"));
    assert.ok(home.focusKeyword.includes("restaurant"));
    assert.equal(home.schemaType, "Restaurant");
    assert.ok(home.internalLinks.includes("reservations"));
    assert.equal(home.canonicalUrl, buildCanonicalUrl("Bistro Nova", "home"));
  });

  it("plans dentist SEO for specified pages", () => {
    const result = new SEOPlanner().plan(
      plannerParams(projectRequest({ industry: "Dentist", goal: "Book more appointments" })),
    );

    assert.equal(result.success, true);
    assert.deepEqual(result.data?.pages.map((page) => page.slug), [
      "home",
      "services",
      "meet-the-doctor",
      "insurance",
      "testimonials",
      "book-appointment",
    ]);

    const booking = result.data!.pages.find((page) => page.slug === "book-appointment");
    assert.ok(booking);
    assert.equal(booking.schemaType, "MedicalBusiness");
    assert.ok(booking.metaDescription.includes("appointment"));
  });

  it("plans law firm SEO for specified pages", () => {
    const result = new SEOPlanner().plan(
      plannerParams(
        projectRequest({ industry: "Law Firm", goal: "Generate consultation requests" }),
      ),
    );

    assert.equal(result.success, true);
    assert.deepEqual(result.data?.pages.map((page) => page.slug), [
      "home",
      "practice-areas",
      "attorneys",
      "case-results",
      "consultation",
      "blog",
    ]);

    const attorneys = result.data!.pages.find((page) => page.slug === "attorneys");
    assert.ok(attorneys);
    assert.ok(attorneys.title.includes("Attorney Profiles"));
    assert.equal(attorneys.schemaType, "Person");
  });

  it("falls back to generic SEO for unknown industries", () => {
    const result = new SEOPlanner().plan(
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
    assert.ok(result.data!.pages[0]?.focusKeyword.includes("Real Estate"));
  });

  it("includes complete SEO metadata on every page", () => {
    const result = new SEOPlanner().plan(plannerParams(projectRequest({ industry: "Restaurant" })));

    assert.equal(result.success, true);

    for (const page of result.data!.pages) {
      assert.ok(page.slug.length > 0);
      assert.ok(page.title.length > 0);
      assert.ok(page.metaDescription.length > 0);
      assert.ok(page.focusKeyword.length > 0);
      assert.ok(page.secondaryKeywords.length > 0);
      assert.ok(page.headingSuggestions.length > 0);
      assert.ok(page.internalLinks.length > 0);
      assert.ok(page.schemaType.length > 0);
      assert.ok(page.canonicalUrl.startsWith("https://"));
      assert.ok(["critical", "high", "medium", "low"].includes(page.priority));
    }
  });

  it("returns deterministic output for identical inputs", () => {
    const params = plannerParams(projectRequest({ industry: "Dentist" }));
    const planner = new SEOPlanner();
    const first = planner.plan(params);
    const second = planner.plan(params);

    assert.equal(first.success, true);
    assert.equal(second.success, true);
    assert.deepEqual(first.data, second.data);
  });

  it("maps planner output to WebsitePlan SEO schema", () => {
    const department = new WebsiteDepartment();
    const request: WebsiteDepartmentRequest = {
      requestId: "req-seo-map-001",
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
    const seo = new SEOPlanner().plan(params);
    const architecture = mapPlannerInformationArchitectureToPlan(
      params.informationArchitecture,
      executionInput,
      params.brandIdentity,
      params.userJourney,
    );

    assert.equal(seo.success, true);
    const mapped = mapPlannerSeoPlanToPlan(
      seo.data!,
      executionInput,
      params.brandIdentity,
      architecture.pages,
    );

    assert.ok(mapped.seoPlan.primaryKeywords.length > 0);
    assert.ok(mapped.seoPlan.schemaMarkup.length > 0);
    assert.ok(mapped.seoPlan.contentSeoPriorities.length >= 6);
    assert.notEqual(
      mapped.seoPlan.pageIndexStrategy,
      "Index all primary pages",
    );

    const homePage = mapped.pages.find((page) => page.id === "page-home");
    assert.ok(homePage);
    assert.ok(homePage.seo.titlePattern.includes("Harbor Bistro"));
    assert.ok(homePage.seo.primaryKeywords.includes(seo.data!.pages[0]!.focusKeyword));
  });

  it("integrates SEOPlanner into website planner outputs", () => {
    const department = new WebsiteDepartment();
    const request: WebsiteDepartmentRequest = {
      requestId: "req-seo-planner-001",
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

    assert.ok(outputs.seoPlan.primaryKeywords[0]?.includes("restaurant"));
    assert.ok(outputs.seoPlan.schemaMarkup.some((entry) => entry.type === "Restaurant"));
    assert.ok(outputs.seoPlan.technicalRequirements.includes("Canonical URLs"));

    const menuPage = outputs.pages.find((page) => page.id === "page-menu");
    assert.ok(menuPage);
    assert.ok(menuPage.seo.metaDescriptionPattern.includes("menu"));
  });

  it("integrates through WebsiteDepartment lifecycle execution", async () => {
    const department = new WebsiteDepartment();
    const request: WebsiteDepartmentRequest = {
      requestId: "req-seo-lifecycle-001",
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
    assert.ok(result.websitePlan?.seoPlan);
    assert.ok(result.websitePlan.seoPlan.contentSeoPriorities.length >= 6);
    assert.ok(
      result.websitePlan.pages.some(
        (page) =>
          page.id === "page-book-appointment" &&
          page.seo.schemaTypes.includes("MedicalBusiness"),
      ),
    );
  });
});

/**
 * User Journey Planner — rule-based engine tests.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildDepartmentContext } from "../../../sdk";
import type { ProjectRequest } from "../../../types/project";
import { BrandAnalyzer } from "../analyzers/BrandAnalyzer";
import { InputBuilder } from "../input-builder";
import { createWebsitePlannerOutputs } from "../planner-outputs";
import {
  DENTIST_JOURNEY_STRATEGY,
  GENERIC_JOURNEY_STRATEGY,
  LAW_FIRM_JOURNEY_STRATEGY,
  RESTAURANT_JOURNEY_STRATEGY,
  resolveJourneyStrategy,
} from "../planners/journey-strategy";
import {
  mapPlannerUserJourneyToPlan,
  plannerStageToSchemaStage,
} from "../planners/user-journey-mapper";
import {
  UserJourneyPlanner,
  type UserJourneyPlannerParams,
} from "../planners/UserJourneyPlanner";
import { WebsiteDepartment } from "../website-department";
import type { WebsiteDepartmentRequest } from "../schema";
import type { UserJourneyStageName } from "../types/UserJourney";

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

function plannerParams(
  request: ProjectRequest,
  brandOverrides: Partial<UserJourneyPlannerParams["brandIdentity"]> = {},
): UserJourneyPlannerParams {
  const context = buildDepartmentContext({
    requestId: "req-journey-test",
    request,
  });
  const brandResult = new BrandAnalyzer().analyze({ request, context });
  assert.equal(brandResult.success, true);

  return {
    request,
    context,
    brandIdentity: {
      ...brandResult.data!,
      ...brandOverrides,
    },
  };
}

function stageKeys(): UserJourneyStageName[] {
  return ["awareness", "consideration", "conversion", "retention"];
}

describe("UserJourneyPlanner", () => {
  it("exposes stable planner metadata", () => {
    const planner = new UserJourneyPlanner();
    assert.equal(planner.id, "user-journey-planner");
    assert.equal(planner.version, "1.0.0");
  });

  it("resolves industry journey strategies", () => {
    assert.equal(resolveJourneyStrategy("restaurant"), RESTAURANT_JOURNEY_STRATEGY);
    assert.equal(resolveJourneyStrategy("dentist"), DENTIST_JOURNEY_STRATEGY);
    assert.equal(resolveJourneyStrategy("dental"), DENTIST_JOURNEY_STRATEGY);
    assert.equal(resolveJourneyStrategy("law-firm"), LAW_FIRM_JOURNEY_STRATEGY);
    assert.equal(resolveJourneyStrategy("unknown-industry"), GENERIC_JOURNEY_STRATEGY);
  });

  it("plans a restaurant journey with specified pages and CTAs", () => {
    const planner = new UserJourneyPlanner();
    const result = planner.plan(
      plannerParams(projectRequest({ industry: "Restaurant", goal: "Increase reservations" })),
    );

    assert.equal(result.success, true);
    const journey = result.data!;

    assert.deepEqual(journey.awareness.recommendedPages, [
      "Home",
      "Menu Preview",
      "Gallery",
      "Google Reviews",
    ]);
    assert.equal(journey.awareness.recommendedCTA, "View Menu");
    assert.equal(journey.awareness.nextStage, "consideration");

    assert.deepEqual(journey.consideration.recommendedPages, [
      "Menu",
      "Pricing",
      "Location",
      "Reservations",
    ]);
    assert.equal(journey.consideration.recommendedCTA, "Reserve a Table");
    assert.equal(journey.consideration.nextStage, "conversion");

    assert.deepEqual(journey.conversion.recommendedPages, [
      "Reservation",
      "Contact",
      "Phone",
    ]);
    assert.equal(journey.conversion.recommendedCTA, "Book Now");
    assert.equal(journey.conversion.nextStage, "retention");

    assert.deepEqual(journey.retention.recommendedPages, [
      "Loyalty",
      "Events",
      "Newsletter",
      "Google Review",
    ]);
    assert.equal(journey.retention.recommendedCTA, "Join Loyalty Program");
    assert.equal(journey.retention.nextStage, null);
  });

  it("plans a dentist journey with specified pages and CTAs", () => {
    const planner = new UserJourneyPlanner();
    const result = planner.plan(
      plannerParams(projectRequest({ industry: "Dentist", goal: "Book more appointments" })),
    );

    assert.equal(result.success, true);
    const journey = result.data!;

    assert.deepEqual(journey.awareness.recommendedPages, [
      "Home",
      "Services",
      "Meet the Doctor",
    ]);
    assert.equal(journey.awareness.recommendedCTA, "Explore Services");

    assert.deepEqual(journey.consideration.recommendedPages, [
      "Services",
      "Insurance",
      "Testimonials",
    ]);
    assert.equal(journey.consideration.recommendedCTA, "View Insurance Options");

    assert.deepEqual(journey.conversion.recommendedPages, ["Book Appointment", "Contact"]);
    assert.equal(journey.conversion.recommendedCTA, "Book Appointment");

    assert.deepEqual(journey.retention.recommendedPages, [
      "Testimonials",
      "Newsletter",
      "Google Review",
    ]);
    assert.equal(journey.retention.recommendedCTA, "Leave a Review");
  });

  it("plans a law firm journey with specified pages and CTAs", () => {
    const planner = new UserJourneyPlanner();
    const result = planner.plan(
      plannerParams(
        projectRequest({ industry: "Law Firm", goal: "Generate consultation requests" }),
      ),
    );

    assert.equal(result.success, true);
    const journey = result.data!;

    assert.deepEqual(journey.awareness.recommendedPages, ["Home", "Practice Areas"]);
    assert.equal(journey.awareness.recommendedCTA, "Explore Practice Areas");

    assert.deepEqual(journey.consideration.recommendedPages, [
      "Attorney Profiles",
      "Case Results",
    ]);
    assert.equal(journey.consideration.recommendedCTA, "View Case Results");

    assert.deepEqual(journey.conversion.recommendedPages, ["Free Consultation", "Contact"]);
    assert.equal(journey.conversion.recommendedCTA, "Schedule a Consultation");

    assert.deepEqual(journey.retention.recommendedPages, [
      "Case Results",
      "Newsletter",
      "Client Testimonials",
    ]);
    assert.equal(journey.retention.recommendedCTA, "Subscribe to Legal Insights");
  });

  it("falls back to a generic journey for unknown industries", () => {
    const planner = new UserJourneyPlanner();
    const result = planner.plan(
      plannerParams(projectRequest({ industry: "Real Estate", goal: "Capture seller leads" })),
    );

    assert.equal(result.success, true);
    const journey = result.data!;

    assert.deepEqual(journey.awareness.recommendedPages, ["Home", "About", "Services"]);
    assert.equal(journey.awareness.recommendedCTA, "Learn More");
    assert.deepEqual(journey.consideration.recommendedPages, [
      "Services",
      "Testimonials",
      "FAQ",
    ]);
    assert.deepEqual(journey.conversion.recommendedPages, ["Contact", "Quote Request"]);
    assert.equal(journey.conversion.recommendedCTA, "Contact Us Today");
    assert.deepEqual(journey.retention.recommendedPages, ["Newsletter", "Reviews", "Support"]);
  });

  it("enriches user goals with brand audience and project goal", () => {
    const planner = new UserJourneyPlanner();
    const result = planner.plan(
      plannerParams(
        projectRequest({ industry: "Restaurant", goal: "Increase reservations" }),
        { targetAudience: "Local diners" },
      ),
    );

    assert.equal(result.success, true);
    assert.ok(result.data!.awareness.userGoal.includes("Local diners"));
    assert.ok(result.data!.awareness.userGoal.includes("increase reservations"));
  });

  it("returns deterministic output for identical inputs", () => {
    const planner = new UserJourneyPlanner();
    const params = plannerParams(
      projectRequest({ industry: "Dentist", goal: "Grow patient base" }),
    );

    const first = planner.plan(params);
    const second = planner.plan(params);

    assert.equal(first.success, true);
    assert.equal(second.success, true);
    assert.deepEqual(first.data, second.data);
  });

  it("includes complete stage metadata on every stage", () => {
    const planner = new UserJourneyPlanner();
    const result = planner.plan(plannerParams(projectRequest({ industry: "Restaurant" })));

    assert.equal(result.success, true);

    for (const stageName of stageKeys()) {
      const stage = result.data![stageName];
      assert.equal(stage.stageName, stageName);
      assert.ok(stage.userGoal.length > 0);
      assert.ok(stage.recommendedPages.length > 0);
      assert.ok(stage.recommendedCTA.length > 0);
      assert.ok(stage.recommendedContent.length > 0);
      assert.ok(stage.trustSignals.length > 0);
    }
  });

  it("maps planner output to WebsitePlan user journey schema with five stages", () => {
    const department = new WebsiteDepartment();
    const request: WebsiteDepartmentRequest = {
      requestId: "req-journey-map-001",
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
    const brand = new BrandAnalyzer().analyze({ request: context.request, context });
    const journey = new UserJourneyPlanner().plan({
      request: context.request,
      brandIdentity: brand.data!,
      context,
    });

    assert.equal(journey.success, true);
    const mapped = mapPlannerUserJourneyToPlan(journey.data!, executionInput, brand.data!);

    assert.equal(mapped.requestId, "req-journey-map-001");
    assert.deepEqual(
      mapped.stages.map((stage) => stage.stage),
      ["awareness", "consideration", "decision", "conversion", "retention"],
    );
    assert.equal(mapped.stages[0]?.primaryCTA.label, "View Menu");
    assert.equal(mapped.stages[2]?.stage, "decision");
    assert.ok(mapped.stages[2]?.primaryCTA.label.includes("Reserve"));
    assert.ok(mapped.primaryConversionPath.length >= 4);
    assert.ok(mapped.summary.includes("Restaurant"));
    assert.notEqual(mapped.summary, "Placeholder user journey — pending Journey Planner (Sprint 2).");
  });

  it("maps planner stage names to schema stage types", () => {
    assert.equal(plannerStageToSchemaStage("awareness"), "awareness");
    assert.equal(plannerStageToSchemaStage("retention"), "retention");
  });

  it("integrates UserJourneyPlanner into website planner outputs", () => {
    const department = new WebsiteDepartment();
    const request: WebsiteDepartmentRequest = {
      requestId: "req-journey-planner-001",
      clientName: "Bistro Nova",
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
    const outputs = createWebsitePlannerOutputs(executionInput);

    assert.deepEqual(
      outputs.userJourney.stages.map((stage) => stage.stage),
      ["awareness", "consideration", "decision", "conversion", "retention"],
    );
    assert.equal(outputs.userJourney.stages[0]?.primaryCTA.label, "View Menu");
    assert.equal(outputs.userJourney.stages[3]?.primaryCTA.label, "Book Now");
    assert.ok(outputs.userJourney.summary.includes("Local diners"));
    assert.notEqual(
      outputs.userJourney.summary,
      "Placeholder user journey — pending Journey Planner (Sprint 2).",
    );
  });

  it("integrates through WebsiteDepartment lifecycle execution", async () => {
    const department = new WebsiteDepartment();
    const request: WebsiteDepartmentRequest = {
      requestId: "req-journey-lifecycle-001",
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
    assert.ok(result.websitePlan?.userJourney);
    assert.equal(result.websitePlan?.userJourney.stages.length, 5);
    assert.equal(result.websitePlan?.userJourney.stages[0]?.primaryCTA.label, "Explore Services");
    assert.equal(
      result.websitePlan?.userJourney.stages[3]?.primaryCTA.label,
      "Book Appointment",
    );
  });
});

/**
 * Information Architecture Planner — rule-based engine tests.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildDepartmentContext } from "../../../sdk";
import type { ProjectRequest } from "../../../types/project";
import { BrandAnalyzer } from "../analyzers/BrandAnalyzer";
import { InputBuilder } from "../input-builder";
import { createWebsitePlannerOutputs } from "../planner-outputs";
import {
  DENTIST_ARCHITECTURE_STRATEGY,
  GENERIC_ARCHITECTURE_STRATEGY,
  LAW_FIRM_ARCHITECTURE_STRATEGY,
  RESTAURANT_ARCHITECTURE_STRATEGY,
  resolveArchitectureStrategy,
} from "../planners/architecture-strategy";
import {
  InformationArchitecturePlanner,
  type InformationArchitecturePlannerParams,
} from "../planners/InformationArchitecturePlanner";
import { mapPlannerInformationArchitectureToPlan } from "../planners/information-architecture-mapper";
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

function plannerParams(
  request: ProjectRequest,
): InformationArchitecturePlannerParams {
  const context = buildDepartmentContext({
    requestId: "req-architecture-test",
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

  return {
    request,
    context,
    brandIdentity: brandResult.data!,
    userJourney: journeyResult.data!,
  };
}

describe("InformationArchitecturePlanner", () => {
  it("exposes stable planner metadata", () => {
    const planner = new InformationArchitecturePlanner();
    assert.equal(planner.id, "information-architecture-planner");
    assert.equal(planner.version, "1.0.0");
  });

  it("resolves industry architecture strategies", () => {
    assert.equal(resolveArchitectureStrategy("restaurant"), RESTAURANT_ARCHITECTURE_STRATEGY);
    assert.equal(resolveArchitectureStrategy("dentist"), DENTIST_ARCHITECTURE_STRATEGY);
    assert.equal(resolveArchitectureStrategy("dental"), DENTIST_ARCHITECTURE_STRATEGY);
    assert.equal(resolveArchitectureStrategy("law-firm"), LAW_FIRM_ARCHITECTURE_STRATEGY);
    assert.equal(resolveArchitectureStrategy("unknown"), GENERIC_ARCHITECTURE_STRATEGY);
  });

  it("plans restaurant information architecture with specified pages", () => {
    const result = new InformationArchitecturePlanner().plan(
      plannerParams(projectRequest({ industry: "Restaurant", goal: "Increase reservations" })),
    );

    assert.equal(result.success, true);
    const architecture = result.data!;

    assert.deepEqual(
      architecture.pages.map((page) => page.title),
      [
        "Home",
        "Menu",
        "Reservations",
        "Gallery",
        "About",
        "Contact",
        "FAQ",
        "Privacy",
        "Terms",
      ],
    );
    assert.deepEqual(architecture.conversionPages, ["reservations", "contact"]);
    assert.deepEqual(architecture.legalPages, ["privacy", "terms"]);
    assert.equal(architecture.primaryCTA.slug, "reservations");
    assert.equal(architecture.secondaryCTA.slug, "menu");
    assert.ok(architecture.navigation.length >= 6);
    assert.ok(architecture.footerNavigation.length >= 2);
  });

  it("plans dentist information architecture with specified pages", () => {
    const result = new InformationArchitecturePlanner().plan(
      plannerParams(projectRequest({ industry: "Dentist", goal: "Book more appointments" })),
    );

    assert.equal(result.success, true);
    const architecture = result.data!;

    assert.deepEqual(
      architecture.pages.map((page) => page.title),
      [
        "Home",
        "Services",
        "Meet the Doctor",
        "Insurance",
        "Testimonials",
        "Book Appointment",
        "Contact",
        "FAQ",
        "Privacy",
      ],
    );
    assert.deepEqual(architecture.conversionPages, ["book-appointment", "contact"]);
    assert.deepEqual(architecture.legalPages, ["privacy"]);
    assert.equal(architecture.primaryCTA.slug, "book-appointment");
    assert.equal(architecture.blogStrategy.enabled, false);
  });

  it("plans law firm information architecture with specified pages", () => {
    const result = new InformationArchitecturePlanner().plan(
      plannerParams(
        projectRequest({ industry: "Law Firm", goal: "Generate consultation requests" }),
      ),
    );

    assert.equal(result.success, true);
    const architecture = result.data!;

    assert.deepEqual(
      architecture.pages.map((page) => page.title),
      [
        "Home",
        "Practice Areas",
        "Attorneys",
        "Case Results",
        "Consultation",
        "Blog",
        "FAQ",
        "Contact",
        "Privacy",
      ],
    );
    assert.deepEqual(architecture.conversionPages, ["consultation", "contact"]);
    assert.equal(architecture.blogStrategy.enabled, true);
    assert.ok(architecture.blogStrategy.recommendedTopics.length > 0);
    assert.equal(architecture.primaryCTA.slug, "consultation");
  });

  it("falls back to generic architecture for unknown industries", () => {
    const result = new InformationArchitecturePlanner().plan(
      plannerParams(projectRequest({ industry: "Real Estate", goal: "Capture seller leads" })),
    );

    assert.equal(result.success, true);
    const architecture = result.data!;

    assert.deepEqual(
      architecture.pages.map((page) => page.title),
      [
        "Home",
        "About",
        "Services",
        "Testimonials",
        "Contact",
        "FAQ",
        "Quote Request",
        "Privacy",
      ],
    );
    assert.deepEqual(architecture.conversionPages, ["contact", "quote-request"]);
    assert.equal(architecture.primaryCTA.slug, "contact");
  });

  it("generates header and footer navigation automatically", () => {
    const result = new InformationArchitecturePlanner().plan(
      plannerParams(projectRequest({ industry: "Restaurant" })),
    );

    assert.equal(result.success, true);
    const architecture = result.data!;

    assert.ok(architecture.navigation.every((item) => item.location === "header"));
    assert.ok(architecture.footerNavigation.every((item) => item.location === "footer"));
    assert.ok(architecture.navigation[0]?.slug === "home");
    assert.ok(architecture.footerNavigation.some((item) => item.slug === "privacy"));
  });

  it("generates parent-child page hierarchy", () => {
    const result = new InformationArchitecturePlanner().plan(
      plannerParams(projectRequest({ industry: "Restaurant" })),
    );

    assert.equal(result.success, true);
    const homeNode = result.data!.pageHierarchy.find((node) => node.slug === "home");
    assert.ok(homeNode);
    assert.ok(homeNode.children.includes("menu"));
    assert.ok(homeNode.children.includes("reservations"));

    const contactNode = result.data!.pageHierarchy.find((node) => node.slug === "contact");
    assert.ok(contactNode);
    assert.ok(contactNode.children.includes("privacy"));
  });

  it("includes complete page metadata on every page", () => {
    const result = new InformationArchitecturePlanner().plan(
      plannerParams(projectRequest({ industry: "Dentist" })),
    );

    assert.equal(result.success, true);

    for (const page of result.data!.pages) {
      assert.ok(page.title.length > 0);
      assert.ok(page.slug.length > 0);
      assert.ok(page.purpose.length > 0);
      assert.ok(page.requiredSections.length > 0);
      assert.ok(page.recommendedComponents.length > 0);
      assert.ok(["critical", "high", "medium", "low"].includes(page.seoImportance));
    }
  });

  it("enriches page purpose with brand audience", () => {
    const result = new InformationArchitecturePlanner().plan(
      plannerParams(projectRequest({ industry: "Restaurant", goal: "Increase reservations" })),
    );

    assert.equal(result.success, true);
    assert.ok(result.data!.pages[0]?.purpose.includes("Local homeowners"));
  });

  it("returns deterministic output for identical inputs", () => {
    const params = plannerParams(projectRequest({ industry: "Law Firm" }));
    const planner = new InformationArchitecturePlanner();
    const first = planner.plan(params);
    const second = planner.plan(params);

    assert.equal(first.success, true);
    assert.equal(second.success, true);
    assert.deepEqual(first.data, second.data);
  });

  it("maps planner output to WebsitePlan architecture schema", () => {
    const department = new WebsiteDepartment();
    const request: WebsiteDepartmentRequest = {
      requestId: "req-arch-map-001",
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
    const params = plannerParams(projectRequest({ industry: "Restaurant" }));
    const architecture = new InformationArchitecturePlanner().plan(params);

    assert.equal(architecture.success, true);
    const mapped = mapPlannerInformationArchitectureToPlan(
      architecture.data!,
      executionInput,
      params.brandIdentity,
      params.userJourney,
    );

    assert.ok(mapped.pages.length >= 9);
    assert.equal(mapped.pages[0]?.slug, "/");
    assert.equal(mapped.pages[0]?.id, "page-home");
    assert.ok(mapped.navigation.primary.length > 0);
    assert.ok(mapped.navigation.footer.length > 0);
    assert.equal(mapped.ctaStrategy.primaryCTA.label, params.userJourney.conversion.recommendedCTA);
    assert.notEqual(
      mapped.siteArchitecture.rationale,
      "Placeholder architecture — pending Architecture Planner (Sprint 2).",
    );
  });

  it("integrates InformationArchitecturePlanner into website planner outputs", () => {
    const department = new WebsiteDepartment();
    const request: WebsiteDepartmentRequest = {
      requestId: "req-arch-planner-001",
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

    assert.ok(outputs.pages.some((page) => page.name === "Menu"));
    assert.ok(outputs.pages.some((page) => page.name === "Reservations"));
    assert.ok(outputs.navigation.primary.some((item) => item.label === "Menu"));
    assert.notEqual(
      outputs.siteArchitecture.rationale,
      "Placeholder architecture — pending Architecture Planner (Sprint 2).",
    );
    assert.equal(outputs.ctaStrategy.primaryCTA.label, "Book Now");
  });

  it("integrates through WebsiteDepartment lifecycle execution", async () => {
    const department = new WebsiteDepartment();
    const request: WebsiteDepartmentRequest = {
      requestId: "req-arch-lifecycle-001",
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
    assert.ok(result.websitePlan?.pages.some((page) => page.name === "Book Appointment"));
    assert.ok(result.websitePlan?.siteArchitecture.conversionPath.length >= 3);
    assert.ok(result.websitePlan?.navigation.footer.some((item) => item.label === "Privacy"));
  });
});

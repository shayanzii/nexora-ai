import type { ProjectRequest } from "../../types/project";

/**
 * Unit-test-ready example requests for the Sales Agent.
 * Import these in tests to validate qualification and clarification flows.
 */

/** Complete client request — should produce a qualified SalesAgentOutput. */
export const SALES_EXAMPLE_COMPLETE_REQUEST: ProjectRequest = {
  industry: "HVAC",
  goal: "Generate leads and book service appointments automatically",
  budget: 3000,
  services: ["chatbot", "booking"],
  metadata: {
    businessName: "Arctic Air Solutions",
    country: "Canada",
    targetAudience: "Homeowners and property managers in the Greater Toronto Area",
    timeline: "Go live within 4 weeks",
  },
};

/** Incomplete request — missing business name, country, target audience, and timeline. */
export const SALES_EXAMPLE_INCOMPLETE_REQUEST: ProjectRequest = {
  industry: "Dental",
  goal: "Reduce front desk call volume",
  budget: 2000,
  services: ["chatbot"],
  metadata: {},
};

/** Under-budget request — qualifies but should surface budget-scope risk. */
export const SALES_EXAMPLE_UNDER_BUDGET_REQUEST: ProjectRequest = {
  industry: "Real Estate",
  goal: "Capture and qualify website leads faster",
  budget: 400,
  services: ["website", "chatbot", "leads"],
  metadata: {
    businessName: "Northern Keys Realty",
    country: "Canada",
    targetAudience: "First-time home buyers",
    timeline: "ASAP — within 2 weeks",
  },
};

/** Regulated industry request — qualifies with compliance risk flags. */
export const SALES_EXAMPLE_REGULATED_REQUEST: ProjectRequest = {
  industry: "Dental",
  goal: "Automate appointment booking and patient FAQ responses",
  budget: 5000,
  services: ["chatbot", "booking", "support"],
  metadata: {
    businessName: "Bright Smile Dental Clinic",
    country: "Canada",
    targetAudience: "Existing and new patients",
    timeline: "6 weeks including staff training",
  },
};

/** Minimal API-valid request — missing most sales-required metadata fields. */
export const SALES_EXAMPLE_MINIMAL_REQUEST: ProjectRequest = {
  industry: "Restaurant",
  goal: "Answer customer inquiries after hours",
  budget: 999,
  services: ["chatbot"],
};

export const SALES_EXAMPLE_REQUESTS = {
  complete: SALES_EXAMPLE_COMPLETE_REQUEST,
  incomplete: SALES_EXAMPLE_INCOMPLETE_REQUEST,
  underBudget: SALES_EXAMPLE_UNDER_BUDGET_REQUEST,
  regulated: SALES_EXAMPLE_REGULATED_REQUEST,
  minimal: SALES_EXAMPLE_MINIMAL_REQUEST,
} as const;

export type SalesExampleRequestKey = keyof typeof SALES_EXAMPLE_REQUESTS;

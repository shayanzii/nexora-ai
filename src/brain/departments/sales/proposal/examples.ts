import type { ProjectRequest } from "../../../types/project";
import type { ProposalEngineInput } from "./schema";

/** Complete dentist client request for proposal testing. */
export const PROPOSAL_EXAMPLE_DENTIST_REQUEST: ProjectRequest = {
  industry: "Dental",
  goal: "Reduce front desk call volume and book appointments online",
  budget: 4500,
  services: ["chatbot", "booking"],
  metadata: {
    businessName: "Bright Smile Dental Clinic",
    country: "Canada",
    targetAudience: "New and existing patients in Vancouver",
    timeline: "Go live within 5 weeks",
  },
};

/** Complete HVAC client request for proposal testing. */
export const PROPOSAL_EXAMPLE_HVAC_REQUEST: ProjectRequest = {
  industry: "HVAC",
  goal: "Capture emergency leads and book service calls 24/7",
  budget: 3500,
  services: ["receptionist", "booking", "leads"],
  metadata: {
    businessName: "Arctic Air Solutions",
    country: "Canada",
    targetAudience: "Homeowners and property managers in the GTA",
    timeline: "Launch before summer peak season",
  },
};

/** Complete plumbing client request for proposal testing. */
export const PROPOSAL_EXAMPLE_PLUMBING_REQUEST: ProjectRequest = {
  industry: "Plumbing",
  goal: "Answer urgent calls instantly and reduce missed emergency jobs",
  budget: 2800,
  services: ["receptionist", "booking"],
  metadata: {
    businessName: "QuickFlow Plumbing Co.",
    country: "Canada",
    targetAudience: "Residential and commercial property owners",
    timeline: "ASAP — within 3 weeks",
  },
};

/** Complete law firm client request for proposal testing. */
export const PROPOSAL_EXAMPLE_LAW_FIRM_REQUEST: ProjectRequest = {
  industry: "Legal",
  goal: "Qualify intake leads faster and schedule consultations automatically",
  budget: 6000,
  services: ["chatbot", "booking", "crm"],
  metadata: {
    businessName: "Mitchell & Associates Law",
    country: "Canada",
    targetAudience: "Individuals and small businesses seeking legal counsel",
    timeline: "6 weeks including compliance review",
  },
};

/** Complete restaurant client request for proposal testing. */
export const PROPOSAL_EXAMPLE_RESTAURANT_REQUEST: ProjectRequest = {
  industry: "Restaurant",
  goal: "Handle reservation and catering inquiries without pulling staff off the floor",
  budget: 2000,
  services: ["chatbot", "booking"],
  metadata: {
    businessName: "Harbourfront Bistro",
    country: "Canada",
    targetAudience: "Local diners, tourists, and catering clients",
    timeline: "Live before holiday season",
  },
};

export const PROPOSAL_EXAMPLE_REQUESTS = {
  dentist: PROPOSAL_EXAMPLE_DENTIST_REQUEST,
  hvac: PROPOSAL_EXAMPLE_HVAC_REQUEST,
  plumbing: PROPOSAL_EXAMPLE_PLUMBING_REQUEST,
  lawFirm: PROPOSAL_EXAMPLE_LAW_FIRM_REQUEST,
  restaurant: PROPOSAL_EXAMPLE_RESTAURANT_REQUEST,
} as const;

export type ProposalExampleKey = keyof typeof PROPOSAL_EXAMPLE_REQUESTS;

/** Minimal engine input for unit testing proposal generation directly. */
export const PROPOSAL_EXAMPLE_ENGINE_INPUT: ProposalEngineInput = {
  requestId: "test-req-hvac-001",
  clientName: "Arctic Air Solutions",
  industry: "HVAC",
  country: "Canada",
  goals: "Capture emergency leads and book service calls 24/7",
  targetAudience: "Homeowners and property managers in the GTA",
  requestedServices: ["receptionist", "booking", "leads"],
  statedBudget: 3500,
  clientTimeline: "Launch before summer peak season",
  qualificationScore: 100,
  discoveryAnalysis:
    "Operating in Canada within the HVAC sector. Primary audience: Homeowners and property managers in the GTA.",
  discoveryNotes: [
    "Client operates in HVAC targeting homeowners.",
    "Requested capabilities: receptionist, booking, leads.",
  ],
  businessAnalysisSummary:
    "Arctic Air Solutions (HVAC, Canada) seeks receptionist, booking, leads to achieve emergency lead capture.",
  scopeOutline: [
    "receptionist: Explicitly requested by Arctic Air Solutions.",
    "booking: Explicitly requested by Arctic Air Solutions.",
  ],
  recommendedServices: [
    {
      service: "receptionist",
      rationale: "Explicitly requested to handle after-hours emergency calls.",
      priority: "primary",
    },
    {
      service: "booking",
      rationale: "Explicitly requested to automate service call scheduling.",
      priority: "primary",
    },
    {
      service: "leads",
      rationale: "Explicitly requested to capture website leads.",
      priority: "primary",
    },
  ],
  estimatedPriceRange: {
    currency: "CAD",
    minimum: 1750,
    maximum: 2363,
    basis: "Estimated range aligns with stated budget.",
  },
  estimatedTimeline: {
    minimumWeeks: 3,
    maximumWeeks: 5,
    summary: "Multi-service projects typically launch within 3–5 weeks.",
  },
  estimatedComplexity: "medium",
  projectRisks: [
    {
      id: "standard-delivery",
      severity: "low",
      description: "No major qualification risks identified.",
      mitigation: "Proceed to structured requirements analysis.",
    },
  ],
  budgetAligned: true,
};

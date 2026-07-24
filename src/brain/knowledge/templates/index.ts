import type { ProposalTemplateBlock } from "../types";

export const PROPOSAL_TEMPLATE_BLOCKS: ProposalTemplateBlock[] = [
  {
    id: "executive-intro",
    category: "executive",
    label: "Executive Summary Opener",
    content:
      "is seeking AI-powered customer engagement to achieve measurable business outcomes within a defined timeline and budget.",
  },
  {
    id: "assumption-client-access",
    category: "assumption",
    label: "Client Access Assumption",
    content: "Client provides timely access to business information and decision-makers.",
  },
  {
    id: "assumption-integrations",
    category: "assumption",
    label: "Integration Assumption",
    content:
      "Existing website and communication channels are accessible for integration.",
  },
  {
    id: "assumption-phased-budget",
    category: "assumption",
    label: "Phased Budget Assumption",
    content: "Final scope may require phasing to align with stated budget constraints.",
  },
  {
    id: "milestone-discovery",
    category: "milestone",
    label: "Discovery Milestone",
    content: "Confirm requirements, integrations, and success metrics.",
  },
  {
    id: "milestone-build",
    category: "milestone",
    label: "Build Milestone",
    content: "Configure AI workflows, knowledge base, and integrations.",
  },
  {
    id: "milestone-test",
    category: "milestone",
    label: "Testing Milestone",
    content: "Internal testing, client review, and team training.",
  },
  {
    id: "milestone-launch",
    category: "milestone",
    label: "Launch Milestone",
    content: "Go-live support and post-launch optimization checklist.",
  },
  {
    id: "next-step-approve-scope",
    category: "next-step",
    label: "Approve Scope",
    content: "Review and approve proposed scope and deliverables.",
  },
  {
    id: "next-step-confirm-integrations",
    category: "next-step",
    label: "Confirm Integrations",
    content: "Confirm integration access (website, calendar, CRM as applicable).",
  },
  {
    id: "next-step-kickoff",
    category: "next-step",
    label: "Schedule Kickoff",
    content: "Schedule kickoff call to finalize project timeline.",
  },
  {
    id: "next-step-sign-agreement",
    category: "next-step",
    label: "Sign Agreement",
    content: "Sign agreement and initiate discovery kickoff.",
  },
  {
    id: "risk-mitigation-budget",
    category: "risk-mitigation",
    label: "Budget Mitigation",
    content: "Reduce initial scope or adopt a phased delivery plan.",
  },
  {
    id: "risk-mitigation-compliance",
    category: "risk-mitigation",
    label: "Compliance Mitigation",
    content:
      "Confirm data handling, consent, and retention requirements during discovery.",
  },
];

export const DEFAULT_CHALLENGES: string[] = [
  "Manual customer communication limits growth after business hours.",
  "Leads are lost due to slow response times.",
  "Staff time is consumed by repetitive inquiries.",
];

export const GOAL_SERVICE_HINTS: Record<string, string> = {
  lead: "leads",
  book: "booking",
  support: "support",
  appointment: "booking",
  consult: "booking",
};

export const GOAL_SERVICE_RATIONALES: Record<string, string> = {
  leads:
    "Goal references lead generation — lead capture automation may accelerate outcomes.",
  booking:
    "Goal references bookings — appointment automation reduces manual scheduling.",
  support:
    "Goal references customer support — support automation can deflect repetitive inquiries.",
};

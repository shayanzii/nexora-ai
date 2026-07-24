export type ComplexityLevel = "low" | "medium" | "high";

export interface IndustryProfile {
  id: string;
  name: string;
  regulated: boolean;
  commonBusinessGoals: string[];
  commonCustomerProblems: string[];
  commonAutomationOpportunities: string[];
  recommendedAiServices: string[];
  websiteRecommendations: string[];
  socialMediaRecommendations: string[];
  kpis: string[];
}

export interface ServiceDefinition {
  id: string;
  name: string;
  aliases: string[];
  description: string;
  businessValue: string[];
  implementationComplexity: ComplexityLevel;
  estimatedTimelineWeeks: { minimum: number; maximum: number };
  dependencies: string[];
  deliverable: {
    name: string;
    description: string;
  };
}

export interface Playbook {
  id: string;
  industryId: string;
  name: string;
  objective: string;
  recommendedServices: string[];
  steps: string[];
  kpis: string[];
}

export interface ProposalTemplateBlock {
  id: string;
  category: "assumption" | "milestone" | "next-step" | "risk-mitigation" | "executive";
  label: string;
  content: string;
}

export interface ServicePricing {
  serviceId: string;
  currency: "CAD";
  minimum: number;
  maximumMultiplier: number;
  defaultEstimate: number;
  notes: string;
}

export interface PricingPolicy {
  currency: "CAD";
  defaultServiceEstimate: number;
  multiServiceTimeline: {
    single: { minimumWeeks: number; maximumWeeks: number; summary: string };
    multi: { minimumWeeks: number; maximumWeeks: number; summary: string };
    complex: { minimumWeeks: number; maximumWeeks: number; summary: string };
  };
}

export interface KnowledgePrompt {
  id: string;
  domain: string;
  template: string;
}

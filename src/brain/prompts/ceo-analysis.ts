import type { AgentCapability } from "../types/agent";
import type { AgentTask, ProjectRequest } from "../types/project";

export interface CEOAnalysis {
  requestId: string;
  request: ProjectRequest;
  requiredCapabilities: string[];
  serviceCapabilities: Record<string, string[]>;
  complexityFactors: string[];
  recommendedAgentIds: string[];
  tasks: AgentTask[];
  executionOrder: string[];
  summary: string;
}

export const CEO_AGENT_ID = "ceo-agent";

export const SERVICE_CAPABILITY_MAP: Record<string, string[]> = {
  website: ["web-strategy", "ux-planning", "content-planning"],
  chatbot: ["chatbot-strategy", "conversation-design", "integration-planning"],
  automation: ["workflow-design", "integration-planning", "process-mapping"],
  receptionist: ["voice-strategy", "call-flow-design", "integration-planning"],
  crm: ["crm-integration", "data-mapping", "workflow-design"],
  booking: ["scheduling-strategy", "calendar-integration", "notification-design"],
  leads: ["lead-capture-strategy", "funnel-design", "crm-integration"],
  support: ["support-automation", "knowledge-base-planning", "escalation-design"],
};

export const AGENT_CAPABILITIES: AgentCapability[] = [
  {
    agentId: "sales-department",
    tags: ["sales", "qualification", "discovery", "department"],
    supportedTaskTypes: ["qualify_client"],
    supportedServices: ["*"],
  },
  {
    agentId: "requirements-analyst",
    tags: ["analysis", "discovery"],
    supportedTaskTypes: ["analyze_requirements"],
    supportedServices: ["*"],
  },
  {
    agentId: "service-architect",
    tags: ["architecture", "planning"],
    supportedTaskTypes: ["plan_service"],
    supportedServices: Object.keys(SERVICE_CAPABILITY_MAP),
  },
  {
    agentId: "budget-planner",
    tags: ["budget", "scoping"],
    supportedTaskTypes: ["validate_budget"],
    supportedServices: ["*"],
  },
  {
    agentId: "delivery-planner",
    tags: ["delivery", "timeline"],
    supportedTaskTypes: ["plan_delivery"],
    supportedServices: ["*"],
  },
];

export const CEO_ANALYSIS_PROMPT = `You are the Nexora Brain CEO Agent.
Your role is to orchestrate specialist agents — never to build websites or write code directly.
Analyze the project brief, identify required capabilities, and produce an execution plan.`;

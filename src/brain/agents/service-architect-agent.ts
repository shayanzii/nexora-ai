import { BaseAgent } from "./base-agent";
import { SERVICE_CAPABILITY_MAP } from "../prompts/ceo-analysis";
import type { AgentContext } from "../types/agent";
import type { AgentTask } from "../types/project";

export class ServiceArchitectAgent extends BaseAgent {
  readonly id = "service-architect";
  readonly name = "Service Architect";
  readonly description =
    "Maps requested services to deliverables, dependencies, and specialist workstreams.";

  canHandle(task: AgentTask): boolean {
    return task.type === "plan_service" && typeof task.service === "string";
  }

  async execute(task: AgentTask, context: AgentContext) {
    const service = task.service!;
    const capabilities = SERVICE_CAPABILITY_MAP[service] ?? ["general-planning"];
    const knownService = service in SERVICE_CAPABILITY_MAP;

    return this.success(task, {
      service,
      knownService,
      capabilities,
      deliverables: this.buildDeliverables(service),
      dependencies: this.buildDependencies(service, context.request.services),
      orchestrationNote:
        "This agent plans service delivery only — it does not generate websites or code.",
    }, `Service architecture drafted for '${service}'.`);
  }

  private buildDeliverables(service: string): string[] {
    const deliverableMap: Record<string, string[]> = {
      website: [
        "Information architecture outline",
        "Page scope definition",
        "Conversion goal mapping",
        "Integration requirements",
      ],
      chatbot: [
        "Conversation flow outline",
        "Knowledge source inventory",
        "Escalation rules",
        "Channel integration plan",
      ],
      automation: [
        "Process map",
        "Trigger and action definitions",
        "Tool integration list",
        "Success metrics",
      ],
      receptionist: [
        "Call flow design",
        "Qualification criteria",
        "Booking handoff rules",
        "After-hours policy",
      ],
      crm: [
        "CRM field mapping",
        "Pipeline stage definitions",
        "Sync rules",
        "Reporting requirements",
      ],
      booking: [
        "Availability rules",
        "Calendar integration plan",
        "Reminder sequence",
        "Cancellation policy handling",
      ],
      leads: [
        "Lead capture touchpoints",
        "Qualification criteria",
        "Routing rules",
        "Follow-up sequence",
      ],
      support: [
        "FAQ taxonomy",
        "Escalation matrix",
        "Knowledge base structure",
        "SLA definitions",
      ],
    };

    return (
      deliverableMap[service] ?? [
        "Scope definition",
        "Integration requirements",
        "Delivery milestones",
      ]
    );
  }

  private buildDependencies(service: string, allServices: string[]): string[] {
    const deps: string[] = ["analyze_requirements"];

    if (service === "chatbot" && allServices.includes("website")) {
      deps.push("plan_service:website");
    }

    if (service === "leads" && allServices.includes("crm")) {
      deps.push("plan_service:crm");
    }

    return deps;
  }
}

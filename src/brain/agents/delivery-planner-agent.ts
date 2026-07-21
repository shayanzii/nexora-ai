import { BaseAgent } from "./base-agent";
import type { AgentContext } from "../types/agent";
import type { AgentTask } from "../types/project";

export class DeliveryPlannerAgent extends BaseAgent {
  readonly id = "delivery-planner";
  readonly name = "Delivery Planner";
  readonly description =
    "Sequences delivery milestones and defines the handoff plan after orchestration.";

  canHandle(task: AgentTask): boolean {
    return task.type === "plan_delivery";
  }

  async execute(task: AgentTask, context: AgentContext) {
    const { request } = context;
    const phases = this.buildPhases(request.services);

    return this.success(task, {
      phases,
      estimatedWeeks: this.estimateWeeks(request.services.length),
      handoffChecklist: [
        "Confirm signed scope",
        "Assign human delivery team",
        "Schedule kickoff call",
        "Begin first execution task",
      ],
      orchestrationComplete: true,
    }, "Delivery plan ready.");
  }

  private buildPhases(services: string[]) {
    return [
      {
        phase: 1,
        name: "Discovery & Planning",
        focus: "Requirements validation and service architecture",
      },
      {
        phase: 2,
        name: "Service Configuration",
        focus: `Configure: ${services.join(", ")}`,
      },
      {
        phase: 3,
        name: "Integration & Testing",
        focus: "Connect systems and validate workflows",
      },
      {
        phase: 4,
        name: "Launch & Optimization",
        focus: "Go-live support and performance review",
      },
    ];
  }

  private estimateWeeks(serviceCount: number): number {
    if (serviceCount <= 1) return 2;
    if (serviceCount <= 3) return 4;
    return 6;
  }
}

import { BaseAgent } from "./base-agent";
import type { AgentContext } from "../types/agent";
import type { AgentTask } from "../types/project";

const SERVICE_BUDGET_ESTIMATES: Record<string, number> = {
  website: 1500,
  chatbot: 500,
  automation: 800,
  receptionist: 1000,
  crm: 600,
  booking: 400,
  leads: 350,
  support: 450,
};

export class BudgetPlannerAgent extends BaseAgent {
  readonly id = "budget-planner";
  readonly name = "Budget Planner";
  readonly description =
    "Validates budget against requested scope and recommends phasing when needed.";

  canHandle(task: AgentTask): boolean {
    return task.type === "validate_budget";
  }

  async execute(task: AgentTask, context: AgentContext) {
    const { request } = context;
    const estimatedMinimum = this.estimateMinimumBudget(request.services);
    const fitsBudget = request.budget >= estimatedMinimum;
    const utilization = estimatedMinimum > 0 ? request.budget / estimatedMinimum : 1;

    return this.success(task, {
      budget: request.budget,
      estimatedMinimum,
      fitsBudget,
      utilizationRatio: Math.round(utilization * 100) / 100,
      recommendation: fitsBudget
        ? "Budget aligns with requested scope."
        : "Consider phased delivery or reduced initial scope.",
      serviceEstimates: Object.fromEntries(
        request.services.map((service) => [
          service,
          SERVICE_BUDGET_ESTIMATES[service] ?? 500,
        ]),
      ),
    }, "Budget validation complete.");
  }

  private estimateMinimumBudget(services: string[]): number {
    return services.reduce(
      (total, service) => total + (SERVICE_BUDGET_ESTIMATES[service] ?? 500),
      0,
    );
  }
}

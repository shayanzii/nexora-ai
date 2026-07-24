import { BaseAgent } from "./base-agent";
import type { AgentContext } from "../types/agent";
import type { AgentTask } from "../types/project";

export class RequirementsAnalystAgent extends BaseAgent {
  readonly id = "requirements-analyst";
  readonly name = "Requirements Analyst";
  readonly description =
    "Analyzes project briefs, clarifies goals, and extracts structured requirements.";

  canHandle(task: AgentTask): boolean {
    return task.type === "analyze_requirements";
  }

  async execute(task: AgentTask, context: AgentContext) {
    const { request } = context;

    return this.success(task, {
      industry: request.industry,
      goal: request.goal,
      budget: request.budget,
      services: request.services,
      requirements: {
        primaryObjective: request.goal,
        targetIndustry: request.industry,
        requestedServices: request.services,
        constraints: {
          budget: request.budget,
        },
      },
      openQuestions: this.buildOpenQuestions(request),
    }, "Requirements analysis complete.");
  }

  private buildOpenQuestions(request: { industry: string; services: string[]; budget: number }) {
    const questions: string[] = [];

    if (request.budget < 500) {
      questions.push("Budget may require phased delivery — confirm MVP scope.");
    }

    if (request.services.includes("website") && request.services.length > 2) {
      questions.push("Confirm whether website is net-new or an enhancement.");
    }

    if (questions.length === 0) {
      questions.push("Confirm timeline expectations and primary success metric.");
    }

    return questions;
  }
}

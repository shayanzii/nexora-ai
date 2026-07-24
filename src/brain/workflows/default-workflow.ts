import type { ProjectPlan } from "../types/project";

export const DEFAULT_WORKFLOW_ID = "standard-orchestration";

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  steps: string[];
}

export const DEFAULT_WORKFLOW: WorkflowDefinition = {
  id: DEFAULT_WORKFLOW_ID,
  name: "Standard Orchestration",
  description:
    "Sales qualification → discovery → budget validation → service planning → delivery sequencing",
  steps: [
    "qualify_client",
    "analyze_requirements",
    "validate_budget",
    "plan_service",
    "plan_delivery",
  ],
};

/** Validates that a plan follows the default workflow step sequence. */
export function validateWorkflowCoverage(plan: ProjectPlan): {
  valid: boolean;
  missingSteps: string[];
} {
  const taskTypes = new Set(plan.tasks.map((task) => task.type));
  const missingSteps = DEFAULT_WORKFLOW.steps.filter((step) => !taskTypes.has(step));

  return {
    valid: missingSteps.length === 0,
    missingSteps,
  };
}

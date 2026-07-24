import type { ProjectPlan, ProjectRequest } from "./project";
import type { SharedMemory } from "../memory/shared-memory";
import type { AgentContext } from "./agent";

/**
 * Shared runtime context passed to every agent during plan execution.
 * Extends AgentContext for backward compatibility with existing agents.
 */
export interface ProjectContext extends AgentContext {
  plan: ProjectPlan;
  memory: SharedMemory;
}

/** Reconstructs a ProjectRequest from a plan, preserving metadata. */
export function requestFromPlan(plan: ProjectPlan): ProjectRequest {
  return {
    industry: plan.industry,
    goal: plan.goal,
    budget: plan.budget,
    services: plan.services,
    metadata: plan.metadata,
  };
}

/**
 * Builds a ProjectContext for runtime execution.
 */
export function createProjectContext(
  plan: ProjectPlan,
  memory: SharedMemory,
): ProjectContext {
  return {
    requestId: plan.requestId,
    request: requestFromPlan(plan),
    plan,
    memory,
  };
}

import type { ProjectPlan } from "../types/project";

/**
 * Lightweight in-memory store for orchestration plans.
 * Replace with persistent storage when needed.
 */
export class InMemoryPlanStore {
  private readonly plans = new Map<string, ProjectPlan>();

  save(plan: ProjectPlan): void {
    this.plans.set(plan.requestId, plan);
  }

  get(requestId: string): ProjectPlan | undefined {
    return this.plans.get(requestId);
  }

  getAll(): ProjectPlan[] {
    return [...this.plans.values()];
  }

  delete(requestId: string): boolean {
    return this.plans.delete(requestId);
  }

  clear(): void {
    this.plans.clear();
  }
}

/** Singleton store for the current process lifetime. */
export const planStore = new InMemoryPlanStore();

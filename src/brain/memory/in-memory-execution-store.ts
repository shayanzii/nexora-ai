import type { ExecutionResult } from "../types/execution";

/**
 * In-memory store for completed execution results.
 */
export class InMemoryExecutionStore {
  private readonly results = new Map<string, ExecutionResult>();

  save(result: ExecutionResult): void {
    this.results.set(result.requestId, result);
  }

  get(requestId: string): ExecutionResult | undefined {
    return this.results.get(requestId);
  }

  getAll(): ExecutionResult[] {
    return [...this.results.values()];
  }

  delete(requestId: string): boolean {
    return this.results.delete(requestId);
  }

  clear(): void {
    this.results.clear();
  }
}

/** Singleton store for the current process lifetime. */
export const executionStore = new InMemoryExecutionStore();

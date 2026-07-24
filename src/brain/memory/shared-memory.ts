import type { AgentResult } from "../types/project";

/**
 * Shared in-process memory for a single project execution.
 * Agents read prior outputs via context.memory during sequential runs.
 */
export class SharedMemory {
  private readonly results = new Map<string, AgentResult>();
  private readonly agentIndex = new Map<string, AgentResult[]>();

  record(result: AgentResult): void {
    this.results.set(result.taskId, result);

    const existing = this.agentIndex.get(result.agentId) ?? [];
    existing.push(result);
    this.agentIndex.set(result.agentId, existing);
  }

  get(taskId: string): AgentResult | undefined {
    return this.results.get(taskId);
  }

  getByAgent(agentId: string): AgentResult[] {
    return [...(this.agentIndex.get(agentId) ?? [])];
  }

  getAll(): AgentResult[] {
    return [...this.results.values()];
  }

  has(taskId: string): boolean {
    return this.results.has(taskId);
  }

  size(): number {
    return this.results.size;
  }

  /** Returns a serializable snapshot of all recorded agent outputs. */
  snapshot(): Record<string, AgentResult> {
    return Object.fromEntries(this.results.entries());
  }

  clear(): void {
    this.results.clear();
    this.agentIndex.clear();
  }
}

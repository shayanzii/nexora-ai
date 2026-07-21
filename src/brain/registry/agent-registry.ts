import type { Agent } from "../types/agent";
import type { AgentTask } from "../types/project";

/**
 * Central registry for all Nexora Brain agents.
 */
export class AgentRegistry {
  private readonly agents = new Map<string, Agent>();

  register(agent: Agent): void {
    if (this.agents.has(agent.id)) {
      throw new Error(`Agent with id '${agent.id}' is already registered.`);
    }

    this.agents.set(agent.id, agent);
  }

  get(id: string): Agent | undefined {
    return this.agents.get(id);
  }

  getAll(): Agent[] {
    return [...this.agents.values()];
  }

  findCompatibleAgents(task: AgentTask): Agent[] {
    return this.getAll().filter((agent) => agent.canHandle(task));
  }

  has(id: string): boolean {
    return this.agents.has(id);
  }

  size(): number {
    return this.agents.size;
  }
}

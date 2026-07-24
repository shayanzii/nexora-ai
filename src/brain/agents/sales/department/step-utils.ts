import type {
  LeadQualificationOutput,
  SalesDepartmentStepResult,
} from "../../../types/sales";
import type { AgentResult } from "../../../types/project";

export function readStepOutput<T>(
  stepResults: SalesDepartmentStepResult[],
  agentId: string,
): T | undefined {
  const step = stepResults.find((s) => s.agentId === agentId);
  return step?.output as T | undefined;
}

export function readAgentResultOutput<T>(result: AgentResult): T {
  return result.output as T;
}

export type { LeadQualificationOutput };

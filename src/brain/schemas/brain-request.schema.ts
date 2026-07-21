import type { Proposal } from "../departments/sales/proposal";
import type { ProjectRequest } from "../types/project";
import { validateProjectRequest } from "./project-request.schema";
import type { ValidationResult } from "./project-request.schema";

export interface BrainRequestPayload {
  request: ProjectRequest;
  execute: boolean;
  includeProposal: boolean;
  includeStrategicAnalysis: boolean;
}

/**
 * Validates a brain API payload including optional runtime execution and proposal flags.
 * Backward compatible: `execute` and `includeProposal` default to false when omitted.
 */
export function validateBrainRequest(body: unknown): ValidationResult<BrainRequestPayload> {
  if (body === null || typeof body !== "object") {
    return { success: false, errors: ["Request body must be a JSON object."] };
  }

  const record = body as Record<string, unknown>;
  const validation = validateProjectRequest(body);

  if (!validation.success || !validation.data) {
    return { success: false, errors: validation.errors };
  }

  let execute = false;
  if (record.execute !== undefined) {
    if (typeof record.execute !== "boolean") {
      return {
        success: false,
        errors: ["'execute' must be a boolean when provided."],
      };
    }
    execute = record.execute;
  }

  let includeProposal = false;
  if (record.includeProposal !== undefined) {
    if (typeof record.includeProposal !== "boolean") {
      return {
        success: false,
        errors: ["'includeProposal' must be a boolean when provided."],
      };
    }
    includeProposal = record.includeProposal;
  }

  let includeStrategicAnalysis = false;
  if (record.includeStrategicAnalysis !== undefined) {
    if (typeof record.includeStrategicAnalysis !== "boolean") {
      return {
        success: false,
        errors: ["'includeStrategicAnalysis' must be a boolean when provided."],
      };
    }
    includeStrategicAnalysis = record.includeStrategicAnalysis;
  }

  return {
    success: true,
    data: {
      request: validation.data,
      execute,
      includeProposal,
      includeStrategicAnalysis,
    },
    errors: [],
  };
}

export type { Proposal };

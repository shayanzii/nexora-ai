import type { ProjectRequest } from "../types";

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors: string[];
}

const MAX_SERVICES = 20;
const MAX_STRING_LENGTH = 500;

function isNonEmptyString(value: unknown, field: string, errors: string[]): value is string {
  if (typeof value !== "string" || !value.trim()) {
    errors.push(`'${field}' must be a non-empty string.`);
    return false;
  }

  if (value.trim().length > MAX_STRING_LENGTH) {
    errors.push(`'${field}' exceeds maximum length of ${MAX_STRING_LENGTH} characters.`);
    return false;
  }

  return true;
}

function isStringArray(value: unknown, field: string, errors: string[]): value is string[] {
  if (!Array.isArray(value) || value.length === 0) {
    errors.push(`'${field}' must be a non-empty array of strings.`);
    return false;
  }

  if (value.length > MAX_SERVICES) {
    errors.push(`'${field}' cannot contain more than ${MAX_SERVICES} items.`);
    return false;
  }

  for (const item of value) {
    if (typeof item !== "string" || !item.trim()) {
      errors.push(`Every item in '${field}' must be a non-empty string.`);
      return false;
    }
  }

  return true;
}

/**
 * Validates and normalizes an incoming project request payload.
 */
export function validateProjectRequest(body: unknown): ValidationResult<ProjectRequest> {
  const errors: string[] = [];

  if (body === null || typeof body !== "object") {
    return { success: false, errors: ["Request body must be a JSON object."] };
  }

  const record = body as Record<string, unknown>;

  const industry = isNonEmptyString(record.industry, "industry", errors)
    ? record.industry.trim()
    : "";
  const goal = isNonEmptyString(record.goal, "goal", errors) ? record.goal.trim() : "";

  let budget = 0;
  if (typeof record.budget !== "number" || !Number.isFinite(record.budget) || record.budget < 0) {
    errors.push("'budget' must be a non-negative number.");
  } else {
    budget = record.budget;
  }

  const servicesRaw = isStringArray(record.services, "services", errors)
    ? record.services.map((s) => s.trim().toLowerCase())
    : [];

  const metadata =
    record.metadata !== undefined &&
    record.metadata !== null &&
    typeof record.metadata === "object" &&
    !Array.isArray(record.metadata)
      ? (record.metadata as Record<string, unknown>)
      : undefined;

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      industry,
      goal,
      budget,
      services: [...new Set(servicesRaw)],
      metadata,
    },
    errors: [],
  };
}

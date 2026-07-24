import type { ComplexityLevel } from "../../types/project";

/** Budget estimate produced by the CEO Agent. */
export interface CEOBudgetEstimate {
  min: number;
  max: number;
  currency: string;
  rationale: string;
}

/** Timeline estimate produced by the CEO Agent. */
export interface CEOTimelineEstimate {
  minWeeks: number;
  maxWeeks: number;
  summary: string;
}

/** Structured business analysis output from the CEO Agent. */
export interface CEOBusinessAnalysis {
  business: string;
  industry: string;
  goals: string[];
  requirements: string[];
  missingInformation: string[];
  recommendedDepartments: string[];
  estimatedComplexity: ComplexityLevel;
  estimatedBudget: CEOBudgetEstimate;
  estimatedTimeline: CEOTimelineEstimate;
  confidence: number;
  followUpQuestions: string[];
}

export class CEOOutputValidationError extends Error {
  constructor(message: string, readonly field?: string) {
    super(message);
    this.name = "CEOOutputValidationError";
  }
}

const COMPLEXITY_LEVELS = new Set<ComplexityLevel>([
  "low",
  "medium",
  "high",
  "enterprise",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new CEOOutputValidationError(`${field} must be a non-empty string.`, field);
  }
  return value.trim();
}

function readStringArray(value: unknown, field: string): string[] {
  if (!Array.isArray(value)) {
    throw new CEOOutputValidationError(`${field} must be an array of strings.`, field);
  }

  return value.map((entry, index) => {
    if (typeof entry !== "string" || !entry.trim()) {
      throw new CEOOutputValidationError(
        `${field}[${index}] must be a non-empty string.`,
        field,
      );
    }
    return entry.trim();
  });
}

function readNumber(value: unknown, field: string): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new CEOOutputValidationError(`${field} must be a number.`, field);
  }
  return value;
}

/** Extracts JSON object text from raw LLM content. */
export function extractJsonObject(content: string): string {
  const trimmed = content.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return trimmed.slice(start, end + 1);
  }

  return trimmed;
}

/** Parses and validates CEO Agent JSON output. */
export function parseCEOOutputFromJson(content: string): CEOBusinessAnalysis {
  let parsed: unknown;

  try {
    parsed = JSON.parse(extractJsonObject(content));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new CEOOutputValidationError(`Invalid JSON output: ${message}`);
  }

  return validateCEOOutput(parsed);
}

/** Validates an unknown value against the CEO business analysis schema. */
export function validateCEOOutput(value: unknown): CEOBusinessAnalysis {
  if (!isRecord(value)) {
    throw new CEOOutputValidationError("CEO output must be a JSON object.");
  }

  const complexity = readString(value.estimatedComplexity, "estimatedComplexity");
  if (!COMPLEXITY_LEVELS.has(complexity as ComplexityLevel)) {
    throw new CEOOutputValidationError(
      "estimatedComplexity must be one of low, medium, high, enterprise.",
      "estimatedComplexity",
    );
  }

  if (!isRecord(value.estimatedBudget)) {
    throw new CEOOutputValidationError("estimatedBudget must be an object.", "estimatedBudget");
  }

  if (!isRecord(value.estimatedTimeline)) {
    throw new CEOOutputValidationError("estimatedTimeline must be an object.", "estimatedTimeline");
  }

  const confidence = readNumber(value.confidence, "confidence");
  if (confidence < 0 || confidence > 1) {
    throw new CEOOutputValidationError("confidence must be between 0 and 1.", "confidence");
  }

  return {
    business: readString(value.business, "business"),
    industry: readString(value.industry, "industry"),
    goals: readStringArray(value.goals, "goals"),
    requirements: readStringArray(value.requirements, "requirements"),
    missingInformation: readStringArray(value.missingInformation, "missingInformation"),
    recommendedDepartments: readStringArray(
      value.recommendedDepartments,
      "recommendedDepartments",
    ),
    estimatedComplexity: complexity as ComplexityLevel,
    estimatedBudget: {
      min: readNumber(value.estimatedBudget.min, "estimatedBudget.min"),
      max: readNumber(value.estimatedBudget.max, "estimatedBudget.max"),
      currency: readString(value.estimatedBudget.currency, "estimatedBudget.currency"),
      rationale: readString(value.estimatedBudget.rationale, "estimatedBudget.rationale"),
    },
    estimatedTimeline: {
      minWeeks: readNumber(value.estimatedTimeline.minWeeks, "estimatedTimeline.minWeeks"),
      maxWeeks: readNumber(value.estimatedTimeline.maxWeeks, "estimatedTimeline.maxWeeks"),
      summary: readString(value.estimatedTimeline.summary, "estimatedTimeline.summary"),
    },
    confidence,
    followUpQuestions: Array.isArray(value.followUpQuestions)
      ? readStringArray(value.followUpQuestions, "followUpQuestions")
      : [],
  };
}

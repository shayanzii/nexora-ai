import type {
  ClarificationQuestion,
  ClientDiscoveryProfile,
  MissingFieldReport,
  SalesRequiredField,
} from "../../../types/sales";
import type { ProjectRequest } from "../../../types/project";
import { SALES_REQUIRED_FIELDS } from "./constants";

export function parseClientDiscoveryProfile(request: ProjectRequest): ClientDiscoveryProfile {
  const metadata = request.metadata ?? {};

  return {
    businessName: readMetadataString(metadata, "businessName"),
    industry: readNonEmptyString(request.industry),
    country: readMetadataString(metadata, "country"),
    targetAudience: readMetadataString(metadata, "targetAudience"),
    services: request.services.length > 0 ? request.services : [],
    goals: readNonEmptyString(request.goal),
    budget: readBudget(request.budget),
    timeline: readMetadataString(metadata, "timeline"),
  };
}

export function detectMissingFields(profile: ClientDiscoveryProfile): MissingFieldReport[] {
  const missing: MissingFieldReport[] = [];

  if (!profile.businessName) {
    missing.push(buildMissingReport("businessName", "Business name was not provided."));
  }
  if (!profile.industry) {
    missing.push(buildMissingReport("industry", "Industry was not provided or is empty."));
  }
  if (!profile.country) {
    missing.push(buildMissingReport("country", "Country was not provided."));
  }
  if (!profile.targetAudience) {
    missing.push(buildMissingReport("targetAudience", "Target audience was not provided."));
  }
  if (profile.services.length === 0) {
    missing.push(buildMissingReport("services", "No services were requested."));
  }
  if (!profile.goals) {
    missing.push(buildMissingReport("goals", "Project goals were not provided or are empty."));
  }
  if (profile.budget === null) {
    missing.push(buildMissingReport("budget", "Budget was not provided or is zero."));
  }
  if (!profile.timeline) {
    missing.push(buildMissingReport("timeline", "Timeline or go-live expectation was not provided."));
  }

  return missing;
}

export function generateClarificationQuestions(
  missing: MissingFieldReport[],
): ClarificationQuestion[] {
  return missing.map((report) => {
    const definition = SALES_REQUIRED_FIELDS.find((f) => f.field === report.field);

    return {
      field: report.field,
      question: definition?.question ?? `Please provide ${report.label.toLowerCase()}.`,
      priority: "required",
    };
  });
}

export function calculateCompletenessScore(profile: ClientDiscoveryProfile): number {
  const total = SALES_REQUIRED_FIELDS.length;
  const missing = detectMissingFields(profile).length;
  return Math.round(((total - missing) / total) * 100);
}

export function listPresentFields(profile: ClientDiscoveryProfile): SalesRequiredField[] {
  const missingFields = new Set(detectMissingFields(profile).map((m) => m.field));
  return SALES_REQUIRED_FIELDS.filter((def) => !missingFields.has(def.field)).map(
    (def) => def.field,
  );
}

export function isProfileComplete(profile: ClientDiscoveryProfile): boolean {
  return detectMissingFields(profile).length === 0;
}

function buildMissingReport(field: SalesRequiredField, reason: string): MissingFieldReport {
  const definition = SALES_REQUIRED_FIELDS.find((f) => f.field === field)!;

  return {
    field,
    label: definition.label,
    reason,
  };
}

function readMetadataString(metadata: Record<string, unknown>, key: string): string | null {
  const value = metadata[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function readNonEmptyString(value: string): string | null {
  return value.trim() ? value.trim() : null;
}

function readBudget(value: number): number | null {
  return Number.isFinite(value) && value > 0 ? value : null;
}

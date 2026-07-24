import type { CEOBusinessAnalysis } from "../agents/ceo/CEOOutput";

/** Well-known Nexora departments. Additional IDs register without code changes. */
export const KNOWN_DEPARTMENTS = [
  "sales",
  "website",
  "seo",
  "automation",
  "app",
  "marketing",
  "brand",
  "qa",
  "delivery",
] as const;

export type KnownDepartmentId = (typeof KNOWN_DEPARTMENTS)[number];

/** Extensible department identifier. */
export type DepartmentId = KnownDepartmentId | (string & {});

/** Canonical department execution order. Unknown departments append at end. */
export const DEPARTMENT_ORDER: readonly string[] = KNOWN_DEPARTMENTS;

/** Department-level dependency rules — extensible via registration. */
export const DEFAULT_DEPARTMENT_DEPENDENCIES: Readonly<Record<string, readonly string[]>> = {
  sales: [],
  brand: ["sales"],
  website: ["sales"],
  seo: ["website"],
  automation: ["website"],
  marketing: ["website"],
  app: ["website"],
  qa: ["website"],
  delivery: ["qa"],
};

/** Maps service keywords to orchestrator departments. */
export const SERVICE_DEPARTMENT_MAP: Readonly<Record<string, DepartmentId>> = {
  website: "website",
  seo: "seo",
  chatbot: "automation",
  automation: "automation",
  "ai chatbot": "automation",
  app: "app",
  "mobile app": "app",
  marketing: "marketing",
  brand: "brand",
};

export interface DepartmentSelectionInput {
  analysis: CEOBusinessAnalysis;
  services?: readonly string[];
}

/** Infers departments from CEO analysis, services, and requirements text. */
export function selectDepartments(input: DepartmentSelectionInput): DepartmentId[] {
  const selected = new Set<string>();

  for (const department of input.analysis.recommendedDepartments) {
    selected.add(normalizeDepartmentId(department));
  }

  for (const service of input.services ?? []) {
    const mapped = mapServiceToDepartment(service);
    if (mapped) selected.add(mapped);
  }

  for (const requirement of input.analysis.requirements) {
    const inferred = inferDepartmentFromText(requirement);
    for (const department of inferred) {
      selected.add(department);
    }
  }

  if (selected.size === 0 || !selected.has("sales")) {
    selected.add("sales");
  }

  const buildDepartments = ["website", "seo", "automation", "app", "marketing", "brand"];
  const hasBuildWork = [...selected].some((department) => buildDepartments.includes(department));

  if (hasBuildWork) {
    selected.add("qa");
    selected.add("delivery");
  }

  return sortDepartments([...selected]);
}

/** Returns ordered departments respecting canonical pipeline order. */
export function sortDepartments(departments: readonly string[]): DepartmentId[] {
  const unique = [...new Set(departments.map(normalizeDepartmentId))];
  const orderIndex = new Map(DEPARTMENT_ORDER.map((id, index) => [id, index]));

  return unique.sort((a, b) => {
    const aIndex = orderIndex.get(a) ?? Number.MAX_SAFE_INTEGER;
    const bIndex = orderIndex.get(b) ?? Number.MAX_SAFE_INTEGER;
    if (aIndex !== bIndex) return aIndex - bIndex;
    return a.localeCompare(b);
  });
}

/** Resolves department dependencies for a selected set. */
export function resolveDepartmentDependencies(
  departments: readonly string[],
  rules: Readonly<Record<string, readonly string[]>> = DEFAULT_DEPARTMENT_DEPENDENCIES,
): Map<string, string[]> {
  const selected = new Set(departments);
  const resolved = new Map<string, string[]>();

  for (const department of departments) {
    const deps = (rules[department] ?? []).filter((dep) => selected.has(dep));
    resolved.set(department, deps);
  }

  return resolved;
}

function normalizeDepartmentId(value: string): string {
  return value.trim().toLowerCase();
}

function mapServiceToDepartment(service: string): DepartmentId | undefined {
  const normalized = service.trim().toLowerCase();
  if (SERVICE_DEPARTMENT_MAP[normalized]) {
    return SERVICE_DEPARTMENT_MAP[normalized];
  }

  for (const [keyword, department] of Object.entries(SERVICE_DEPARTMENT_MAP)) {
    if (normalized.includes(keyword)) {
      return department;
    }
  }

  return inferDepartmentFromText(normalized)[0];
}

function inferDepartmentFromText(text: string): DepartmentId[] {
  const lower = text.toLowerCase();
  const matches: DepartmentId[] = [];

  if (/website|web site|site build/.test(lower)) matches.push("website");
  if (/\bseo\b|search engine|keyword/.test(lower)) matches.push("seo");
  if (/chatbot|automation|ai agent|voice agent/.test(lower)) matches.push("automation");
  if (/mobile app|\bapp\b/.test(lower)) matches.push("app");
  if (/marketing|campaign|ads/.test(lower)) matches.push("marketing");
  if (/brand|identity/.test(lower)) matches.push("brand");

  return matches;
}

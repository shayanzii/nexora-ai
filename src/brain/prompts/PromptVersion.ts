/** Semantic version representation for prompt templates. */
export interface PromptVersionParts {
  major: number;
  minor: number;
  patch: number;
}

const VERSION_PATTERN = /^(\d+)\.(\d+)\.(\d+)$/;

/** Parses a semantic version string into numeric parts. */
export function parsePromptVersion(version: string): PromptVersionParts {
  const match = VERSION_PATTERN.exec(version.trim());
  if (!match) {
    throw new Error(`Invalid prompt version '${version}'. Expected major.minor.patch.`);
  }

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  };
}

/** Formats version parts as a semantic version string. */
export function formatPromptVersion(version: PromptVersionParts): string {
  return `${version.major}.${version.minor}.${version.patch}`;
}

/** Compares two prompt versions. Returns negative when a < b, positive when a > b. */
export function comparePromptVersions(
  a: PromptVersionParts,
  b: PromptVersionParts,
): number {
  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  return a.patch - b.patch;
}

/** Returns the newer of two version strings. */
export function maxPromptVersion(a: string, b: string): string {
  const parsedA = parsePromptVersion(a);
  const parsedB = parsePromptVersion(b);
  return comparePromptVersions(parsedA, parsedB) >= 0 ? a : b;
}

/** Future extension point — locale-specific prompt variants. */
export interface LocalizedPromptVariant {
  locale: string;
  template: string;
}

/** Future extension point — optimized prompt candidate for experimentation. */
export interface PromptOptimizationCandidate {
  id: string;
  parentPromptId: string;
  template: string;
  score?: number;
}

/** Future extension point — A/B test assignment metadata. */
export interface PromptExperimentAssignment {
  experimentId: string;
  variantId: string;
  promptId: string;
  version: string;
}

/** Future extension point — dynamic prompt selection criteria. */
export interface DynamicPromptSelectionCriteria {
  department?: string;
  tags?: readonly string[];
  locale?: string;
  experimentId?: string;
}

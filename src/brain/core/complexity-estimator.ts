import type { ComplexityLevel, ProjectRequest } from "../types/project";

export interface ComplexityEstimate {
  level: ComplexityLevel;
  score: number;
  factors: string[];
}

/**
 * Rule-based complexity estimator for project requests.
 * Designed to be replaced or augmented with ML scoring later.
 */
export function estimateComplexity(request: ProjectRequest): ComplexityEstimate {
  let score = 0;
  const factors: string[] = [];

  score += request.services.length * 10;
  if (request.services.length >= 4) {
    factors.push("Multiple services increase coordination overhead");
  }

  if (request.budget >= 10000) {
    score += 25;
    factors.push("Enterprise-level budget");
  } else if (request.budget >= 5000) {
    score += 15;
    factors.push("High-value engagement");
  } else if (request.budget < 1000) {
    score += 5;
    factors.push("Budget constraints may require phasing");
  }

  const regulated = ["healthcare", "medical", "dental", "legal", "finance"];
  if (regulated.includes(request.industry.trim().toLowerCase())) {
    score += 20;
    factors.push("Regulated industry adds compliance complexity");
  }

  if (request.goal.length > 120) {
    score += 5;
    factors.push("Detailed goal suggests broader scope");
  }

  const level = scoreToLevel(score);

  return { level, score, factors };
}

function scoreToLevel(score: number): ComplexityLevel {
  if (score >= 70) return "enterprise";
  if (score >= 45) return "high";
  if (score >= 25) return "medium";
  return "low";
}

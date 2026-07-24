import type { RecommendedStack } from "./WebsiteTypes";

/** Recommends deterministic tech stack for website execution. */
export function planTechStack(flags: {
  hasBlog: boolean;
  hasChatbot: boolean;
  complexity: string;
}): RecommendedStack {
  return {
    framework: "Next.js",
    styling: "Tailwind CSS",
    language: "TypeScript",
    hosting: "Vercel",
    cms: flags.hasBlog ? "MDX content collections" : undefined,
    analytics: "Google Analytics 4",
    rationale:
      "Next.js + Tailwind + TypeScript on Vercel delivers performance, SEO, and rapid iteration " +
      `for ${flags.complexity}-complexity projects${flags.hasChatbot ? " with chatbot integration" : ""}.`,
  };
}

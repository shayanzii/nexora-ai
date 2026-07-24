import type { CEOBusinessAnalysis } from "../../agents/ceo/CEOOutput";

import type { RequirementAnalysis, SalesDiscoveryQuestion } from "./SalesTypes";

export interface DiscoveryEngineInput {
  analysis: CEOBusinessAnalysis;
  requirements: RequirementAnalysis;
  services?: readonly string[];
}

const CORE_DISCOVERY_QUESTIONS: readonly Omit<SalesDiscoveryQuestion, "id">[] = [
  {
    question: "What is your current website?",
    category: "technical",
    priority: "required",
    rationale: "Determines migration scope, redesign depth, and integration approach.",
  },
  {
    question: "Do you already use online booking?",
    category: "technical",
    priority: "required",
    rationale: "Identifies scheduling integration requirements for chatbot and automation.",
  },
  {
    question: "Who is your target customer?",
    category: "discovery",
    priority: "required",
    rationale: "Shapes messaging, service positioning, and conversion strategy.",
  },
  {
    question: "What makes your business different from competitors?",
    category: "discovery",
    priority: "recommended",
    rationale: "Informs brand voice, trust elements, and unique value proposition.",
  },
  {
    question: "Do you currently run Google Ads or other paid campaigns?",
    category: "marketing",
    priority: "recommended",
    rationale: "Aligns SEO and landing page strategy with existing acquisition channels.",
  },
];

const INDUSTRY_QUESTIONS: Readonly<Record<string, readonly Omit<SalesDiscoveryQuestion, "id">[]>> = {
  "dental-clinic": [
    {
      question: "How do patients currently book appointments (phone, walk-in, portal)?",
      category: "qualification",
      priority: "required",
    },
    {
      question: "Which dental services drive the most revenue (cosmetic, preventative, emergency)?",
      category: "discovery",
      priority: "recommended",
    },
  ],
  hvac: [
    {
      question: "What is your average emergency call volume after hours?",
      category: "qualification",
      priority: "required",
    },
  ],
  restaurant: [
    {
      question: "Do you accept reservations online or only by phone?",
      category: "technical",
      priority: "required",
    },
  ],
};

/** Generates intelligent discovery questions from CEO analysis and requirement gaps. */
export function generateDiscoveryQuestions(input: DiscoveryEngineInput): SalesDiscoveryQuestion[] {
  const questions: SalesDiscoveryQuestion[] = [];
  const seen = new Set<string>();

  const addQuestion = (question: Omit<SalesDiscoveryQuestion, "id">, index: number): void => {
    const normalized = question.question.toLowerCase();
    if (seen.has(normalized)) return;
    seen.add(normalized);
    questions.push({ ...question, id: `discovery-${index + 1}` });
  };

  let index = 0;

  for (const question of CORE_DISCOVERY_QUESTIONS) {
    addQuestion(question, index++);
  }

  const industryId = normalizeIndustryId(input.analysis.industry);
  for (const question of INDUSTRY_QUESTIONS[industryId] ?? []) {
    addQuestion(question, index++);
  }

  for (const followUp of input.analysis.followUpQuestions) {
    addQuestion(
      {
        question: followUp.endsWith("?") ? followUp : `${followUp}?`,
        category: "qualification",
        priority: "required",
        rationale: "Identified by CEO analysis as critical for scoping.",
      },
      index++,
    );
  }

  for (const missing of input.requirements.missingInformation) {
    addQuestion(
      {
        question: buildMissingInfoQuestion(missing),
        category: "qualification",
        priority: "required",
        rationale: `Missing information: ${missing}`,
      },
      index++,
    );
  }

  if (includesService(input.services, ["seo"])) {
    addQuestion(
      {
        question: "Which local keywords or neighbourhoods are highest priority for search visibility?",
        category: "marketing",
        priority: "recommended",
      },
      index++,
    );
  }

  if (includesService(input.services, ["chatbot", "automation", "ai-chatbot"])) {
    addQuestion(
      {
        question: "What are the top 10 questions customers ask before booking?",
        category: "discovery",
        priority: "required",
        rationale: "Feeds chatbot knowledge base and automation triggers.",
      },
      index++,
    );
  }

  return questions;
}

function buildMissingInfoQuestion(missing: string): string {
  const normalized = missing.toLowerCase();
  if (normalized.includes("timeline")) {
    return "What timeline or go-live date are you targeting?";
  }
  if (normalized.includes("budget")) {
    return "What budget range has been approved for this initiative?";
  }
  return `Can you provide more detail about ${missing}?`;
}

function includesService(services: readonly string[] | undefined, keywords: readonly string[]): boolean {
  if (!services?.length) return false;
  return services.some((service) =>
    keywords.some((keyword) => service.toLowerCase().includes(keyword)),
  );
}

function normalizeIndustryId(industry: string): string {
  return industry.trim().toLowerCase().replace(/\s+/g, "-");
}

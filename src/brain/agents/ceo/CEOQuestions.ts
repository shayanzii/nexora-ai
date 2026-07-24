import type { CEOContext } from "./CEOContext";

const QUESTION_TEMPLATES: Record<string, (context: CEOContext) => string> = {
  company: (context) =>
    `What is the official business name for this ${context.industry} project?`,
  targetAudience: () => "Who is the primary target audience for this project?",
  timeline: () => "What timeline or launch date are you targeting?",
  services: () =>
    "Which Nexora services are you most interested in (website, chatbot, automation, etc.)?",
  budget: (context) =>
    `Can you confirm the available budget range beyond ${context.budget}?`,
  country: () => "Which country or region should this project target?",
  goal: (context) =>
    `Can you clarify the primary business goal beyond "${context.goal}"?`,
};

/** Generates follow-up questions from missing information fields. */
export function generateFollowUpQuestions(
  missingInformation: readonly string[],
  context: CEOContext,
): string[] {
  const questions = missingInformation.map((field) => {
    const normalized = field.trim().toLowerCase();
    const template = QUESTION_TEMPLATES[normalized];
    return template ? template(context) : `Can you provide more detail about ${field}?`;
  });

  return [...new Set(questions)];
}

/** Builds default discovery questions when the request is incomplete. */
export function buildDefaultDiscoveryQuestions(context: CEOContext): string[] {
  const questions: string[] = [];

  if (context.company === "Unknown business") {
    questions.push(QUESTION_TEMPLATES.company(context));
  }
  if (!context.targetAudience) {
    questions.push(QUESTION_TEMPLATES.targetAudience(context));
  }
  if (!context.timeline) {
    questions.push(QUESTION_TEMPLATES.timeline(context));
  }
  if (context.services.length === 0) {
    questions.push(QUESTION_TEMPLATES.services(context));
  }

  return questions;
}

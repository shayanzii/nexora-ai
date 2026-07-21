import type { KnowledgePrompt } from "../types";

export const KNOWLEDGE_PROMPTS: KnowledgePrompt[] = [
  {
    id: "ceo-orchestration",
    domain: "orchestration",
    template:
      "Orchestrate specialist agents — never build websites or write code directly. Analyze the project brief and produce an execution plan.",
  },
  {
    id: "sales-qualification",
    domain: "sales",
    template:
      "Validate all required client fields before proceeding to discovery and proposal generation.",
  },
  {
    id: "proposal-generation",
    domain: "proposal",
    template:
      "Generate structured JSON proposals from knowledge-driven industry profiles, service definitions, and pricing data.",
  },
];

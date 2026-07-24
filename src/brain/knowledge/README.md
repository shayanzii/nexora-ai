# Nexora Brain — Knowledge Layer

The Knowledge Layer is a centralized, data-driven repository for all business knowledge consumed by Nexora Brain agents. **Knowledge is completely separated from agent logic** — agents request information through `KnowledgeRegistry` and never embed industry facts, pricing, or service definitions directly.

## Architecture

```
src/brain/knowledge/
├── index.ts           # Public API exports
├── registry.ts        # KnowledgeRegistry (singleton)
├── types.ts           # Shared knowledge interfaces
├── industries/        # Industry profiles (dentist, HVAC, plumbing, law firm, restaurant)
├── services/          # Service library (website, chatbot, voice agent, etc.)
├── playbooks/         # Industry-specific business playbooks
├── templates/         # Reusable proposal building blocks
├── pricing/           # Configurable pricing ranges and policy
└── prompts/           # Knowledge-backed prompt templates
```

## KnowledgeRegistry

All agents access knowledge through the registry singleton:

```typescript
import { getKnowledgeRegistry } from "@/src/brain/knowledge";

const knowledge = getKnowledgeRegistry();

// Industry
knowledge.getIndustry("HVAC");
knowledge.getIndustryChallenges("dental");
knowledge.isRegulatedIndustry("law firm");

// Services
knowledge.getService("chatbot");
knowledge.getServiceDeliverable("website");
knowledge.resolveServiceId("receptionist"); // → "ai-voice-agent"

// Pricing
knowledge.estimatePriceRange(["website", "chatbot"]);
knowledge.getPricingPolicy();

// Playbooks
knowledge.getPlaybook("hvac-lead-generation");
knowledge.getPlaybooksByIndustry("dentist");

// Proposal templates
knowledge.getProposalTemplatesByCategory("milestone");
knowledge.getProposalTemplate("assumption-client-access");

// Goal-based service hints
knowledge.getGoalServiceHints("generate more leads");
knowledge.getGoalServiceRationale("leads");
```

## Industry Profiles

Each profile includes:

| Field | Description |
|---|---|
| `commonBusinessGoals` | Typical objectives for the industry |
| `commonCustomerProblems` | Pain points used in proposals and discovery |
| `commonAutomationOpportunities` | Where AI delivers the most value |
| `recommendedAiServices` | Suggested service IDs |
| `websiteRecommendations` | Website CRO guidance |
| `socialMediaRecommendations` | Social channel guidance |
| `kpis` | Metrics to track success |
| `regulated` | Whether compliance review is required |

Supported industries: **Dentist**, **HVAC**, **Plumbing**, **Law Firm**, **Restaurant**.

## Service Library

Six primary services plus legacy aliases for backward compatibility:

| Service ID | Aliases |
|---|---|
| `business-website` | website, web, site |
| `ai-chatbot` | chatbot, chat, messenger |
| `ai-voice-agent` | receptionist, voice, phone |
| `workflow-automation` | automation, workflow |
| `crm-integration` | crm, pipeline |
| `social-media-management` | social-media, social |

Legacy service IDs (`booking`, `leads`, `support`) remain supported for existing API payloads.

## Playbooks

Industry playbooks define repeatable engagement patterns:

- HVAC Lead Generation
- Dental Appointment Booking
- Restaurant Reservations
- Law Firm Consultation
- Plumbing Emergency Response

## Pricing

Pricing lives in `pricing/index.ts` — **not in agents**. Agents call `estimatePriceRange()` and `estimateServicePrice()` on the registry. Update pricing by editing `SERVICE_PRICING` and `PRICING_POLICY`; no agent code changes required.

## Proposal Templates

Reusable blocks for assumptions, milestones, next steps, and risk mitigations. The Proposal Engine pulls template content from the registry instead of hardcoding strings.

## Adding New Knowledge

1. **New industry** — add a profile in `industries/index.ts` and register via `INDUSTRY_PROFILES` + `INDUSTRY_ALIASES`.
2. **New service** — add a definition in `services/index.ts`, pricing in `pricing/index.ts`.
3. **New playbook** — add to `playbooks/index.ts`.
4. **Runtime registration** — use `registerIndustry()`, `registerService()`, etc. for dynamic loading.

## Design Rules

- Agents import `getKnowledgeRegistry()` — never import raw knowledge arrays directly.
- Business facts, pricing, and industry data live only under `src/brain/knowledge/`.
- Agent logic handles orchestration; knowledge modules handle domain content.
- The website and runtime engine are unaffected by knowledge changes.

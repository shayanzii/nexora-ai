# Proposal Engine

The Proposal Engine generates **structured JSON proposals** from Sales Department pipeline outputs. No markdown, PDF, or HTML — only typed proposal objects.

## Location

```
src/brain/departments/sales/proposal/
├── schema.ts              # Proposal interfaces
├── proposal-generator.ts  # Pure generation logic
├── proposal-engine.ts     # ProposalEngine class
├── examples.ts            # Industry test fixtures
└── index.ts
```

## Pipeline Integration

```
Lead Qualification → Discovery → Business Analysis → Pricing → Proposal Engine
```

The `ProposalEngineAgent` reads all prior step outputs from **Shared Memory** and invokes `ProposalEngine.generate()`.

## Proposal Schema

| Field | Description |
|---|---|
| `executiveSummary` | High-level project overview |
| `clientChallenges` | Industry-specific pain points |
| `recommendedSolution` | Proposed AI engagement approach |
| `recommendedServices` | Primary and secondary services |
| `deliverables` | Scoped deliverable list per service |
| `timeline` | Estimated weeks and summary |
| `milestones` | Phased delivery milestones |
| `estimatedPriceRange` | CAD min/max range |
| `assumptions` | Scoping assumptions |
| `risks` | Project risks with mitigations |
| `nextSteps` | Client action items |

## API Usage

```json
POST /api/brain
{
  "industry": "HVAC",
  "goal": "Capture emergency leads",
  "budget": 3500,
  "services": ["receptionist", "booking"],
  "includeProposal": true,
  "metadata": {
    "businessName": "Arctic Air Solutions",
    "country": "Canada",
    "targetAudience": "Homeowners in GTA",
    "timeline": "Before summer peak"
  }
}
```

Response includes both `plan` and `proposal`.

## Unit Test Examples

```typescript
import {
  ProposalEngine,
  PROPOSAL_EXAMPLE_ENGINE_INPUT,
  PROPOSAL_EXAMPLE_HVAC_REQUEST,
  generateProposalForRequest,
} from "@/src/brain";

// Direct engine test
const engine = new ProposalEngine();
const result = engine.generate(PROPOSAL_EXAMPLE_ENGINE_INPUT);

// Full pipeline test
const pipeline = await generateProposalForRequest(PROPOSAL_EXAMPLE_HVAC_REQUEST);
```

Industry fixtures: `dentist`, `hvac`, `plumbing`, `lawFirm`, `restaurant`.

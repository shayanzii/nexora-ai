# Nexora Brain — End-to-End Demo

Sprint 9.4 manual demo — full pipeline through Website Execution Agent.

## What it validates

```
Customer Request
      ↓
CEOIntelligenceAgent.analyze()
      ↓
ProjectOrchestrator.orchestrate()
      ↓
SalesExecutionAgent.execute()
      ↓
PricingEngine.price()
      ↓
WebsiteExecutionAgent.plan()
      ↓
Website Blueprint
```

## Prerequisites

- Node.js 18+
- Dependencies installed: `npm install`
- **Recommended:** `OPENAI_API_KEY` set for live LLM execution

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Recommended | OpenAI API key for live LLM analysis. Without it, the demo runs in deterministic fallback mode. |

The demo automatically loads `.env.local` from the project root if present (same file used by `next dev`).

Example `.env.local`:

```env
OPENAI_API_KEY=sk-your-key-here
```

## How to run

```bash
npm run demo
```

## Demo scenario

**Company:** Smile Dental  
**Industry:** Dental Clinic  
**Goal:** Increase booked appointments  
**Budget:** $7,000 CAD  
**Requested Services:** Website, SEO, AI Chatbot  
**Future Plans:** Mobile App  

## Expected output

The demo prints formatted sections to the console:

1. **Pipeline Validation** — confirms Prompt Engine, LLM Gateway, and OpenAI Provider are wired
2. **Customer Request** — the simulated intake data
3. **Running CEOIntelligenceAgent.analyze()** — execution timing
4. **Business Analysis** — structured output including:
   - Industry & business goals
   - Estimated complexity, budget, and timeline
   - Recommended departments (typically `sales`, `website`)
   - Requirements, missing information, and follow-up questions
   - Confidence score
   - Future upsells (Mobile App)
5. **Pipeline Result** — whether live LLM (`gpt-4.1` via Gateway) or fallback path was used

### Example (abbreviated)

```
Nexora Brain — End-to-End Demo
Sprint 9.0.1 · Smile Dental Customer Simulation

════════════════════════════════════════════════════════════════════
Pipeline Validation
════════════════════════════════════════════════════════════════════
Prompt Engine                ✓ ceo.business-analysis registered
LLM Gateway                  ✓ gateway ready
OpenAI Provider              ✓ registered in provider registry
OpenAI API Key               ✓ OPENAI_API_KEY configured

════════════════════════════════════════════════════════════════════
Customer Request
════════════════════════════════════════════════════════════════════
Company                      Smile Dental
Industry                     Dental Clinic
...

════════════════════════════════════════════════════════════════════
Business Analysis
════════════════════════════════════════════════════════════════════
Estimated Complexity         MEDIUM
Estimated Budget             $3,000 – $7,000
Recommended Departments      • sales
                             • website
Confidence Score             85%
Future Upsells               • Mobile App
```

## Verification

Run the full verification suite:

```bash
npm run build
npm run lint
npm run test:brain:all
npm run demo
```

## Notes

- This is a **manual demo**, not an automated test.
- No UI or API route is involved — the script calls Brain APIs directly.
- The demo uses `gpt-4.1` (a supported OpenAI model in the Provider Registry) for live LLM execution. If the API call fails, it gracefully falls back to deterministic analysis.

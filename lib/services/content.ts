import type { ServicePageContent } from "./types";

export const SERVICE_SLUGS = [
  "ai-chatbots",
  "ai-automation",
  "ai-voice-agents",
  "ai-customer-support",
  "ai-websites",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export function isServiceSlug(value: string): value is ServiceSlug {
  return (SERVICE_SLUGS as readonly string[]).includes(value);
}

export const servicesContent: Record<ServiceSlug, ServicePageContent> = {
  "ai-chatbots": {
    slug: "ai-chatbots",
    title: "AI Chatbots",
    metaDescription:
      "Deploy premium AI chatbots that capture leads, answer questions, and guide customers 24/7 with Nexora AI.",
    hero: {
      eyebrow: "AI Chatbots",
      headline: "Conversations that convert, support, and scale.",
      description:
        "We design branded AI chatbots that feel human, integrate with your stack, and turn website visitors into qualified pipeline—without adding headcount.",
      highlights: ["24/7 engagement", "Lead qualification", "Brand-safe responses"],
    },
    benefits: {
      title: "Why teams choose Nexora chatbots",
      description: "Move beyond basic widgets with assistants built for revenue and retention.",
      items: [
        {
          title: "Capture more qualified leads",
          description: "Guide visitors with smart prompts, qualify intent, and route hot prospects instantly.",
        },
        {
          title: "Reduce support volume",
          description: "Resolve repetitive questions automatically while escalating complex cases to your team.",
        },
        {
          title: "On-brand every interaction",
          description: "Tone, visuals, and flows match your brand so AI feels like a natural extension of your product.",
        },
        {
          title: "Launch in weeks, not months",
          description: "Our proven framework gets you from strategy to production quickly with measurable KPIs.",
        },
      ],
    },
    features: {
      title: "Everything your chatbot needs",
      description: "Production-ready capabilities out of the box.",
      items: [
        { title: "Custom knowledge base", description: "Train on docs, FAQs, product pages, and internal playbooks." },
        { title: "Lead capture flows", description: "Consultation forms, CRM handoff, and automated follow-up triggers." },
        { title: "Multi-channel ready", description: "Website, landing pages, and embeddable widgets with one brain." },
        { title: "Human handoff", description: "Seamless escalation when customers need a real person." },
        { title: "Analytics dashboard", description: "Track conversations, conversion rates, and drop-off points." },
        { title: "Secure & compliant", description: "Enterprise-grade data handling with role-based access controls." },
      ],
    },
    process: {
      title: "Our chatbot launch process",
      description: "A clear path from discovery to measurable results.",
      steps: [
        { title: "Discover", description: "We map user journeys, support themes, and conversion goals." },
        { title: "Design", description: "Conversation flows, tone guidelines, and UI aligned to Nexora standards." },
        { title: "Deploy", description: "Integrate with your site, CRM, and knowledge sources—then test rigorously." },
        { title: "Optimize", description: "Monitor performance and iterate on prompts, flows, and routing rules." },
      ],
    },
    pricing: {
      title: "Chatbot pricing",
      description: "Flexible packages for pilots, growth, and enterprise rollouts.",
      plans: [
        {
          name: "Starter",
          price: "$3.5k",
          description: "Single-use-case chatbot for lead capture or FAQ.",
          features: ["1 chatbot workflow", "Knowledge base setup", "Lead form integration", "30-day optimization"],
        },
        {
          name: "Growth",
          price: "$9k",
          featured: true,
          description: "Multi-flow assistant with analytics and CRM sync.",
          features: ["Multi-intent flows", "CRM & email integrations", "Custom branding", "Dedicated launch support"],
        },
        {
          name: "Enterprise",
          price: "Custom",
          description: "Advanced routing, SSO, and multi-brand deployments.",
          features: ["Multi-site rollout", "SSO & audit logs", "SLA-backed support", "Quarterly strategy reviews"],
        },
      ],
    },
    faq: {
      title: "Chatbot FAQ",
      description: "Common questions from teams evaluating AI chat.",
      items: [
        {
          question: "How long does it take to launch?",
          answer: "Most clients go live in 2–4 weeks depending on content volume and integrations.",
        },
        {
          question: "Can the chatbot match our brand voice?",
          answer: "Yes. We define tone, vocabulary, and guardrails so every response feels on-brand.",
        },
        {
          question: "Does it integrate with our CRM?",
          answer: "We connect to popular CRMs and can build custom webhooks for your stack.",
        },
        {
          question: "What happens when the bot can't answer?",
          answer: "We configure graceful fallbacks, lead capture, or live handoff to your team.",
        },
      ],
    },
    cta: {
      title: "Ready for a chatbot that actually performs?",
      description: "Book a free consultation and we'll map the highest-impact conversation flows for your business.",
    },
  },

  "ai-automation": {
    slug: "ai-automation",
    title: "AI Automation",
    metaDescription:
      "Automate repetitive workflows with intelligent AI systems. Nexora AI builds scalable automation for modern operations.",
    hero: {
      eyebrow: "AI Automation",
      headline: "Replace manual busywork with intelligent workflows.",
      description:
        "From data entry to multi-step approvals, we build AI-powered automations that save hours, reduce errors, and free your team for high-value work.",
      highlights: ["70%+ time saved", "Fewer errors", "Stack integrations"],
    },
    benefits: {
      title: "Operational impact you can measure",
      description: "Automation that pays for itself in productivity and clarity.",
      items: [
        {
          title: "Eliminate repetitive tasks",
          description: "Automate data sync, reporting, notifications, and document processing at scale.",
        },
        {
          title: "Connect your entire stack",
          description: "Bridge CRMs, spreadsheets, email, Slack, and custom APIs in unified workflows.",
        },
        {
          title: "Scale without hiring",
          description: "Handle volume spikes with agents that never sleep and always follow the playbook.",
        },
        {
          title: "Full visibility",
          description: "Audit trails, error alerts, and dashboards so nothing falls through the cracks.",
        },
      ],
    },
    features: {
      title: "Automation capabilities",
      description: "Built for reliability in real business environments.",
      items: [
        { title: "Workflow orchestration", description: "Multi-step pipelines with conditional logic and retries." },
        { title: "Document intelligence", description: "Extract, classify, and route PDFs, invoices, and forms." },
        { title: "AI decision nodes", description: "LLM-powered classification and routing where rules fall short." },
        { title: "Scheduled & event triggers", description: "Run on cron, webhooks, form submits, or database changes." },
        { title: "Human-in-the-loop", description: "Approval steps for sensitive actions before execution." },
        { title: "Monitoring & alerts", description: "Real-time failure detection with Slack or email notifications." },
      ],
    },
    process: {
      title: "How we automate",
      description: "Structured delivery from audit to production.",
      steps: [
        { title: "Audit", description: "Identify high-ROI processes and map current manual workflows." },
        { title: "Architect", description: "Design automation blueprints with fallbacks and security controls." },
        { title: "Build", description: "Implement, test, and document each workflow with your team." },
        { title: "Scale", description: "Expand to adjacent processes and tune for cost and performance." },
      ],
    },
    pricing: {
      title: "Automation pricing",
      description: "Start with one workflow or transform an entire department.",
      plans: [
        {
          name: "Workflow",
          price: "$4k",
          description: "One high-impact automation with monitoring.",
          features: ["Single workflow", "2 integrations", "Documentation & training", "14-day hypercare"],
        },
        {
          name: "Operations",
          price: "$12k",
          featured: true,
          description: "Multiple workflows across teams with AI decision layers.",
          features: ["Up to 5 workflows", "AI routing nodes", "Dashboard & alerts", "60-day optimization"],
        },
        {
          name: "Enterprise",
          price: "Custom",
          description: "Org-wide automation program with governance.",
          features: ["Unlimited workflows", "Dedicated architect", "Compliance review", "Priority SLA"],
        },
      ],
    },
    faq: {
      title: "Automation FAQ",
      description: "",
      items: [
        {
          question: "Which tools can you integrate?",
          answer: "We work with Zapier-style APIs, REST webhooks, Google Workspace, Microsoft 365, HubSpot, Salesforce, Notion, Airtable, and custom backends.",
        },
        {
          question: "Is our data secure?",
          answer: "Yes. We follow least-privilege access, encrypted credentials, and can deploy within your compliance requirements.",
        },
        {
          question: "What ROI should we expect?",
          answer: "Most clients see payback within 1–3 months on targeted workflows; we define KPIs before build.",
        },
        {
          question: "Can non-technical staff manage workflows?",
          answer: "We deliver playbooks and optional admin UIs so ops teams can monitor and adjust safely.",
        },
      ],
    },
    cta: {
      title: "Stop losing hours to manual work.",
      description: "Schedule a free consultation and we'll identify your fastest automation wins.",
    },
  },

  "ai-voice-agents": {
    slug: "ai-voice-agents",
    title: "AI Voice Agents",
    metaDescription:
      "Natural AI voice agents for inbound and outbound calls. Nexora AI delivers phone experiences that sound human and drive outcomes.",
    hero: {
      eyebrow: "AI Voice Agents",
      headline: "Phone experiences that sound human and deliver results.",
      description:
        "Deploy AI voice agents for booking, qualification, support, and follow-ups—with natural speech, smart routing, and CRM logging on every call.",
      highlights: ["Natural voice UX", "Inbound & outbound", "CRM call logs"],
    },
    benefits: {
      title: "Voice AI built for business outcomes",
      description: "Never miss a call and never waste a conversation.",
      items: [
        {
          title: "Answer every call instantly",
          description: "Eliminate hold times and missed opportunities with always-on voice agents.",
        },
        {
          title: "Qualify and book automatically",
          description: "Capture intent, schedule meetings, and push summaries to your sales team.",
        },
        {
          title: "Consistent brand experience",
          description: "Custom voice, scripts, and escalation paths aligned to your standards.",
        },
        {
          title: "Actionable call intelligence",
          description: "Transcripts, sentiment, and outcomes logged for coaching and optimization.",
        },
      ],
    },
    features: {
      title: "Voice agent features",
      description: "Enterprise-ready telephony with modern AI.",
      items: [
        { title: "Natural language understanding", description: "Handle accents, interruptions, and varied phrasing." },
        { title: "Calendar integration", description: "Book appointments directly into Google Calendar or Outlook." },
        { title: "Outbound campaigns", description: "Follow-up sequences for leads, reminders, and reactivation." },
        { title: "Live transfer", description: "Warm handoff to human reps when complexity requires it." },
        { title: "Compliance tools", description: "Recording disclosures, DNC lists, and consent workflows." },
        { title: "Multi-language support", description: "Serve global customers in their preferred language." },
      ],
    },
    process: {
      title: "Voice deployment process",
      description: "From script to live calls with confidence.",
      steps: [
        { title: "Script & design", description: "Call flows, objection handling, and brand voice guidelines." },
        { title: "Telephony setup", description: "Numbers, routing, recording policies, and integration wiring." },
        { title: "Pilot", description: "Controlled launch with real calls and rapid iteration." },
        { title: "Scale", description: "Expand use cases, languages, and outbound programs." },
      ],
    },
    pricing: {
      title: "Voice agent pricing",
      description: "Packages aligned to call volume and complexity.",
      plans: [
        {
          name: "Pilot",
          price: "$5k",
          description: "Single inbound use case with basic integrations.",
          features: ["1 voice agent", "Inbound routing", "Call transcripts", "2-week pilot support"],
        },
        {
          name: "Revenue",
          price: "$14k",
          featured: true,
          description: "Inbound + outbound with CRM and calendar sync.",
          features: ["Multi-scenario flows", "Outbound sequences", "CRM logging", "Voice tuning sessions"],
        },
        {
          name: "Enterprise",
          price: "Custom",
          description: "High-volume, multi-region, compliance-heavy deployments.",
          features: ["Dedicated voice engineer", "Custom telephony", "Advanced analytics", "24/7 monitoring"],
        },
      ],
    },
    faq: {
      title: "Voice agent FAQ",
      description: "",
      items: [
        {
          question: "Do the agents sound robotic?",
          answer: "We use premium voice models and conversational design so agents sound natural and on-brand.",
        },
        {
          question: "Can calls transfer to our team?",
          answer: "Yes. We configure warm transfers with context so reps pick up informed.",
        },
        {
          question: "What telephony providers do you support?",
          answer: "Twilio, Vonage, and other SIP-compatible providers; we advise based on your region.",
        },
        {
          question: "Are calls recorded?",
          answer: "Recording is configurable with proper disclosures to meet your compliance needs.",
        },
      ],
    },
    cta: {
      title: "Transform every call into an opportunity.",
      description: "Book a free consultation to design your voice agent strategy.",
    },
  },

  "ai-customer-support": {
    slug: "ai-customer-support",
    title: "AI Customer Support",
    metaDescription:
      "AI-powered customer support that resolves tickets faster and keeps customers happy. Nexora AI builds support automation for modern teams.",
    hero: {
      eyebrow: "AI Customer Support",
      headline: "Support that resolves faster and scales effortlessly.",
      description:
        "Combine AI triage, intelligent replies, and agent copilots to cut response times, improve CSAT, and give your team superpowers—not more tickets.",
      highlights: ["Faster resolution", "Higher CSAT", "Agent copilots"],
    },
    benefits: {
      title: "Support teams love Nexora",
      description: "Better experiences for customers and agents alike.",
      items: [
        {
          title: "Instant ticket triage",
          description: "Auto-classify, prioritize, and route issues to the right specialist.",
        },
        {
          title: "Suggested replies",
          description: "Agents get AI-drafted responses grounded in your knowledge base.",
        },
        {
          title: "Self-service deflection",
          description: "Help centers and bots resolve common issues before they become tickets.",
        },
        {
          title: "Insights that improve products",
          description: "Trend analysis surfaces recurring pain points for product and ops teams.",
        },
      ],
    },
    features: {
      title: "Support platform features",
      description: "End-to-end AI for helpdesk excellence.",
      items: [
        { title: "Omnichannel inbox", description: "Email, chat, and social messages in unified workflows." },
        { title: "Knowledge sync", description: "Keep AI answers aligned with your latest docs and macros." },
        { title: "Agent assist", description: "Real-time suggestions, summaries, and sentiment alerts." },
        { title: "SLA monitoring", description: "Proactive alerts before breaches with escalation rules." },
        { title: "Quality scoring", description: "Review AI and human responses for coaching opportunities." },
        { title: "Helpdesk integrations", description: "Zendesk, Intercom, Freshdesk, and custom API connections." },
      ],
    },
    process: {
      title: "Support transformation process",
      description: "Upgrade support without disrupting your team.",
      steps: [
        { title: "Assess", description: "Analyze ticket volume, categories, and current resolution paths." },
        { title: "Enable", description: "Deploy triage, macros, and self-service in phased rollouts." },
        { title: "Train", description: "Coach agents on copilot tools and updated escalation playbooks." },
        { title: "Improve", description: "Weekly reviews of CSAT, deflection, and knowledge gaps." },
      ],
    },
    pricing: {
      title: "Support AI pricing",
      description: "Sized for support teams at every stage.",
      plans: [
        {
          name: "Assist",
          price: "$4.5k",
          description: "Agent copilot and knowledge sync for one helpdesk.",
          features: ["Agent assist", "KB integration", "Macro suggestions", "Training session"],
        },
        {
          name: "Deflect",
          price: "$11k",
          featured: true,
          description: "Self-service + triage for growing ticket volume.",
          features: ["Auto-triage", "Self-service portal", "CSAT tracking", "90-day tuning"],
        },
        {
          name: "Enterprise",
          price: "Custom",
          description: "Global support ops with governance and analytics.",
          features: ["Multi-brand support", "Custom models", "Dedicated CSM", "Executive reporting"],
        },
      ],
    },
    faq: {
      title: "Support FAQ",
      description: "",
      items: [
        {
          question: "Will AI replace our support agents?",
          answer: "No. We augment agents by handling repetitive work so they focus on complex, high-emotion cases.",
        },
        {
          question: "Which helpdesks do you integrate with?",
          answer: "Zendesk, Intercom, Freshdesk, HubSpot Service Hub, and custom APIs.",
        },
        {
          question: "How do you measure success?",
          answer: "First response time, resolution time, CSAT, deflection rate, and cost per ticket.",
        },
        {
          question: "Can we control what the AI says?",
          answer: "Absolutely. Guardrails, approved macros, and human review gates keep responses accurate.",
        },
      ],
    },
    cta: {
      title: "Give your support team an AI advantage.",
      description: "Book a free consultation to see how much faster you can resolve tickets.",
    },
  },

  "ai-websites": {
    slug: "ai-websites",
    title: "AI Websites",
    metaDescription:
      "High-converting AI-powered websites with smart personalization, chat, and automation. Built by Nexora AI.",
    hero: {
      eyebrow: "AI Websites",
      headline: "Websites that sell, support, and adapt intelligently.",
      description:
        "We build fast, premium Next.js websites infused with AI—personalized content, embedded assistants, and conversion flows that turn traffic into pipeline.",
      highlights: ["Premium design", "Built-in AI", "Conversion-focused"],
    },
    benefits: {
      title: "Why AI-native websites win",
      description: "Your site becomes a growth engine, not a static brochure.",
      items: [
        {
          title: "Convert more visitors",
          description: "Smart CTAs, dynamic sections, and chat capture leads at the right moment.",
        },
        {
          title: "Personalize at scale",
          description: "Show relevant offers and content based on visitor intent and segment.",
        },
        {
          title: "Lightning performance",
          description: "Modern stacks for Core Web Vitals, SEO, and mobile-first experiences.",
        },
        {
          title: "Easy to evolve",
          description: "Component-based architecture so marketing can iterate without rebuilds.",
        },
      ],
    },
    features: {
      title: "What's included",
      description: "Everything needed for a flagship digital presence.",
      items: [
        { title: "Custom Nexora design", description: "Dark, premium aesthetics aligned to your brand system." },
        { title: "Embedded AI chat", description: "Lead capture and support built into every key page." },
        { title: "Service & landing pages", description: "SEO-optimized templates for campaigns and offerings." },
        { title: "Analytics & events", description: "Track conversions, form submits, and chat engagement." },
        { title: "CMS-ready structure", description: "Optional headless CMS for blogs and case studies." },
        { title: "Launch & handoff", description: "Documentation, training, and post-launch support window." },
      ],
    },
    process: {
      title: "Website build process",
      description: "Collaborative delivery from wireframe to launch.",
      steps: [
        { title: "Strategy", description: "Define audiences, conversion goals, and site architecture." },
        { title: "Design", description: "High-fidelity UI in the Nexora design language." },
        { title: "Develop", description: "Next.js build with AI features, forms, and integrations." },
        { title: "Launch", description: "QA, SEO checks, deployment, and optimization sprint." },
      ],
    },
    pricing: {
      title: "Website pricing",
      description: "From focused landing pages to full marketing sites.",
      plans: [
        {
          name: "Launch Site",
          price: "$6k",
          description: "High-converting marketing site up to 5 pages.",
          features: ["Up to 5 pages", "Mobile responsive", "Contact & lead forms", "Basic SEO setup"],
        },
        {
          name: "Growth Site",
          price: "$15k",
          featured: true,
          description: "Full site with AI chat, service pages, and analytics.",
          features: ["Up to 12 pages", "AI chat widget", "Service page system", "Analytics dashboard"],
        },
        {
          name: "Enterprise",
          price: "Custom",
          description: "Multi-locale, CMS, and custom integrations.",
          features: ["Unlimited scope", "Headless CMS", "Personalization", "Dedicated PM"],
        },
      ],
    },
    faq: {
      title: "Website FAQ",
      description: "",
      items: [
        {
          question: "What tech stack do you use?",
          answer: "We primarily build with Next.js, React, and modern hosting on Vercel for speed and reliability.",
        },
        {
          question: "Can you redesign our existing site?",
          answer: "Yes. We migrate content, preserve SEO equity, and upgrade design and AI capabilities.",
        },
        {
          question: "Do you provide copywriting?",
          answer: "We offer positioning workshops and can deliver copy or collaborate with your marketing team.",
        },
        {
          question: "How long does a build take?",
          answer: "Launch sites typically ship in 3–5 weeks; larger builds in 6–10 weeks depending on scope.",
        },
      ],
    },
    cta: {
      title: "Launch a website that works as hard as you do.",
      description: "Book a free consultation and we'll outline your ideal site architecture and AI features.",
    },
  },
};

export function getServiceContent(slug: string): ServicePageContent | undefined {
  if (!isServiceSlug(slug)) return undefined;
  return servicesContent[slug];
}

export const allServicesList = SERVICE_SLUGS.map((slug) => ({
  slug,
  title: servicesContent[slug].title,
  description: servicesContent[slug].hero.description,
  highlights: servicesContent[slug].hero.highlights,
}));

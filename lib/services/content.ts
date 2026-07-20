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
  "ai-voice-agents": {
    slug: "ai-voice-agents",
    title: "AI Receptionist",
    metaDescription:
      "Never miss a call again. Nexora AI builds phone assistants that answer calls, book appointments, and capture leads 24/7 for Canadian businesses.",
    hero: {
      eyebrow: "AI Receptionist",
      headline: "Never miss a call—even when you're on a job site.",
      description:
        "Your AI receptionist answers every call, books appointments, and captures lead details automatically. No hold music. No voicemail. No lost customers.",
      highlights: ["Answers 24/7", "Books appointments", "Captures every lead"],
    },
    benefits: {
      title: "What problem does this solve?",
      description: "Missed calls mean missed revenue. An AI receptionist makes sure every caller gets help.",
      items: [
        {
          title: "Stop losing after-hours calls",
          description: "Customers call at night and on weekends. Your AI answers instantly and books the job.",
        },
        {
          title: "Book appointments without phone tag",
          description: "Callers schedule service visits on the spot—no back-and-forth messages needed.",
        },
        {
          title: "Free up your front desk",
          description: "Routine calls get handled automatically so your team focuses on customers in front of them.",
        },
        {
          title: "Every call logged and summarized",
          description: "You get a clear record of who called, what they need, and what was booked.",
        },
      ],
    },
    features: {
      title: "What's included",
      description: "Everything you need for professional phone coverage.",
      items: [
        { title: "Natural phone conversations", description: "Callers talk normally—no robotic menus or frustrating prompts." },
        { title: "Calendar booking", description: "Appointments go straight into Google Calendar or Outlook." },
        { title: "After-hours coverage", description: "Nights, weekends, and holidays—your business never goes silent." },
        { title: "Live transfer to your team", description: "Urgent calls get routed to a real person when needed." },
        { title: "Call summaries by email", description: "Know exactly who called and what they wanted." },
        { title: "Custom greetings and scripts", description: "Sounds like your business—not a generic call centre." },
      ],
    },
    process: {
      title: "How we set it up",
      description: "Simple steps from first call to live receptionist.",
      steps: [
        { title: "Free Consultation", description: "We learn how your business handles calls today." },
        { title: "Custom AI Strategy", description: "We design scripts, booking rules, and escalation paths." },
        { title: "Development", description: "We build, test, and connect your phone line and calendar." },
        { title: "Launch", description: "Your AI receptionist goes live—ready to answer every call." },
      ],
    },
    pricing: {
      title: "AI Receptionist pricing",
      description: "Packages based on call volume and features you need.",
      plans: [
        {
          name: "Starter",
          price: "$5k",
          description: "After-hours and overflow call answering for one line.",
          features: ["1 phone line", "Appointment booking", "Call summaries", "2-week launch support"],
        },
        {
          name: "Growth",
          price: "$14k",
          featured: true,
          description: "Full-time receptionist with booking and lead capture.",
          features: ["Multi-scenario calls", "Calendar sync", "Lead notifications", "Script customization"],
        },
        {
          name: "Enterprise",
          price: "Custom",
          description: "Multi-location or high-volume phone operations.",
          features: ["Multiple lines", "Dedicated setup", "Advanced routing", "Priority support"],
        },
      ],
    },
    faq: {
      title: "Common questions",
      description: "",
      items: [
        {
          question: "Will callers know they're talking to AI?",
          answer: "We design natural conversations. Many callers don't notice—and the ones who do appreciate getting instant help instead of voicemail.",
        },
        {
          question: "Can it book into my existing calendar?",
          answer: "Yes. We connect to Google Calendar, Outlook, and most booking tools you already use.",
        },
        {
          question: "What if someone needs to talk to a real person?",
          answer: "We set up live transfer rules so urgent or complex calls reach your team immediately.",
        },
        {
          question: "How long does setup take?",
          answer: "Most AI receptionist projects launch in 2–4 weeks depending on your call flows and integrations.",
        },
      ],
    },
    cta: {
      title: "Stop letting calls go to voicemail.",
      description: "Book a free consultation and we'll show you how many customers you could be capturing after hours.",
    },
  },

  "ai-chatbots": {
    slug: "ai-chatbots",
    title: "Customer Support Chatbot",
    metaDescription:
      "Reply to customer questions instantly, 24/7. Nexora AI builds website chatbots that support customers and free up your team.",
    hero: {
      eyebrow: "Customer Support Chatbot",
      headline: "Answer customer questions instantly—even at 2 AM.",
      description:
        "Your website chatbot replies to common questions, helps customers find what they need, and escalates to your team when it matters. No waiting. No lost sales.",
      highlights: ["24/7 replies", "Instant answers", "Less phone volume"],
    },
    benefits: {
      title: "What problem does this solve?",
      description: "Customers expect fast answers. If your team can't reply, they call a competitor.",
      items: [
        {
          title: "Reply in seconds, not hours",
          description: "Customers get answers about hours, pricing, services, and availability immediately.",
        },
        {
          title: "Reduce repetitive phone calls",
          description: "Stop answering the same questions all day. Let the chatbot handle the routine.",
        },
        {
          title: "Support customers after hours",
          description: "Your website works for you nights and weekends while you're off the clock.",
        },
        {
          title: "Sound like your business",
          description: "Custom responses that match your tone—not generic robot talk.",
        },
      ],
    },
    features: {
      title: "What's included",
      description: "A chatbot built for real customer conversations.",
      items: [
        { title: "Answers from your business info", description: "Trained on your FAQs, services, hours, and policies." },
        { title: "Website chat widget", description: "Lives on your site where customers already are." },
        { title: "Human handoff", description: "Complex questions go to your team with full context." },
        { title: "Mobile-friendly", description: "Works perfectly on phones—where most customers browse." },
        { title: "Conversation history", description: "See what customers asked and how the bot replied." },
        { title: "Easy updates", description: "We help you keep answers current as your business changes." },
      ],
    },
    process: {
      title: "How we set it up",
      description: "From your FAQs to a live chatbot on your website.",
      steps: [
        { title: "Free Consultation", description: "We learn what questions your customers ask most." },
        { title: "Custom AI Strategy", description: "We map conversation flows and escalation rules." },
        { title: "Development", description: "We build, train, and test on your website." },
        { title: "Launch", description: "Your chatbot goes live—ready to help customers 24/7." },
      ],
    },
    pricing: {
      title: "Chatbot pricing",
      description: "Options for single-location businesses and growing teams.",
      plans: [
        {
          name: "Starter",
          price: "$3.5k",
          description: "FAQ chatbot for one website.",
          features: ["1 chatbot", "FAQ setup", "Website embed", "30-day tuning"],
        },
        {
          name: "Growth",
          price: "$9k",
          featured: true,
          description: "Full support chatbot with lead capture and integrations.",
          features: ["Multi-topic flows", "Lead capture", "Custom branding", "Launch support"],
        },
        {
          name: "Enterprise",
          price: "Custom",
          description: "Multi-site or advanced support operations.",
          features: ["Multiple sites", "Advanced routing", "Dedicated support", "Quarterly reviews"],
        },
      ],
    },
    faq: {
      title: "Common questions",
      description: "",
      items: [
        {
          question: "Can AI answer customers after business hours?",
          answer: "Yes—that's one of the main reasons businesses add a chatbot. Customers get help anytime, even when your office is closed.",
        },
        {
          question: "What if the bot doesn't know the answer?",
          answer: "It captures the customer's question and contact info, then alerts your team to follow up.",
        },
        {
          question: "Do I need technical knowledge?",
          answer: "No. We handle setup, training, and updates. You just tell us about your business.",
        },
        {
          question: "Can I customize the responses?",
          answer: "Absolutely. Every answer is tailored to your business, services, and policies.",
        },
      ],
    },
    cta: {
      title: "Give your customers instant answers.",
      description: "Book a free consultation and we'll show you how a chatbot can reduce calls and improve customer satisfaction.",
    },
  },

  "ai-customer-support": {
    slug: "ai-customer-support",
    title: "Lead Capture Automation",
    metaDescription:
      "Turn website visitors into qualified leads automatically. Nexora AI captures contact details and follows up so you close more business.",
    hero: {
      eyebrow: "Lead Capture Automation",
      headline: "Turn website visitors into paying customers.",
      description:
        "Stop losing leads who leave without calling. Our AI captures contact details, qualifies interest, and sends hot prospects straight to your inbox—automatically.",
      highlights: ["More leads", "Auto follow-up", "Qualified prospects"],
    },
    benefits: {
      title: "What problem does this solve?",
      description: "Most website visitors leave without contacting you. Lead capture fixes that.",
      items: [
        {
          title: "Capture leads you'd otherwise lose",
          description: "Engage visitors before they click away with smart prompts and conversation flows.",
        },
        {
          title: "Qualify prospects automatically",
          description: "AI asks the right questions so you know who's ready to buy and who needs nurturing.",
        },
        {
          title: "Instant follow-up notifications",
          description: "Get an email or text the moment a hot lead comes in—while they're still interested.",
        },
        {
          title: "More revenue from the same traffic",
          description: "You already pay for website visitors. Capture more of them as customers.",
        },
      ],
    },
    features: {
      title: "What's included",
      description: "Lead generation that runs while you work.",
      items: [
        { title: "Smart lead forms", description: "Conversational capture that feels natural—not annoying pop-ups." },
        { title: "Qualification questions", description: "Filter by service type, budget, timeline, and location." },
        { title: "Email and CRM alerts", description: "Leads go where your team already works." },
        { title: "Automated follow-up sequences", description: "Nudge prospects who didn't book on the first visit." },
        { title: "Lead tracking dashboard", description: "See how many leads you capture and where they come from." },
        { title: "Works with your website", description: "Integrates with your existing site—no rebuild required." },
      ],
    },
    process: {
      title: "How we set it up",
      description: "From visitor to qualified lead—in four steps.",
      steps: [
        { title: "Free Consultation", description: "We review your website and current lead flow." },
        { title: "Custom AI Strategy", description: "We design capture flows and qualification questions." },
        { title: "Development", description: "We build, connect, and test lead routing to your team." },
        { title: "Launch", description: "Lead capture goes live—start converting more visitors." },
      ],
    },
    pricing: {
      title: "Lead capture pricing",
      description: "Sized for businesses ready to grow their pipeline.",
      plans: [
        {
          name: "Starter",
          price: "$4.5k",
          description: "Basic lead capture for one website.",
          features: ["Lead forms", "Email alerts", "Qualification flow", "Setup training"],
        },
        {
          name: "Growth",
          price: "$11k",
          featured: true,
          description: "Full lead automation with follow-up sequences.",
          features: ["Multi-step qualification", "Auto follow-up", "CRM integration", "90-day optimization"],
        },
        {
          name: "Enterprise",
          price: "Custom",
          description: "Multi-location or high-volume lead operations.",
          features: ["Multi-site capture", "Custom routing", "Dedicated support", "Reporting"],
        },
      ],
    },
    faq: {
      title: "Common questions",
      description: "",
      items: [
        {
          question: "Will this work with my existing website?",
          answer: "Yes. We add lead capture to your current site—no full rebuild needed in most cases.",
        },
        {
          question: "How do I know when a new lead comes in?",
          answer: "You get instant notifications by email, text, or directly in your CRM—your choice.",
        },
        {
          question: "Can it ask about my specific services?",
          answer: "Yes. We customize questions for your trade, services, service area, and booking process.",
        },
        {
          question: "How many more leads should I expect?",
          answer: "Results vary by traffic, but most clients capture significantly more contacts than with a basic contact form alone.",
        },
      ],
    },
    cta: {
      title: "Stop losing website visitors.",
      description: "Book a free consultation and we'll show you how many leads you could be capturing every month.",
    },
  },

  "ai-websites": {
    slug: "ai-websites",
    title: "Appointment Booking Automation",
    metaDescription:
      "Let customers book appointments online without phone calls. Nexora AI builds smart booking systems for Canadian service businesses.",
    hero: {
      eyebrow: "Appointment Booking Automation",
      headline: "Let customers book appointments without calling your office.",
      description:
        "Customers pick a time, confirm their details, and get reminders—all automatically. Your calendar stays full without endless phone tag.",
      highlights: ["Online booking", "Auto reminders", "Fewer no-shows"],
    },
    benefits: {
      title: "What problem does this solve?",
      description: "Phone tag kills bookings. Online scheduling lets customers book when it's convenient for them.",
      items: [
        {
          title: "Fill your calendar 24/7",
          description: "Customers book at night, on lunch breaks, or whenever they have a moment.",
        },
        {
          title: "Cut down on phone calls",
          description: "Scheduling happens online so your team spends less time on the phone.",
        },
        {
          title: "Reduce no-shows",
          description: "Automatic reminders mean fewer missed appointments and lost revenue.",
        },
        {
          title: "Professional customer experience",
          description: "Modern booking that makes your business look established and easy to work with.",
        },
      ],
    },
    features: {
      title: "What's included",
      description: "Booking automation that works with how you operate.",
      items: [
        { title: "Online scheduling page", description: "Customers pick service type, date, and time in a few clicks." },
        { title: "Calendar sync", description: "Bookings appear in Google Calendar, Outlook, or your booking tool." },
        { title: "Automatic confirmations", description: "Customers get instant confirmation by email or text." },
        { title: "Reminder messages", description: "Reduce no-shows with timed reminders before appointments." },
        { title: "Service and staff rules", description: "Set availability, buffer times, and service durations." },
        { title: "Mobile-friendly booking", description: "Most customers book from their phone—we make that seamless." },
      ],
    },
    process: {
      title: "How we set it up",
      description: "From your availability rules to live online booking.",
      steps: [
        { title: "Free Consultation", description: "We map your services, hours, and booking process." },
        { title: "Custom AI Strategy", description: "We design the booking flow and reminder schedule." },
        { title: "Development", description: "We build, connect your calendar, and test end-to-end." },
        { title: "Launch", description: "Customers start booking online—your team gets time back." },
      ],
    },
    pricing: {
      title: "Booking automation pricing",
      description: "From simple scheduling to full booking websites.",
      plans: [
        {
          name: "Starter",
          price: "$6k",
          description: "Online booking for one service type.",
          features: ["Booking page", "Calendar sync", "Email confirmations", "Basic reminders"],
        },
        {
          name: "Growth",
          price: "$15k",
          featured: true,
          description: "Multi-service booking with AI chat and reminders.",
          features: ["Multi-service booking", "SMS reminders", "AI chat assist", "Analytics"],
        },
        {
          name: "Enterprise",
          price: "Custom",
          description: "Multi-location or complex scheduling needs.",
          features: ["Multiple locations", "Staff scheduling", "Custom integrations", "Dedicated PM"],
        },
      ],
    },
    faq: {
      title: "Common questions",
      description: "",
      items: [
        {
          question: "Can customers book specific services?",
          answer: "Yes. We set up different appointment types—consultations, repairs, inspections, and more.",
        },
        {
          question: "Does it sync with my current calendar?",
          answer: "We connect to Google Calendar, Outlook, and popular booking platforms.",
        },
        {
          question: "Can I block off times manually?",
          answer: "Absolutely. You control availability, holidays, and blocked times like you do today.",
        },
        {
          question: "How long does setup take?",
          answer: "Most booking systems launch in 2–4 weeks depending on services and integrations.",
        },
      ],
    },
    cta: {
      title: "Make booking easy for your customers.",
      description: "Book a free consultation and we'll design an online scheduling flow that fits your business.",
    },
  },

  "ai-automation": {
    slug: "ai-automation",
    title: "Business Process Automation",
    metaDescription:
      "Save hours every week by automating repetitive business tasks. Nexora AI helps Canadian businesses streamline operations without hiring more staff.",
    hero: {
      eyebrow: "Business Process Automation",
      headline: "Save hours every week on work your team shouldn't be doing.",
      description:
        "We automate the repetitive tasks that eat your time—follow-ups, data entry, reminders, and reporting—so you can focus on customers and growth.",
      highlights: ["Save hours weekly", "Fewer errors", "Works with your tools"],
    },
    benefits: {
      title: "What problem does this solve?",
      description: "Your team spends too much time on busywork. Automation gives that time back.",
      items: [
        {
          title: "Eliminate manual data entry",
          description: "Information flows between your tools automatically—no copy-pasting between systems.",
        },
        {
          title: "Automate follow-ups and reminders",
          description: "Customers and leads get timely messages without someone remembering to send them.",
        },
        {
          title: "Reduce costly mistakes",
          description: "Automated workflows follow the same steps every time—no missed tasks or forgotten follow-ups.",
        },
        {
          title: "Scale without hiring",
          description: "Handle more volume with the team you have today.",
        },
      ],
    },
    features: {
      title: "What's included",
      description: "Practical automation for everyday business operations.",
      items: [
        { title: "Workflow automation", description: "Multi-step processes that run on their own once triggered." },
        { title: "Tool integrations", description: "Connects email, CRM, calendars, spreadsheets, and more." },
        { title: "Automated notifications", description: "Alerts your team when action is needed—nothing slips through." },
        { title: "Document handling", description: "Route forms, invoices, and requests to the right person." },
        { title: "Scheduled tasks", description: "Daily reports, weekly summaries, and recurring reminders on autopilot." },
        { title: "Simple admin view", description: "See what's running and what's completed—no technical dashboard required." },
      ],
    },
    process: {
      title: "How we set it up",
      description: "We find your biggest time-wasters and automate them first.",
      steps: [
        { title: "Free Consultation", description: "We identify the tasks costing you the most time." },
        { title: "Custom AI Strategy", description: "We prioritize automations with the fastest payback." },
        { title: "Development", description: "We build, test, and document each workflow with your team." },
        { title: "Launch", description: "Automations go live—you start saving hours immediately." },
      ],
    },
    pricing: {
      title: "Automation pricing",
      description: "Start with one workflow or automate across your business.",
      plans: [
        {
          name: "Starter",
          price: "$4k",
          description: "One high-impact automation.",
          features: ["1 workflow", "2 integrations", "Team training", "14-day support"],
        },
        {
          name: "Growth",
          price: "$12k",
          featured: true,
          description: "Multiple automations across your operations.",
          features: ["Up to 5 workflows", "Dashboard & alerts", "Documentation", "60-day optimization"],
        },
        {
          name: "Enterprise",
          price: "Custom",
          description: "Business-wide automation program.",
          features: ["Unlimited workflows", "Dedicated architect", "Priority support", "Compliance review"],
        },
      ],
    },
    faq: {
      title: "Common questions",
      description: "",
      items: [
        {
          question: "What tools can you connect?",
          answer: "We work with Google Workspace, Microsoft 365, HubSpot, Salesforce, QuickBooks, and most tools with standard integrations.",
        },
        {
          question: "How much time can automation save?",
          answer: "Most clients save several hours per week on targeted workflows. We define expected savings before we build.",
        },
        {
          question: "Do I need to be technical?",
          answer: "Not at all. We build, maintain, and explain everything in plain language.",
        },
        {
          question: "Can we start with just one task?",
          answer: "Yes. Most businesses start with one painful manual process and expand from there.",
        },
      ],
    },
    cta: {
      title: "Get your time back.",
      description: "Book a free consultation and we'll identify the fastest automation wins for your business.",
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

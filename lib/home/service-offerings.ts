import type { LucideIcon } from "lucide-react";
import {
  Bot,
  CalendarCheck,
  Headphones,
  Phone,
  UserPlus,
  Workflow,
} from "lucide-react";

export type ServiceOffering = {
  title: string;
  problem: string;
  outcome: string;
  audience: string;
  timeline: string;
  icon: LucideIcon;
  href?: string;
};

export const serviceOfferings: ServiceOffering[] = [
  {
    title: "AI Chatbots",
    problem: "Customers message you after hours and nobody replies until the next morning.",
    outcome: "Instant answers on your website—so visitors stay engaged and book instead of leaving.",
    audience: "Restaurants, clinics, retail, and any business with a website.",
    timeline: "Typically live in 1–2 weeks",
    icon: Bot,
    href: "/services/ai-chatbots",
  },
  {
    title: "AI Receptionists",
    problem: "Calls go to voicemail when your team is busy or closed.",
    outcome: "Every call gets answered, qualified, and booked—24 hours a day.",
    audience: "Trades, HVAC, plumbing, legal, and service businesses that live on the phone.",
    timeline: "Typically live in 2–3 weeks",
    icon: Phone,
    href: "/services/ai-voice-agents",
  },
  {
    title: "Business Automation",
    problem: "Your team wastes hours on follow-ups, data entry, and repetitive admin.",
    outcome: "Routine work runs automatically—your people focus on customers and growth.",
    audience: "Growing teams drowning in manual processes.",
    timeline: "Typically live in 2–4 weeks",
    icon: Workflow,
    href: "/services/ai-automation",
  },
  {
    title: "Appointment Booking",
    problem: "Phone tag kills bookings. Customers give up before someone calls back.",
    outcome: "Customers pick a time online. Your calendar fills without extra calls.",
    audience: "Dentists, salons, consultants, and anyone who schedules appointments.",
    timeline: "Typically live in 1–2 weeks",
    icon: CalendarCheck,
    href: "/services/ai-websites",
  },
  {
    title: "Lead Capture",
    problem: "Website visitors browse and leave without ever contacting you.",
    outcome: "More names, numbers, and qualified leads delivered straight to your inbox.",
    audience: "Businesses paying for ads or SEO but losing leads on the website.",
    timeline: "Typically live in 1–2 weeks",
    icon: UserPlus,
    href: "/services/ai-customer-support",
  },
  {
    title: "Customer Support Automation",
    problem: "The same questions eat up your team's day—hours, pricing, availability.",
    outcome: "Common questions answered instantly. Your team handles only what matters.",
    audience: "Businesses with high call and message volume.",
    timeline: "Typically live in 2–3 weeks",
    icon: Headphones,
    href: "/services/ai-chatbots",
  },
];

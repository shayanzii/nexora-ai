import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Building2,
  Home,
  Stethoscope,
  Thermometer,
  UtensilsCrossed,
  Wrench,
  Zap,
} from "lucide-react";

export type IndustryCard = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const industryCards: IndustryCard[] = [
  {
    title: "Electricians",
    description: "Capture emergency calls after hours and book service visits automatically.",
    icon: Zap,
  },
  {
    title: "HVAC",
    description: "Handle seasonal call spikes and schedule maintenance without extra staff.",
    icon: Thermometer,
  },
  {
    title: "Plumbing",
    description: "Answer urgent calls instantly and book appointments around the clock.",
    icon: Wrench,
  },
  {
    title: "Roofing",
    description: "Qualify leads and schedule inspections while your crew is on the job.",
    icon: Home,
  },
  {
    title: "Dental Clinics",
    description: "Book appointments and answer patient questions without tying up front desk staff.",
    icon: Stethoscope,
  },
  {
    title: "Medical Clinics",
    description: "Reduce phone volume with automated booking, reminders, and FAQ support.",
    icon: Stethoscope,
  },
  {
    title: "Restaurants",
    description: "Take reservations and answer menu questions without pulling staff off the floor.",
    icon: UtensilsCrossed,
  },
  {
    title: "Real Estate",
    description: "Qualify buyers, book showings, and follow up with leads while you're on the road.",
    icon: Building2,
  },
  {
    title: "Professional Services",
    description: "Book consultations and capture leads for lawyers, accountants, and agencies.",
    icon: Briefcase,
  },
];

import type { LucideIcon } from "lucide-react";
import { Calendar, Clock, DollarSign, Headphones, Moon, TrendingUp } from "lucide-react";

export type BusinessBenefitCard = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const businessBenefitCards: BusinessBenefitCard[] = [
  {
    title: "More Customers",
    description: "Capture leads and answer inquiries 24/7—so competitors don't win while you're offline.",
    icon: TrendingUp,
  },
  {
    title: "More Appointments",
    description: "Customers book online without phone tag. Your calendar stays full.",
    icon: Calendar,
  },
  {
    title: "Save Time Every Week",
    description: "Stop answering the same questions. AI handles routine work automatically.",
    icon: Clock,
  },
  {
    title: "Higher Revenue",
    description: "More bookings and faster follow-ups mean more jobs closed—not more staff hired.",
    icon: DollarSign,
  },
  {
    title: "Less Manual Work",
    description: "Follow-ups, reminders, and data entry run on autopilot.",
    icon: Headphones,
  },
  {
    title: "24/7 Availability",
    description: "Nights, weekends, holidays—your business never goes silent.",
    icon: Moon,
  },
];

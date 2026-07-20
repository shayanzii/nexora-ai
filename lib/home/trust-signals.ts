import type { LucideIcon } from "lucide-react";
import { Clock, Handshake, MapPin, Receipt, Shield, Sparkles } from "lucide-react";

export type TrustSignalCard = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const trustSignalCards: TrustSignalCard[] = [
  {
    title: "Transparent Pricing",
    description: "Clear packages starting at CA$499. No surprise fees—you know the investment upfront.",
    icon: Receipt,
  },
  {
    title: "Canadian Support",
    description: "Real people in Canada who understand local businesses and respond when you need help.",
    icon: MapPin,
  },
  {
    title: "Fast Delivery",
    description: "Most projects go live in 1–4 weeks—not months of waiting.",
    icon: Clock,
  },
  {
    title: "Secure Development",
    description: "Your customer data stays protected with reliable, business-grade systems.",
    icon: Shield,
  },
  {
    title: "Ongoing Partnership",
    description: "We stay with you after launch—optimizing, updating, and improving as you grow.",
    icon: Handshake,
  },
  {
    title: "Free Strategy Session",
    description: "Every engagement starts with a no-pressure call to understand your goals.",
    icon: Sparkles,
  },
];

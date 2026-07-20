import {
  Bot,
  Globe,
  Headphones,
  MessageSquare,
  Workflow,
  type LucideIcon,
} from "lucide-react";

const serviceIconMap: Record<string, LucideIcon> = {
  "ai-chatbots": MessageSquare,
  "ai-automation": Workflow,
  "ai-voice-agents": Headphones,
  "ai-customer-support": Bot,
  "ai-websites": Globe,
};

export function getServiceIcon(slug: string): LucideIcon {
  return serviceIconMap[slug] ?? Bot;
}

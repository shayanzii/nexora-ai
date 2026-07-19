import {
  isLeadStatus,
  LEAD_STATUS_LABELS,
  LEAD_STATUS_STYLES,
} from "@/lib/admin/lead-status";

const budgetLabels: Record<string, string> = {
  "under-5k": "Under $5,000",
  "5k-15k": "$5,000 – $15,000",
  "15k-50k": "$15,000 – $50,000",
  "50k-plus": "$50,000+",
  undecided: "Not sure yet",
};

export function formatBudget(value: string | null): string {
  if (!value) return "—";
  return budgetLabels[value] ?? value;
}

export function formatLeadDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(isoDate));
}

export function formatLeadStatus(status: string): string {
  if (isLeadStatus(status)) {
    return LEAD_STATUS_LABELS[status];
  }

  return status
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getLeadStatusClassName(status: string): string {
  if (isLeadStatus(status)) {
    return LEAD_STATUS_STYLES[status];
  }

  return "border-white/10 bg-white/5 text-nexora-muted";
}

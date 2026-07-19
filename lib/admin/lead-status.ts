export const LEAD_STATUSES = [
  "new",
  "contacted",
  "meeting_scheduled",
  "proposal_sent",
  "won",
  "lost",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  meeting_scheduled: "Meeting Scheduled",
  proposal_sent: "Proposal Sent",
  won: "Won",
  lost: "Lost",
};

export const LEAD_STATUS_STYLES: Record<LeadStatus, string> = {
  new: "border-nexora-primary/30 bg-nexora-primary/15 text-nexora-hover",
  contacted: "border-blue-500/30 bg-blue-500/10 text-blue-300",
  meeting_scheduled: "border-violet-500/30 bg-violet-500/10 text-violet-300",
  proposal_sent: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  won: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  lost: "border-white/10 bg-white/5 text-nexora-muted",
};

export function isLeadStatus(value: string): value is LeadStatus {
  return (LEAD_STATUSES as readonly string[]).includes(value);
}

export function normalizeLeadStatus(value: string): LeadStatus {
  const normalized = value.trim().toLowerCase().replace(/\s+/g, "_");
  return isLeadStatus(normalized) ? normalized : "new";
}

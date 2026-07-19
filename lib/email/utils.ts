const HTML_ESCAPE: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPE[char] ?? char);
}

export const NEXORA_BRAND = {
  bg: "#0a0a0a",
  surface: "#141414",
  card: "#1c1c1c",
  primary: "#b91c1c",
  hover: "#dc2626",
  text: "#ffffff",
  muted: "#a1a1aa",
  border: "rgba(255, 255, 255, 0.08)",
} as const;

export function formatBudgetLabel(budget: string): string {
  const labels: Record<string, string> = {
    "under-5k": "Under $5,000",
    "5k-15k": "$5,000 – $15,000",
    "15k-50k": "$15,000 – $50,000",
    "50k-plus": "$50,000+",
    undecided: "Not sure yet",
  };

  if (!budget.trim()) return "Not specified";
  return labels[budget] ?? budget;
}

export function formatSubmittedAt(isoDate: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(isoDate));
}

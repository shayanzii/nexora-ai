export type DashboardStat = {
  id: string;
  label: string;
  value: number;
  change: string;
  trend: "up" | "down" | "neutral";
};

export const dashboardStats: DashboardStat[] = [
  {
    id: "total-leads",
    label: "Total Leads",
    value: 128,
    change: "+12% vs last month",
    trend: "up",
  },
  {
    id: "new-leads",
    label: "New Leads",
    value: 24,
    change: "+6 this week",
    trend: "up",
  },
  {
    id: "contacted",
    label: "Contacted",
    value: 56,
    change: "44% of pipeline",
    trend: "neutral",
  },
  {
    id: "won",
    label: "Won",
    value: 18,
    change: "+3 this month",
    trend: "up",
  },
];

export const dashboardSummary = {
  title: "Dashboard",
  description: "Overview of your lead pipeline and team performance.",
  lastUpdated: "Updated 5 minutes ago",
};

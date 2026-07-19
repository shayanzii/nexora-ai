import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatCard } from "@/components/admin/StatCard";
import { dashboardStats, dashboardSummary } from "@/lib/admin/mock-data";
import { PhoneCall, Trophy, UserPlus, Users } from "lucide-react";

const statIcons = {
  "total-leads": Users,
  "new-leads": UserPlus,
  contacted: PhoneCall,
  won: Trophy,
} as const;

export default function AdminDashboardPage() {
  return (
    <>
      <AdminHeader
        title={dashboardSummary.title}
        description={dashboardSummary.description}
        meta={dashboardSummary.lastUpdated}
      />

      <section
        aria-label="Lead statistics"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {dashboardStats.map((stat) => {
          const Icon = statIcons[stat.id as keyof typeof statIcons];

          return (
            <StatCard
              key={stat.id}
              label={stat.label}
              value={stat.value}
              change={stat.change}
              trend={stat.trend}
              icon={Icon}
            />
          );
        })}
      </section>
    </>
  );
}

import { AdminHeader } from "@/components/admin/AdminHeader";
import { LeadsEmptyState } from "@/components/admin/LeadsEmptyState";
import { LeadsTable } from "@/components/admin/LeadsTable";
import { getAdminLeads } from "@/lib/admin/get-leads";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const result = await getAdminLeads();

  const meta =
    result.error === null
      ? `${result.leads.length} lead${result.leads.length === 1 ? "" : "s"}`
      : result.error === "not_configured"
        ? "Supabase not configured"
        : "Unable to load leads";

  return (
    <>
      <AdminHeader
        title="Leads"
        description="Manage consultation requests and pipeline status."
        meta={meta}
      />

      {result.error === "fetch_failed" && (
        <div className="nexora-card mb-6 rounded-2xl border-nexora-primary/30 bg-nexora-primary/10 px-4 py-3 text-sm text-nexora-text">
          Could not load leads from Supabase{result.message ? `: ${result.message}` : "."}
        </div>
      )}

      {result.error === "not_configured" && (
        <div className="nexora-card mb-6 rounded-2xl border-nexora-primary/30 bg-nexora-primary/10 px-4 py-3 text-sm text-nexora-text">
          Supabase environment variables are not configured. Add them to load leads.
        </div>
      )}

      {result.error === null && result.leads.length === 0 && <LeadsEmptyState />}

      {result.error === null && result.leads.length > 0 && (
        <LeadsTable leads={result.leads} />
      )}
    </>
  );
}

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { LeadStatus } from "@/lib/admin/lead-status";

export type AdminLead = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  budget: string | null;
  status: LeadStatus | string;
  projectDescription: string;
  createdAt: string;
};

type AdminLeadRow = {
  id: string;
  full_name: string;
  email: string;
  company: string | null;
  budget: string | null;
  status: string;
  project_description: string;
  created_at: string;
};

export type AdminLeadsResult =
  | { leads: AdminLead[]; error: null }
  | { leads: []; error: "not_configured" | "fetch_failed"; message?: string };

function mapLeadRow(row: AdminLeadRow): AdminLead {
  return {
    id: row.id,
    name: row.full_name,
    email: row.email,
    company: row.company,
    budget: row.budget,
    status: row.status,
    projectDescription: row.project_description,
    createdAt: row.created_at,
  };
}

export async function getAdminLeads(): Promise<AdminLeadsResult> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return { leads: [], error: "not_configured" };
  }

  const { data, error } = await supabase
    .from("leads")
    .select("id, full_name, email, company, budget, status, project_description, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[admin/leads] Supabase fetch failed", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    return { leads: [], error: "fetch_failed", message: error.message };
  }

  return {
    leads: (data ?? []).map(mapLeadRow),
    error: null,
  };
}

import type { LeadFormData, LeadSubmission } from "@/lib/leads/types";
import type { LeadInsert, LeadRow } from "@/lib/supabase/database.types";

export function leadFormToInsert(data: LeadFormData): LeadInsert {
  return {
    full_name: data.fullName.trim(),
    email: data.email.trim(),
    company: data.company.trim() || null,
    budget: data.budget.trim() || null,
    project_description: data.projectDescription.trim(),
  };
}

export function leadRowToSubmission(row: LeadRow): LeadSubmission {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    company: row.company ?? "",
    budget: row.budget ?? "",
    projectDescription: row.project_description,
    submittedAt: row.submitted_at,
  };
}

import type { LeadFormErrors } from "@/lib/leads/types";
import { hasLeadFormErrors, validateLeadForm } from "@/lib/leads/validation";
import { isLeadStatus } from "@/lib/admin/lead-status";

export type AdminLeadUpdateInput = {
  fullName: string;
  email: string;
  company: string;
  budget: string;
  projectDescription: string;
  status: string;
};

export function validateAdminLeadUpdate(data: AdminLeadUpdateInput): LeadFormErrors {
  return validateLeadForm({
    fullName: data.fullName,
    email: data.email,
    company: data.company,
    budget: data.budget,
    projectDescription: data.projectDescription,
  });
}

export function validateLeadStatusUpdate(status: unknown): string | null {
  if (typeof status !== "string" || !isLeadStatus(status)) {
    return "Invalid lead status.";
  }
  return null;
}

export { hasLeadFormErrors };

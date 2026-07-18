import type { LeadFormData, LeadSubmission } from "./types";

const STORAGE_KEY = "nexora-leads";

export function getLeads(): LeadSubmission[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LeadSubmission[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLead(data: LeadFormData): LeadSubmission {
  const submission: LeadSubmission = {
    id: crypto.randomUUID(),
    fullName: data.fullName.trim(),
    email: data.email.trim(),
    company: data.company.trim(),
    budget: data.budget.trim(),
    projectDescription: data.projectDescription.trim(),
    submittedAt: new Date().toISOString(),
  };

  const existing = getLeads();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, submission]));

  return submission;
}

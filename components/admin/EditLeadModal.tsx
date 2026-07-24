"use client";

import { Save, X } from "lucide-react";
import { FormEvent, useId, useState } from "react";
import type { AdminLead } from "@/lib/admin/get-leads";
import {
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  normalizeLeadStatus,
  type LeadStatus,
} from "@/lib/admin/lead-status";

const BUDGET_OPTIONS = [
  { value: "", label: "Select a budget range" },
  { value: "under-5k", label: "Under $5,000" },
  { value: "5k-15k", label: "$5,000 – $15,000" },
  { value: "15k-50k", label: "$15,000 – $50,000" },
  { value: "50k-plus", label: "$50,000+" },
  { value: "undecided", label: "Not sure yet" },
];

type EditLeadForm = {
  fullName: string;
  email: string;
  company: string;
  budget: string;
  projectDescription: string;
  status: LeadStatus;
};

type EditLeadModalProps = {
  lead: AdminLead | null;
  isSaving: boolean;
  error: string | null;
  onClose: () => void;
  onSave: (payload: EditLeadForm) => void;
};

function leadToForm(lead: AdminLead): EditLeadForm {
  return {
    fullName: lead.name,
    email: lead.email,
    company: lead.company ?? "",
    budget: lead.budget ?? "",
    projectDescription: lead.projectDescription,
    status: normalizeLeadStatus(lead.status),
  };
}

export function EditLeadModal({ lead, isSaving, error, onClose, onSave }: EditLeadModalProps) {
  if (!lead) return null;

  return (
    <EditLeadModalForm
      key={lead.id}
      lead={lead}
      isSaving={isSaving}
      error={error}
      onClose={onClose}
      onSave={onSave}
    />
  );
}

type EditLeadModalFormProps = Omit<EditLeadModalProps, "lead"> & {
  lead: AdminLead;
};

function EditLeadModalForm({
  lead,
  isSaving,
  error,
  onClose,
  onSave,
}: EditLeadModalFormProps) {
  const titleId = useId();
  const [form, setForm] = useState<EditLeadForm>(() => leadToForm(lead));

  function updateField<K extends keyof EditLeadForm>(key: K, value: EditLeadForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave(form);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="nexora-card flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl shadow-[0_0_40px_rgba(185,28,28,0.2)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="nexora-border flex items-start justify-between border-b px-5 py-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-nexora-hover">
              Edit lead
            </p>
            <h2 id={titleId} className="mt-1 text-lg font-semibold text-nexora-text">
              {lead.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close edit lead dialog"
            className="nexora-border inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-nexora-surface text-nexora-muted transition hover:text-nexora-text"
          >
            <X className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="edit-fullName" className="mb-1.5 block text-xs font-medium text-nexora-text">
                  Full Name
                </label>
                <input
                  id="edit-fullName"
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(event) => updateField("fullName", event.target.value)}
                  className="nexora-input w-full px-3 py-2.5 text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="edit-email" className="mb-1.5 block text-xs font-medium text-nexora-text">
                  Email
                </label>
                <input
                  id="edit-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  className="nexora-input w-full px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label htmlFor="edit-company" className="mb-1.5 block text-xs font-medium text-nexora-text">
                  Company
                </label>
                <input
                  id="edit-company"
                  type="text"
                  value={form.company}
                  onChange={(event) => updateField("company", event.target.value)}
                  className="nexora-input w-full px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label htmlFor="edit-budget" className="mb-1.5 block text-xs font-medium text-nexora-text">
                  Budget
                </label>
                <select
                  id="edit-budget"
                  value={form.budget}
                  onChange={(event) => updateField("budget", event.target.value)}
                  className="nexora-input w-full px-3 py-2.5 text-sm"
                >
                  {BUDGET_OPTIONS.map((option) => (
                    <option key={option.value || "empty"} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="edit-status" className="mb-1.5 block text-xs font-medium text-nexora-text">
                  Status
                </label>
                <select
                  id="edit-status"
                  value={form.status}
                  onChange={(event) =>
                    updateField("status", event.target.value as LeadStatus)
                  }
                  className="nexora-input w-full px-3 py-2.5 text-sm"
                >
                  {LEAD_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {LEAD_STATUS_LABELS[status]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="edit-projectDescription"
                  className="mb-1.5 block text-xs font-medium text-nexora-text"
                >
                  Project Description
                </label>
                <textarea
                  id="edit-projectDescription"
                  required
                  rows={4}
                  value={form.projectDescription}
                  onChange={(event) => updateField("projectDescription", event.target.value)}
                  className="nexora-input w-full resize-y px-3 py-2.5 text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-nexora-primary/30 bg-nexora-primary/10 px-4 py-3 text-sm text-nexora-text">
                {error}
              </div>
            )}
          </div>

          <div className="nexora-border flex flex-col-reverse gap-3 border-t px-5 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="nexora-btn-secondary rounded-xl px-4 py-2.5 text-sm font-medium disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="nexora-btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
            >
              <Save className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              {isSaving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

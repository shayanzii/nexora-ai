"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DeleteLeadDialog } from "@/components/admin/DeleteLeadDialog";
import { EditLeadModal } from "@/components/admin/EditLeadModal";
import type { AdminLead } from "@/lib/admin/get-leads";
import {
  formatBudget,
  formatLeadDate,
  formatLeadStatus,
  getLeadStatusClassName,
} from "@/lib/admin/format-lead";
import {
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  isLeadStatus,
  normalizeLeadStatus,
  type LeadStatus,
} from "@/lib/admin/lead-status";

type LeadsTableProps = {
  leads: AdminLead[];
};

export function LeadsTable({ leads }: LeadsTableProps) {
  const router = useRouter();
  const [editLead, setEditLead] = useState<AdminLead | null>(null);
  const [deleteLead, setDeleteLead] = useState<AdminLead | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function handleStatusChange(leadId: string, status: LeadStatus) {
    setActionError(null);
    setStatusUpdatingId(leadId);

    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setActionError(payload.error ?? "Unable to update status.");
        return;
      }

      router.refresh();
    } catch {
      setActionError("Unable to update status.");
    } finally {
      setStatusUpdatingId(null);
    }
  }

  async function handleSaveEdit(form: {
    fullName: string;
    email: string;
    company: string;
    budget: string;
    projectDescription: string;
    status: LeadStatus;
  }) {
    if (!editLead) return;

    setEditError(null);
    setIsSaving(true);

    try {
      const response = await fetch(`/api/admin/leads/${editLead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          company: form.company,
          budget: form.budget,
          projectDescription: form.projectDescription,
          status: form.status,
        }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setEditError(payload.error ?? "Unable to save lead.");
        return;
      }

      setEditLead(null);
      router.refresh();
    } catch {
      setEditError("Unable to save lead.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleConfirmDelete() {
    if (!deleteLead) return;

    setDeleteError(null);
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/leads/${deleteLead.id}`, {
        method: "DELETE",
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setDeleteError(payload.error ?? "Unable to delete lead.");
        return;
      }

      setDeleteLead(null);
      router.refresh();
    } catch {
      setDeleteError("Unable to delete lead.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      {actionError && (
        <div className="nexora-card mb-4 rounded-2xl border-nexora-primary/30 bg-nexora-primary/10 px-4 py-3 text-sm text-nexora-text">
          {actionError}
        </div>
      )}

      <div className="nexora-card overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/8">
            <thead className="bg-nexora-surface/80">
              <tr>
                {["Name", "Email", "Company", "Budget", "Status", "Created At", "Actions"].map(
                  (heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-nexora-muted sm:px-6"
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/8">
              {leads.map((lead) => {
                const currentStatus = isLeadStatus(lead.status)
                  ? lead.status
                  : normalizeLeadStatus(lead.status);
                const isUpdatingStatus = statusUpdatingId === lead.id;

                return (
                  <tr key={lead.id} className="transition hover:bg-nexora-surface/50">
                    <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-nexora-text sm:px-6">
                      {lead.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-nexora-muted sm:px-6">
                      {lead.email}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-nexora-muted sm:px-6">
                      {lead.company ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-nexora-muted sm:px-6">
                      {formatBudget(lead.budget)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm sm:px-6">
                      <div className="flex min-w-[11rem] flex-col gap-2">
                        <span
                          className={`inline-flex w-fit rounded-full border px-2.5 py-1 text-xs font-medium ${getLeadStatusClassName(currentStatus)}`}
                        >
                          {formatLeadStatus(currentStatus)}
                        </span>
                        <select
                          value={currentStatus}
                          disabled={isUpdatingStatus}
                          onChange={(event) =>
                            handleStatusChange(lead.id, event.target.value as LeadStatus)
                          }
                          aria-label={`Change status for ${lead.name}`}
                          className="nexora-input w-full min-w-[11rem] px-2.5 py-1.5 text-xs disabled:opacity-60"
                        >
                          {LEAD_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {LEAD_STATUS_LABELS[status]}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-nexora-muted sm:px-6">
                      {formatLeadDate(lead.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm sm:px-6">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditError(null);
                            setEditLead(lead);
                          }}
                          className="nexora-btn-ghost inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium"
                        >
                          <Pencil className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteError(null);
                            setDeleteLead(lead);
                          }}
                          className="nexora-btn-ghost inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-nexora-hover"
                        >
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <EditLeadModal
        lead={editLead}
        isSaving={isSaving}
        error={editError}
        onClose={() => {
          if (!isSaving) setEditLead(null);
        }}
        onSave={handleSaveEdit}
      />

      <DeleteLeadDialog
        lead={deleteLead}
        isDeleting={isDeleting}
        error={deleteError}
        onCancel={() => {
          if (!isDeleting) setDeleteLead(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

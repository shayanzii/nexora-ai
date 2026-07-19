"use client";

import { Trash2, X } from "lucide-react";
import type { AdminLead } from "@/lib/admin/get-leads";

type DeleteLeadDialogProps = {
  lead: AdminLead | null;
  isDeleting: boolean;
  error: string | null;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteLeadDialog({
  lead,
  isDeleting,
  error,
  onCancel,
  onConfirm,
}: DeleteLeadDialogProps) {
  if (!lead) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-lead-title"
        aria-describedby="delete-lead-description"
        className="nexora-card w-full max-w-md rounded-2xl p-6 shadow-[0_0_40px_rgba(185,28,28,0.2)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-nexora-hover">
              Confirm delete
            </p>
            <h2 id="delete-lead-title" className="mt-1 text-lg font-semibold text-nexora-text">
              Delete this lead?
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close delete confirmation"
            className="nexora-border inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-nexora-surface text-nexora-muted transition hover:text-nexora-text"
          >
            <X className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
          </button>
        </div>

        <p id="delete-lead-description" className="text-sm leading-6 text-nexora-muted">
          This permanently removes <span className="font-medium text-nexora-text">{lead.name}</span>{" "}
          ({lead.email}) from Supabase. This action cannot be undone.
        </p>

        {error && (
          <div className="mt-4 rounded-xl border border-nexora-primary/30 bg-nexora-primary/10 px-4 py-3 text-sm text-nexora-text">
            {error}
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="nexora-btn-secondary rounded-xl px-4 py-2.5 text-sm font-medium disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="nexora-btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
          >
            <Trash2 className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            {isDeleting ? "Deleting…" : "Delete lead"}
          </button>
        </div>
      </div>
    </div>
  );
}

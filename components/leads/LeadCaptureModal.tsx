"use client";

import { CalendarCheck, X } from "lucide-react";
import { FormEvent, useEffect, useId, useState } from "react";
import { LeadSubmitError, submitLead } from "@/lib/leads/submit-lead";
import type { LeadFormData } from "@/lib/leads/types";
import { hasLeadFormErrors, validateLeadForm } from "@/lib/leads/validation";

const EMPTY_FORM: LeadFormData = {
  fullName: "",
  email: "",
  company: "",
  budget: "",
  projectDescription: "",
};

const BUDGET_OPTIONS = [
  { value: "", label: "Select a budget range" },
  { value: "under-5k", label: "Under $5,000" },
  { value: "5k-15k", label: "$5,000 – $15,000" },
  { value: "15k-50k", label: "$15,000 – $50,000" },
  { value: "50k-plus", label: "$50,000+" },
  { value: "undecided", label: "Not sure yet" },
];

const SUCCESS_MESSAGE =
  "Thank you! Our AI strategy team will contact you within 24 hours.";

type LeadCaptureModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export function LeadCaptureModal({ isOpen, onClose, onSuccess }: LeadCaptureModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const [form, setForm] = useState<LeadFormData>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) return;

    const timer = window.setTimeout(() => {
      setForm(EMPTY_FORM);
      setFieldErrors({});
      setSubmitError(null);
      setIsSubmitted(false);
      setIsSubmitting(false);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [isOpen]);

  function updateField<K extends keyof LeadFormData>(key: K, value: LeadFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    const errors = validateLeadForm(form);
    if (hasLeadFormErrors(errors)) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      await submitLead(form);

      if (onSuccess) {
        onSuccess();
        onClose();
      } else {
        setIsSubmitted(true);
      }
    } catch (error) {
      if (
        error instanceof LeadSubmitError &&
        error.fieldErrors &&
        hasLeadFormErrors(error.fieldErrors)
      ) {
        setFieldErrors(error.fieldErrors);
        return;
      }

      setSubmitError(
        error instanceof LeadSubmitError
          ? error.message
          : "Unable to save your request. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="absolute inset-0 z-10 flex items-end justify-center bg-nexora-bg/80 p-3 backdrop-blur-sm sm:items-center sm:p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="nexora-card glass-panel max-h-[92%] w-full overflow-y-auto rounded-2xl shadow-[0_0_40px_rgba(185,28,28,0.2)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="nexora-border flex items-start justify-between border-b px-4 py-3 sm:px-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-nexora-hover">
              Nexora AI
            </p>
            <h3 id={titleId} className="text-base font-semibold text-nexora-text">
              Get Free Consultation
            </h3>
            <p id={descriptionId} className="mt-1 text-xs text-nexora-muted">
              Tell us about your goals — we&apos;ll respond within 24 hours.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close consultation form"
            className="nexora-border ml-2 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-nexora-surface text-nexora-muted transition hover:text-nexora-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nexora-hover"
          >
            <X className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="flex flex-col items-center px-5 py-10 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-nexora-primary/15 text-nexora-hover">
              <CalendarCheck className="h-7 w-7" strokeWidth={2} aria-hidden="true" />
            </div>
            <p className="text-sm leading-7 text-nexora-text">{SUCCESS_MESSAGE}</p>
            <button
              type="button"
              onClick={onClose}
              className="nexora-btn-primary mt-6 px-5 py-2.5 text-sm"
            >
              Back to Chat
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 px-4 py-4 sm:px-5 sm:py-5" noValidate>
            <div>
              <label htmlFor="lead-fullName" className="mb-1.5 block text-xs font-medium text-nexora-text">
                Full Name <span className="text-nexora-hover">*</span>
              </label>
              <input
                id="lead-fullName"
                type="text"
                value={form.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                className="nexora-input w-full px-3 py-2.5 text-sm"
                placeholder="Jane Smith"
                autoComplete="name"
                aria-invalid={Boolean(fieldErrors.fullName)}
                aria-describedby={fieldErrors.fullName ? "lead-fullName-error" : undefined}
              />
              {fieldErrors.fullName && (
                <p id="lead-fullName-error" className="mt-1 text-xs text-nexora-hover">
                  {fieldErrors.fullName}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="lead-email" className="mb-1.5 block text-xs font-medium text-nexora-text">
                Email <span className="text-nexora-hover">*</span>
              </label>
              <input
                id="lead-email"
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="nexora-input w-full px-3 py-2.5 text-sm"
                placeholder="jane@company.com"
                autoComplete="email"
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? "lead-email-error" : undefined}
              />
              {fieldErrors.email && (
                <p id="lead-email-error" className="mt-1 text-xs text-nexora-hover">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="lead-company" className="mb-1.5 block text-xs font-medium text-nexora-text">
                Company
              </label>
              <input
                id="lead-company"
                type="text"
                value={form.company}
                onChange={(e) => updateField("company", e.target.value)}
                className="nexora-input w-full px-3 py-2.5 text-sm"
                placeholder="Acme Inc."
                autoComplete="organization"
              />
            </div>

            <div>
              <label htmlFor="lead-budget" className="mb-1.5 block text-xs font-medium text-nexora-text">
                Budget
              </label>
              <select
                id="lead-budget"
                value={form.budget}
                onChange={(e) => updateField("budget", e.target.value)}
                className="nexora-input w-full px-3 py-2.5 text-sm"
              >
                {BUDGET_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="lead-projectDescription"
                className="mb-1.5 block text-xs font-medium text-nexora-text"
              >
                Project Description <span className="text-nexora-hover">*</span>
              </label>
              <textarea
                id="lead-projectDescription"
                value={form.projectDescription}
                onChange={(e) => updateField("projectDescription", e.target.value)}
                rows={3}
                className="nexora-input w-full resize-none px-3 py-2.5 text-sm"
                placeholder="Describe your AI automation goals..."
                aria-invalid={Boolean(fieldErrors.projectDescription)}
                aria-describedby={
                  fieldErrors.projectDescription ? "lead-projectDescription-error" : undefined
                }
              />
              {fieldErrors.projectDescription && (
                <p id="lead-projectDescription-error" className="mt-1 text-xs text-nexora-hover">
                  {fieldErrors.projectDescription}
                </p>
              )}
            </div>

            {submitError && (
              <div className="rounded-xl border border-nexora-primary/30 bg-nexora-primary/10 px-3 py-2 text-xs text-nexora-text">
                {submitError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="nexora-btn-primary w-full py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

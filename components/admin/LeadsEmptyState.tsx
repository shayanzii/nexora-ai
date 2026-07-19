import { Inbox } from "lucide-react";

export function LeadsEmptyState() {
  return (
    <div className="nexora-card flex flex-col items-center justify-center rounded-2xl px-6 py-16 text-center">
      <div className="nexora-icon-box mb-4 flex h-14 w-14 items-center justify-center">
        <Inbox className="h-7 w-7 text-nexora-hover" strokeWidth={2} aria-hidden="true" />
      </div>
      <h2 className="text-lg font-semibold text-nexora-text">No leads yet</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-nexora-muted">
        Consultation requests from your website will appear here once submitted.
      </p>
    </div>
  );
}

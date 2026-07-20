export default function Loading() {
  return (
    <div className="nexora-page-bg flex min-h-screen items-center justify-center px-6">
      <div className="flex flex-col items-center gap-4" role="status" aria-live="polite" aria-label="Loading">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-nexora-border border-t-nexora-hover" />
        <p className="text-sm text-nexora-muted">Loading Nexora AI…</p>
      </div>
    </div>
  );
}

type ConsultationCTAProps = {
  onOpen: () => void;
};

export function ConsultationCTA({ onOpen }: ConsultationCTAProps) {
  return (
    <div className="nexora-border border-t bg-nexora-surface/50 px-3 py-2.5 sm:px-4">
      <button
        type="button"
        onClick={onOpen}
        className="nexora-btn-ghost w-full py-2 text-xs font-semibold sm:text-sm"
      >
        Get Free Consultation
      </button>
    </div>
  );
}

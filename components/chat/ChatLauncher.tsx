"use client";

import { Bot, X } from "lucide-react";
import { useEffect, useState } from "react";

type ChatLauncherProps = {
  isOpen: boolean;
  onToggle: () => void;
};

const TOOLTIP_DELAY_MS = 3000;
const TOOLTIP_DURATION_MS = 8000;

export function ChatLauncher({ isOpen, onToggle }: ChatLauncherProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipDismissed, setTooltipDismissed] = useState(false);

  useEffect(() => {
    if (tooltipDismissed || isOpen) return;

    const showTimer = window.setTimeout(() => setShowTooltip(true), TOOLTIP_DELAY_MS);
    return () => window.clearTimeout(showTimer);
  }, [tooltipDismissed, isOpen]);

  useEffect(() => {
    if (!showTooltip || tooltipDismissed || isOpen) return;

    const hideTimer = window.setTimeout(() => {
      setShowTooltip(false);
      setTooltipDismissed(true);
    }, TOOLTIP_DURATION_MS);

    return () => window.clearTimeout(hideTimer);
  }, [showTooltip, tooltipDismissed, isOpen]);

  function handleToggle() {
    setShowTooltip(false);
    setTooltipDismissed(true);
    onToggle();
  }

  const showLauncherExtras = !isOpen;

  return (
    <div className="chat-launcher pointer-events-auto flex flex-col items-end gap-3">
      {showLauncherExtras && showTooltip && (
        <div
          role="status"
          aria-live="polite"
          className="chat-tooltip chat-tooltip-enter glass-panel nexora-card max-w-[min(calc(100vw-2rem),280px)] rounded-2xl border-nexora-primary/25 px-4 py-3 text-sm leading-6 text-nexora-text shadow-[0_0_40px_rgba(185,28,28,0.12)] backdrop-blur-xl"
        >
          👋 Hi! Need help with AI automation? Chat with Nexora AI.
        </div>
      )}

      <div className="chat-fab-group flex items-center gap-3">
        {showLauncherExtras && (
          <span className="chat-fab-label glass-panel nexora-card rounded-full px-3 py-1.5 text-xs font-medium text-nexora-text shadow-[0_0_30px_rgba(185,28,28,0.1)] backdrop-blur-xl transition-all duration-300 sm:px-4 sm:py-2 sm:text-sm">
            Ask Nexora AI
          </span>
        )}

        <button
          type="button"
          onClick={handleToggle}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close Nexora assistant" : "Open Nexora assistant"}
          className={`chat-fab nexora-chat-fab relative inline-flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nexora-hover sm:h-16 sm:w-16 ${
            isOpen ? "" : "chat-fab-pulse"
          }`}
        >
          <span
            className={`absolute transition-all duration-300 ${
              isOpen ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
            }`}
          >
            <Bot className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.25} aria-hidden="true" />
          </span>
          <span
            className={`absolute transition-all duration-300 ${
              isOpen ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"
            }`}
          >
            <X className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.25} aria-hidden="true" />
          </span>
        </button>
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";
import { useChat } from "./useChat";

function ChatBubbleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.678 3.348-3.97Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const titleId = useId();
  const {
    messages,
    input,
    setInput,
    isLoading,
    error,
    bottomRef,
    textareaRef,
    sendMessage,
  } = useChat(isOpen);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      return;
    }

    const timer = window.setTimeout(() => setIsVisible(false), 300);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, close]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      {isVisible && (
        <button
          type="button"
          aria-label="Close chat"
          onClick={close}
          className={`chat-backdrop pointer-events-auto fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] transition-opacity duration-300 sm:bg-slate-950/20 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      <div className="pointer-events-none fixed bottom-4 right-4 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-hidden={!isOpen}
          className={`chat-panel glass-panel pointer-events-auto flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/90 shadow-[0_0_80px_rgba(34,211,238,0.18)] backdrop-blur-xl transition-all duration-300 ease-out ${
            isOpen
              ? "chat-panel-open translate-y-0 scale-100 opacity-100"
              : "chat-panel-closed pointer-events-none translate-y-4 scale-95 opacity-0"
          }`}
          style={{
            width: "min(100vw - 2rem, 400px)",
            height: "min(85dvh, 560px)",
          }}
        >
          <header className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3 sm:px-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-cyan-300">
                Nexora AI
              </p>
              <h2 id={titleId} className="text-sm font-semibold text-white">
                Assistant
              </h2>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close assistant"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:border-cyan-400/30 hover:bg-white/10 hover:text-white"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </header>

          <ChatMessages
            messages={messages}
            isLoading={isLoading}
            bottomRef={bottomRef}
          />

          {error && (
            <div className="mx-3 mb-2 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs text-red-200 sm:mx-4">
              {error}
            </div>
          )}

          <ChatInput
            input={input}
            isLoading={isLoading}
            textareaRef={textareaRef}
            onInputChange={setInput}
            onSubmit={sendMessage}
          />
        </div>

        <button
          type="button"
          onClick={isOpen ? close : open}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close Nexora assistant" : "Open Nexora assistant"}
          className={`chat-fab pointer-events-auto relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-500 text-slate-950 shadow-[0_0_40px_rgba(34,211,238,0.35)] transition-all duration-300 hover:scale-105 active:scale-95 sm:h-16 sm:w-16 ${
            isOpen ? "rotate-0" : "chat-fab-pulse"
          }`}
        >
          <span
            className={`absolute transition-all duration-300 ${
              isOpen ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
            }`}
          >
            <ChatBubbleIcon className="h-6 w-6 sm:h-7 sm:w-7" />
          </span>
          <span
            className={`absolute transition-all duration-300 ${
              isOpen ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"
            }`}
          >
            <CloseIcon className="h-6 w-6 sm:h-7 sm:w-7" />
          </span>
        </button>
      </div>
    </div>
  );
}

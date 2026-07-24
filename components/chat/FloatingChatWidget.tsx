"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { X } from "lucide-react";
import { LeadCaptureModal } from "@/components/leads/LeadCaptureModal";
import { ChatInput } from "./ChatInput";
import { ChatLauncher } from "./ChatLauncher";
import { ChatMessages } from "./ChatMessages";
import { CONSULTATION_CONFIRMATION_MESSAGE } from "./constants";
import { useChat } from "./useChat";

export function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
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
    appendAssistantMessage,
  } = useChat(isOpen);

  const close = useCallback(() => {
    setIsLeadModalOpen(false);
    setIsOpen(false);
  }, []);
  const toggle = useCallback(() => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }
    setIsVisible(true);
    setIsOpen(true);
  }, [isOpen]);
  const openLeadModal = useCallback(() => setIsLeadModalOpen(true), []);
  const closeLeadModal = useCallback(() => setIsLeadModalOpen(false), []);
  const handleLeadSuccess = useCallback(() => {
    appendAssistantMessage(CONSULTATION_CONFIRMATION_MESSAGE);
  }, [appendAssistantMessage]);

  useEffect(() => {
    if (isOpen || !isVisible) return;

    const timer = window.setTimeout(() => setIsVisible(false), 300);
    return () => window.clearTimeout(timer);
  }, [isOpen, isVisible]);

  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (isLeadModalOpen) {
          closeLeadModal();
          return;
        }
        close();
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, isLeadModalOpen, close, closeLeadModal]);

  useEffect(() => {
    function handleOpenConsultation() {
      setIsLeadModalOpen(true);
    }

    window.addEventListener("nexora:open-consultation", handleOpenConsultation);
    return () => window.removeEventListener("nexora:open-consultation", handleOpenConsultation);
  }, []);

  return (
    <>
      {isVisible && isOpen && !isLeadModalOpen && (
        <button
          type="button"
          aria-label="Close chat"
          onClick={close}
          className="chat-backdrop fixed inset-0 z-40 bg-nexora-bg/60 backdrop-blur-[2px] transition-opacity duration-300"
        />
      )}

      <div className="chat-widget-anchor fixed bottom-5 right-4 z-50 flex flex-col items-end gap-3 pb-[env(safe-area-inset-bottom,0px)] md:bottom-6 md:right-6">
        {(isOpen || isVisible) && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-hidden={!isOpen}
          className={`chat-panel glass-panel nexora-card relative flex flex-col overflow-hidden rounded-3xl shadow-[0_0_80px_rgba(185,28,28,0.15)] backdrop-blur-xl transition-all duration-300 ease-out ${
            isOpen
              ? "chat-panel-open translate-y-0 scale-100 opacity-100"
              : "chat-panel-closed pointer-events-none translate-y-4 scale-95 opacity-0"
          }`}
          style={{
            width: "min(100vw - 2rem, 400px)",
            height: "min(85dvh, 560px)",
          }}
        >
          <header className="nexora-border flex shrink-0 items-center justify-between border-b bg-nexora-surface/80 px-4 py-3 sm:px-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-nexora-hover">
                Nexora AI
              </p>
              <h2 id={titleId} className="text-sm font-semibold text-nexora-text">
                Assistant
              </h2>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close assistant"
              className="nexora-border inline-flex h-9 w-9 items-center justify-center rounded-full border bg-nexora-bg text-nexora-muted transition hover:border-nexora-primary/40 hover:bg-nexora-card hover:text-nexora-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nexora-hover"
            >
              <X className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
            </button>
          </header>

          <ChatMessages
            messages={messages}
            isLoading={isLoading}
            bottomRef={bottomRef}
            onOpenConsultation={openLeadModal}
          />

          {error && (
            <div className="mx-3 mb-2 rounded-xl border border-nexora-primary/30 bg-nexora-primary/10 px-3 py-2 text-xs text-nexora-text sm:mx-4">
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

          {!isLeadModalOpen ? null : (
            <LeadCaptureModal
              isOpen={isLeadModalOpen}
              onClose={closeLeadModal}
              onSuccess={handleLeadSuccess}
            />
          )}
        </div>
        )}

        <ChatLauncher isOpen={isOpen} onToggle={toggle} />
      </div>

      {isLeadModalOpen && !isOpen ? (
        <LeadCaptureModal
          isOpen={isLeadModalOpen}
          onClose={closeLeadModal}
          onSuccess={handleLeadSuccess}
          fullScreen
        />
      ) : null}
    </>
  );
}

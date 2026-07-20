import type { RefObject } from "react";
import { ConsultationCTA } from "./ConsultationCTA";
import { TypingIndicator } from "./TypingIndicator";
import type { Message } from "./types";

type ChatMessagesProps = {
  messages: Message[];
  isLoading: boolean;
  bottomRef: RefObject<HTMLDivElement | null>;
  onOpenConsultation?: () => void;
};

export function ChatMessages({
  messages,
  isLoading,
  bottomRef,
  onOpenConsultation,
}: ChatMessagesProps) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 space-y-3 overflow-y-auto overscroll-contain p-4 sm:p-5" aria-live="polite" aria-relevant="additions text">
        {messages.map((message) => {
        const isUser = message.role === "user";
        const isTyping =
          !isUser && isLoading && message.content === "" && message.id !== "welcome";

        return (
          <div
            key={message.id}
            className={`flex ${isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-6 sm:max-w-[80%] ${
                isUser ? "nexora-chat-user-bubble" : "nexora-chat-assistant-bubble"
              }`}
            >
              {isTyping ? <TypingIndicator /> : message.content}
            </div>
          </div>
        );
        })}
        <div ref={bottomRef} />
      </div>

      {onOpenConsultation && <ConsultationCTA onOpen={onOpenConsultation} />}
    </div>
  );
}

import type { RefObject } from "react";
import { TypingIndicator } from "./TypingIndicator";
import type { Message } from "./types";

type ChatMessagesProps = {
  messages: Message[];
  isLoading: boolean;
  bottomRef: RefObject<HTMLDivElement | null>;
};

export function ChatMessages({ messages, isLoading, bottomRef }: ChatMessagesProps) {
  return (
    <div className="flex-1 space-y-3 overflow-y-auto overscroll-contain p-4 sm:p-5">
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
                isUser
                  ? "border border-cyan-400/30 bg-gradient-to-r from-cyan-400/20 to-violet-500/20 text-white"
                  : "border border-white/10 bg-white/5 text-slate-200"
              }`}
            >
              {isTyping ? <TypingIndicator /> : message.content}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}

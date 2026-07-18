import type { FormEvent, RefObject } from "react";

type ChatInputProps = {
  input: string;
  isLoading: boolean;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onInputChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function ChatInput({
  input,
  isLoading,
  textareaRef,
  onInputChange,
  onSubmit,
}: ChatInputProps) {
  return (
    <form onSubmit={onSubmit} className="nexora-border border-t p-3 sm:p-4">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
          rows={1}
          placeholder="Ask Nexora anything..."
          disabled={isLoading}
          aria-label="Message input"
          className="nexora-input max-h-24 min-h-[44px] flex-1 resize-none bg-nexora-surface px-3.5 py-2.5 text-sm disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          aria-label="Send message"
          className="nexora-btn-primary inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <span className="text-xs font-semibold">···</span>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          )}
        </button>
      </div>
    </form>
  );
}

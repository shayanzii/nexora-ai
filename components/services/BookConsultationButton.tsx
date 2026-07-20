"use client";

import type { ReactNode } from "react";

type BookConsultationButtonProps = {
  className?: string;
  children?: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
};

const variantClasses = {
  primary: "nexora-btn-primary",
  secondary: "nexora-btn-secondary",
  ghost: "nexora-btn-ghost",
};

export function BookConsultationButton({
  className = "",
  children = "Book Your Free AI Strategy Call",
  variant = "primary",
}: BookConsultationButtonProps) {
  function handleClick() {
    window.dispatchEvent(new CustomEvent("nexora:open-consultation"));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-haspopup="dialog"
      className={`${variantClasses[variant]} w-full px-6 py-3 text-center font-semibold sm:w-auto ${className}`}
    >
      {children}
    </button>
  );
}

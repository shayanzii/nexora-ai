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
  children = "Book Free Consultation",
  variant = "primary",
}: BookConsultationButtonProps) {
  function handleClick() {
    window.dispatchEvent(new CustomEvent("nexora:open-consultation"));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${variantClasses[variant]} px-6 py-3 text-center font-semibold ${className}`}
    >
      {children}
    </button>
  );
}

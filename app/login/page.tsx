import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign in | Nexora AI Admin",
  description: "Sign in to the Nexora AI admin dashboard.",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="nexora-page-bg flex min-h-screen items-center justify-center text-sm text-nexora-muted">
          Loading…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

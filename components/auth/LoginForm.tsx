"use client";

import { LogIn, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function getSafeNextPath(next: string | null): string {
  if (!next || !next.startsWith("/admin")) {
    return "/admin";
  }
  return next;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = getSafeNextPath(searchParams.get("next"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setError("Supabase is not configured. Add your publishable key and URL.");
      setIsSubmitting(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setIsSubmitting(false);
      return;
    }

    router.push(nextPath);
    router.refresh();
  }

  return (
    <div className="nexora-page-bg flex min-h-screen items-center justify-center px-4 py-12">
      <div className="nexora-card w-full max-w-md rounded-2xl p-8 shadow-[0_0_60px_rgba(185,28,28,0.08)]">
        <div className="mb-8 flex items-center gap-3">
          <div className="nexora-icon-box flex h-11 w-11 items-center justify-center">
            <Sparkles className="h-5 w-5 text-nexora-hover" strokeWidth={2} aria-hidden="true" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-nexora-hover">
              Nexora AI
            </p>
            <h1 className="text-lg font-semibold text-nexora-text">Admin sign in</h1>
          </div>
        </div>

        <p className="mb-6 text-sm leading-6 text-nexora-muted">
          Sign in with your Supabase admin account to access the dashboard.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-nexora-text">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="nexora-input w-full rounded-xl px-4 py-2.5 text-sm"
              placeholder="you@company.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-nexora-text">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="nexora-input w-full rounded-xl px-4 py-2.5 text-sm"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-nexora-primary/30 bg-nexora-primary/10 px-4 py-3 text-sm text-nexora-text">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="nexora-btn-primary flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogIn className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-nexora-muted">
          <Link href="/" className="text-nexora-hover transition hover:text-nexora-text">
            Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}

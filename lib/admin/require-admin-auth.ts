import "server-only";

import type { User } from "@supabase/supabase-js";
import { createSupabaseCookieServerClient } from "@/lib/supabase/server";

type AdminAuthSuccess = { user: User };
type AdminAuthFailure = { status: number; message: string };

export async function requireAdminAuth(): Promise<AdminAuthSuccess | AdminAuthFailure> {
  const supabase = await createSupabaseCookieServerClient();

  if (!supabase) {
    return { status: 503, message: "Authentication is not configured." };
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { status: 401, message: "Unauthorized." };
  }

  return { user };
}

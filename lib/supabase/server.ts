import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import {
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
  isSupabaseServerConfigured,
} from "./env";

export type SupabaseServerClient = SupabaseClient<Database>;

/**
 * Server-only Supabase client (service role).
 * Use in API routes and server actions — never expose to the browser.
 * Returns null when env vars are not configured.
 */
export function createSupabaseServerClient(): SupabaseServerClient | null {
  if (!isSupabaseServerConfigured()) {
    return null;
  }

  return createClient<Database>(getSupabaseUrl()!, getSupabaseServiceRoleKey()!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseBrowserConfigured } from "./env";

export type SupabaseBrowserClient = SupabaseClient<Database>;

let browserClient: SupabaseBrowserClient | null = null;

/**
 * Browser-safe Supabase client (anon key).
 * Returns null when env vars are not configured.
 */
export function createSupabaseBrowserClient(): SupabaseBrowserClient | null {
  if (!isSupabaseBrowserConfigured()) {
    return null;
  }

  if (browserClient) {
    return browserClient;
  }

  browserClient = createClient<Database>(
    getSupabaseUrl()!,
    getSupabaseAnonKey()!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    },
  );

  return browserClient;
}

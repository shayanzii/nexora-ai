import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import {
  getSupabasePublishableKey,
  getSupabaseUrl,
  isSupabaseBrowserConfigured,
} from "./env";

export type SupabaseBrowserClient = SupabaseClient<Database>;

/**
 * Browser Supabase client (publishable key + cookie session).
 * Uses @supabase/ssr singleton — safe to call from any Client Component.
 */
export function createSupabaseBrowserClient(): SupabaseBrowserClient | null {
  if (!isSupabaseBrowserConfigured()) {
    return null;
  }

  return createBrowserClient<Database>(
    getSupabaseUrl()!,
    getSupabasePublishableKey()!,
  );
}

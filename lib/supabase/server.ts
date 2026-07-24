import "server-only";

import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "./database.types";
import {
  getSupabasePublishableKey,
  getSupabaseSecretKey,
  getSupabaseUrl,
  isSupabaseServerConfigured,
} from "./env";

export type SupabaseServerClient = SupabaseClient<Database, "public">;

function isNewFormatApiKey(key: string): boolean {
  return key.startsWith("sb_secret_") || key.startsWith("sb_publishable_");
}

/**
 * Fetch wrapper for sb_secret / sb_publishable keys on REST.
 * Sends the key only on the `apikey` header so PostgREST never tries to
 * parse it as a JWT in Authorization (see Supabase new API keys migration guide).
 */
function createApiKeyOnlyFetch(supabaseKey: string): typeof fetch {
  return async (input, init) => {
    const headers = new Headers(init?.headers ?? undefined);

    if (!headers.has("apikey")) {
      headers.set("apikey", supabaseKey);
    }

    return fetch(input, { ...init, headers });
  };
}

/**
 * Cookie-backed server client for user sessions (publishable key).
 * Official Next.js App Router pattern from @supabase/ssr.
 */
export async function createSupabaseCookieServerClient(): Promise<SupabaseServerClient | null> {
  const url = getSupabaseUrl();
  const publishableKey = getSupabasePublishableKey();

  if (!url || !publishableKey) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Components cannot write cookies; proxy handles refresh.
        }
      },
    },
  });
}

/**
 * Admin/server client (secret key, bypasses RLS).
 * Uses @supabase/supabase-js directly — not @supabase/ssr — so cookie
 * sessions never override the secret key (official Supabase guidance).
 */
export function createSupabaseServerClient(): SupabaseClient<Database> | null {
  if (!isSupabaseServerConfigured()) {
    return null;
  }

  const url = getSupabaseUrl()!;
  const secretKey = getSupabaseSecretKey()!;

  return createClient<Database>(url, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: isNewFormatApiKey(secretKey)
        ? createApiKeyOnlyFetch(secretKey)
        : undefined,
    },
  });
}

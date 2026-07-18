const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function getSupabaseUrl(): string | undefined {
  return SUPABASE_URL?.trim() || undefined;
}

export function getSupabaseAnonKey(): string | undefined {
  return SUPABASE_ANON_KEY?.trim() || undefined;
}

export function getSupabaseServiceRoleKey(): string | undefined {
  return SUPABASE_SERVICE_ROLE_KEY?.trim() || undefined;
}

export function isSupabaseBrowserConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

export function isSupabaseServerConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseServiceRoleKey());
}

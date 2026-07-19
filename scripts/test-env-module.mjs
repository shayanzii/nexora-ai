// Simulates lib/supabase/env.ts module-level capture behavior

console.log("=== At module load (simulating build) ===");
delete process.env.SUPABASE_SERVICE_ROLE_KEY;
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabaseUrl() {
  return SUPABASE_URL?.trim() || undefined;
}

function getSupabaseServiceRoleKey() {
  return SUPABASE_SERVICE_ROLE_KEY?.trim() || undefined;
}

function isSupabaseServerConfigured() {
  return Boolean(getSupabaseUrl() && getSupabaseServiceRoleKey());
}

console.log("After module load - configured:", isSupabaseServerConfigured());

console.log("\n=== After runtime env injected (simulating Vercel request) ===");
process.env.SUPABASE_SERVICE_ROLE_KEY = "real-key-at-runtime";

console.log("process.env.SUPABASE_SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log("Module constant SUPABASE_SERVICE_ROLE_KEY:", SUPABASE_SERVICE_ROLE_KEY);
console.log("getSupabaseServiceRoleKey():", getSupabaseServiceRoleKey());
console.log("isSupabaseServerConfigured():", isSupabaseServerConfigured());

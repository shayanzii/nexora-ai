import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { createSupabaseCookieServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin | Nexora AI",
  description: "Nexora AI admin dashboard for leads, projects, and operations.",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseCookieServerClient();

  if (!supabase) {
    redirect("/login");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <AdminShell>{children}</AdminShell>;
}

"use client";

import {
  FolderKanban,
  LayoutDashboard,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminLogoutButton } from "./AdminLogoutButton";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/leads", label: "Leads", icon: Users, exact: false },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban, exact: false },
  { href: "/admin/settings", label: "Settings", icon: Settings, exact: false },
];

function isActive(pathname: string, href: string, exact: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="nexora-surface flex w-full shrink-0 flex-col border-r lg:w-64">
      <div className="nexora-border border-b px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="nexora-icon-box flex h-10 w-10 items-center justify-center">
            <Sparkles className="h-5 w-5 text-nexora-hover" strokeWidth={2} aria-hidden="true" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-nexora-hover">
              Nexora AI
            </p>
            <p className="text-sm font-semibold text-nexora-text">Admin</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3" aria-label="Admin navigation">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(pathname, href, exact);

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "border border-nexora-primary/30 bg-nexora-primary/15 text-nexora-text shadow-[0_0_24px_rgba(185,28,28,0.12)]"
                  : "text-nexora-muted hover:bg-nexora-card hover:text-nexora-text"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="nexora-border border-t p-4">
        <AdminLogoutButton />
      </div>
    </aside>
  );
}

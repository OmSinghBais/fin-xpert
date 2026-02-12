// components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/clients", label: "Clients" },
  { href: "/sips", label: "SIPs" },
  { href: "/loans", label: "Loans" },
  { href: "/crm", label: "CRM" },
  { href: "/admin", label: "Admin" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r border-slate-800 bg-slate-950/80 p-4 md:flex">
      <div className="mb-6 flex items-center gap-2">
        <div className="h-8 w-8 rounded-xl bg-emerald-500/20" />
        <span className="text-lg font-semibold tracking-tight">
          Fixpert
        </span>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "block rounded-xl px-3 py-2 text-sm transition",
                active
                  ? "bg-emerald-500/10 text-emerald-300"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

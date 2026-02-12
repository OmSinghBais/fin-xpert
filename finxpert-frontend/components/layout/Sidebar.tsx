"use client";

import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-slate-50 p-4 border-r border-slate-800">
      <h2 className="text-xl font-bold mb-4">Finxpert</h2>
      <nav className="space-y-2 text-sm">
        <Link href="/clients" className="block hover:text-emerald-400">
          Clients
        </Link>
        <Link href="/sips" className="block hover:text-emerald-400">
          SIPs
        </Link>
        <Link href="/loans" className="block hover:text-emerald-400">
          Loans
        </Link>
        <Link href="/crm" className="block hover:text-emerald-400">
          CRM
        </Link>
      </nav>
    </aside>
  );
}

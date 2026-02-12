// app/(dashboard)/clients/page.tsx
"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Client } from "@/types/client";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const data = await api.get<Client[]>("/api/clients"); // adjust to your backend
        if (mounted) {
          setClients(data);
          setError(null);
        }
      } catch (err: any) {
        if (mounted) {
          setError("Could not load clients.");
          console.error(err);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Clients</h2>
          <p className="text-xs text-slate-400">
            View and manage all your advisory clients.
          </p>
        </div>
        <Button>
          + Add Client
        </Button>
      </div>

      {loading && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-400">
          Loading clients...
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-700/60 bg-red-900/20 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {!loading && !error && clients.length === 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-center text-sm text-slate-400">
          No clients yet. Start by adding your first client.
        </div>
      )}

      {!loading && !error && clients.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/60">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3 text-left">Client</th>
                <th className="px-4 py-3 text-left">Age</th>
                <th className="px-4 py-3 text-left">Risk</th>
                <th className="px-4 py-3 text-left">AUM</th>
                <th className="px-4 py-3 text-left">Goals</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr
                  key={c.id}
                  className="border-t border-slate-800/70 hover:bg-slate-900/60"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-100">{c.name}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{c.age}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-200">
                      {c.riskLevel}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-200">
                    ₹{c.totalAum.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-slate-300">{c.goalsCount}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/clients/${c.id}`}
                      className="text-xs text-emerald-300 hover:text-emerald-200"
                    >
                      View details →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

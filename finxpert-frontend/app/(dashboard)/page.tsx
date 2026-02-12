'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiGet } from '@/lib/api';
import { Client } from '@/lib/types';

export default function DashboardPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalClients: 0,
    totalAUM: 0,
    activeLoans: 0,
    activeGoals: 0,
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiGet<Client[]>('/clients');
        setClients(data);

        // Calculate stats
        const totalAUM = data.reduce((sum, c) => sum + (c.aum || 0), 0);
        setStats({
          totalClients: data.length,
          totalAUM,
          activeLoans: 0, // TODO: fetch from loans endpoint
          activeGoals: 0, // TODO: fetch from goals endpoint
        });
      } catch (e: any) {
        console.error(e);
        setError(e.message ?? 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-400">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400 text-sm">Overview of your advisory practice</p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-800 bg-red-950/20 p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <div className="text-xs text-slate-400 mb-1">Total Clients</div>
          <div className="text-2xl font-semibold text-white">{stats.totalClients}</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <div className="text-xs text-slate-400 mb-1">Total AUM</div>
          <div className="text-2xl font-semibold text-white">
            ₹{stats.totalAUM.toLocaleString('en-IN')}
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <div className="text-xs text-slate-400 mb-1">Active Loans</div>
          <div className="text-2xl font-semibold text-white">{stats.activeLoans}</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <div className="text-xs text-slate-400 mb-1">Active Goals</div>
          <div className="text-2xl font-semibold text-white">{stats.activeGoals}</div>
        </div>
      </div>

      {/* Recent Clients */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50">
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent Clients</h2>
            <Link
              href="/clients"
              className="text-sm text-emerald-400 hover:text-emerald-300"
            >
              View All →
            </Link>
          </div>
        </div>
        <div className="p-4">
          {clients.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              No clients yet. Start by adding your first client.
            </div>
          ) : (
            <div className="space-y-2">
              {clients.slice(0, 5).map((client) => (
                <Link
                  key={client.id}
                  href={`/clients/${client.id}`}
                  className="block rounded-lg border border-slate-800 bg-slate-900/30 p-3 hover:border-emerald-500/50 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">{client.name}</div>
                      <div className="text-xs text-slate-400">
                        {client.email || client.phone}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-white">
                        ₹{(client.aum || 0).toLocaleString('en-IN')}
                      </div>
                      <div className="text-xs text-slate-400">AUM</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

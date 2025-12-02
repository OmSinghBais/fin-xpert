// app/clients/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiGet } from '@/lib/api';
import { Client } from '@/lib/types';



export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiGet<Client[]>('/clients');
        setClients(data);
      } catch (e: any) {
        console.error(e);
        setError(e.message ?? 'Failed to load clients');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-white mb-4">Demo Clients</h1>

      {error && (
        <div className="mb-3 text-red-400 text-sm">Error: {error}</div>
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="min-w-full text-sm">
          <thead className="bg-[#020617] border-b border-gray-800">
            <tr>
              <th className="px-4 py-2 text-left text-gray-400">Name</th>
              <th className="px-4 py-2 text-left text-gray-400">Email</th>
              <th className="px-4 py-2 text-left text-gray-400">Phone</th>
              <th className="px-4 py-2 text-left text-gray-400">Created</th>
              <th className="px-4 py-2 text-left text-gray-400">Open</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id} className="border-b border-gray-800">
                <td className="px-4 py-2 text-white">{c.name}</td>
                <td className="px-4 py-2 text-gray-200">{c.email ?? '—'}</td>
                <td className="px-4 py-2 text-gray-200">{c.phone ?? '—'}</td>
                <td className="px-4 py-2 text-gray-400">—</td>
                <td className="px-4 py-2">
                  <Link
                    href={`/clients/${c.id}`}
                    className="text-xs text-blue-400 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}

            {!loading && clients.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-4 text-center text-gray-500 text-sm"
                >
                  No clients found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {loading && (
        <div className="mt-3 text-gray-300 text-sm">Loading clients…</div>
      )}
    </div>
  );
}

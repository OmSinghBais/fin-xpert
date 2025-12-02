'use client';

import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '@/lib/api';

type Loan = {
  id: string;
  amount: number | string;
  status: string;
  interestRate: number | string;
  tenureMonths: number;
  client: {
    id: string;
    name: string;
    email?: string;
  };
};

export default function AdminLoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () =>
    apiGet<Loan[]>('/admin/loans')
      .then((data) =>
        setLoans(
          data.map((l) => ({
            ...l,
            amount: Number(l.amount),
            interestRate: Number(l.interestRate),
          })),
        ),
      )
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  async function approve(id: string) {
    await apiPost(`/admin/loans/${id}/approve`);
    load();
  }

  if (loading) return <div className="p-6">Loading loans...</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-2">Admin Loan Panel</h1>

      <table className="border w-full text-sm">
        <thead>
          <tr className="bg-gray-900">
            <th className="border p-2">Client</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Tenure</th>
            <th className="border p-2">Rate</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((l) => (
            <tr key={l.id}>
              <td className="border p-2">
                {l.client.name}
                {l.client.email && (
                  <div className="text-[10px] text-gray-500">
                    {l.client.email}
                  </div>
                )}
              </td>
              <td className="border p-2">₹{Number(l.amount).toLocaleString()}</td>
              <td className="border p-2">{l.tenureMonths} m</td>
              <td className="border p-2">{l.interestRate}%</td>
              <td className="border p-2 font-semibold">{l.status}</td>
              <td className="border p-2">
                {l.status === 'PENDING' ? (
                  <button
                    onClick={() => approve(l.id)}
                    className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                  >
                    Approve
                  </button>
                ) : (
                  <span className="text-xs text-gray-400">No action</span>
                )}
              </td>
            </tr>
          ))}
          {loans.length === 0 && (
            <tr>
              <td className="border p-2 text-center" colSpan={6}>
                No loans found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

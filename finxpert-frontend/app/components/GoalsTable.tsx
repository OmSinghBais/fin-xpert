// components/GoalsTable.tsx
'use client';

import { Goal } from '@/lib/types';

interface Props {
  goals: Goal[];
}

export function GoalsTable({ goals }: Props) {
  if (!goals.length) return null;

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-white mb-2">
        Goals &amp; SIP Plan
      </h2>
      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="min-w-full text-sm">
          <thead className="bg-[#020617] border-b border-gray-800">
            <tr>
              <th className="px-4 py-2 text-left text-gray-400">Goal</th>
              <th className="px-4 py-2 text-left text-gray-400">Target</th>
              <th className="px-4 py-2 text-left text-gray-400">Current</th>
              <th className="px-4 py-2 text-left text-gray-400">Progress</th>
              <th className="px-4 py-2 text-left text-gray-400">Required SIP</th>
              <th className="px-4 py-2 text-left text-gray-400">MF Allocation</th>
            </tr>
          </thead>
          <tbody>
            {goals.map((g) => {
              const progress =
                g.targetAmount > 0
                  ? Math.min(
                      100,
                      ((g.currentAmount ?? 0) / g.targetAmount) * 100,
                    )
                  : 0;

              const sipLabel =
                g.requiredSipMonthly != null
                  ? `₹${g.requiredSipMonthly.toLocaleString('en-IN')}/month`
                  : '—';

              const mfNote =
                g.mfAllocationNote ??
                g.mfScheme ??
                g.schemeName ??
                '—';

              return (
                <tr key={g.id} className="border-b border-gray-800">
                  <td className="px-4 py-2">
                    <div className="text-white">{g.name}</div>
                    {g.status && (
                      <div className="text-xs text-gray-400 mt-0.5">
                        {g.status} · {g.expectedReturnPercent ?? '—'}% P.A.
                      </div>
                    )}
                    {g.targetDate && (
                      <div className="text-xs text-gray-500">
                        Target by {g.targetDate}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2 text-gray-200">
                    ₹{g.targetAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-2 text-gray-200">
                    ₹{(g.currentAmount ?? 0).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-2">
                    <div className="text-xs text-gray-300 mb-1">
                      {progress.toFixed(1)}%
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2 text-gray-200">{sipLabel}</td>
                  <td className="px-4 py-2 text-gray-200 whitespace-pre-wrap">
                    {mfNote}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

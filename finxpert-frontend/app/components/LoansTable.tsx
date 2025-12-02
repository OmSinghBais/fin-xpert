// components/LoansTable.tsx
'use client';

import { useState } from 'react';
import { Loan, LoanStatus, UserRole } from '@/lib/types';
import { LoanTimelineModal } from './LoanTimelineModal';
import { RoleGate } from './RoleGate';

interface Props {
  loans: Loan[];
  onChangeStatus: (loanId: string, status: LoanStatus) => Promise<void> | void;
  currentRole: UserRole;
  actionLoading: boolean;
}

export function LoansTable({ loans, onChangeStatus, currentRole, actionLoading }: Props) {
  const [timelineLoanId, setTimelineLoanId] = useState<string | null>(null);

  const activeTimelineLoan = loans.find((l) => l.id === timelineLoanId) || null;

  const handleStatusClick = async (loanId: string, status: LoanStatus) => {
    await onChangeStatus(loanId, status);
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-white mb-2">Loans</h2>
      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="min-w-full text-sm">
          <thead className="bg-[#020617] border-b border-gray-800">
            <tr>
              <th className="px-4 py-2 text-left text-gray-400">Amount</th>
              <th className="px-4 py-2 text-left text-gray-400">Tenure</th>
              <th className="px-4 py-2 text-left text-gray-400">Rate</th>
              <th className="px-4 py-2 text-left text-gray-400">EMI</th>
              <th className="px-4 py-2 text-left text-gray-400">Status</th>
              <th className="px-4 py-2 text-left text-gray-400">Actions</th>
              <th className="px-4 py-2 text-left text-gray-400">Timeline</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.id} className="border-b border-gray-800">
                <td className="px-4 py-2 text-white">
                  ₹{(loan.amount ?? 0).toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-2 text-gray-200">
                  {loan.tenureMonths ?? '—'} months
                </td>
                <td className="px-4 py-2 text-gray-200">
                  {loan.rateAnnual ?? '—'}%
                </td>
                <td className="px-4 py-2 text-gray-200">
                  {loan.emi != null
                    ? `₹${loan.emi.toLocaleString('en-IN')}`
                    : '—'}
                </td>
                <td className="px-4 py-2">
                  <span className="inline-flex items-center rounded-full border border-gray-600 px-2 py-0.5 text-xs text-gray-100">
                    {loan.status}
                  </span>
                </td>
                <td className="px-4 py-2 space-x-2">
                  <RoleGate allowed={['ADMIN', 'ADVISOR']} currentRole={currentRole}>
                    {loan.status === 'PENDING' && (
                      <>
                        <button
                          disabled={actionLoading}
                          onClick={() => handleStatusClick(loan.id, 'APPROVED')}
                          className="text-xs px-2 py-1 rounded bg-green-700 hover:bg-green-600 text-white disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          disabled={actionLoading}
                          onClick={() => handleStatusClick(loan.id, 'REJECTED')}
                          className="text-xs px-2 py-1 rounded bg-red-700 hover:bg-red-600 text-white disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {loan.status === 'APPROVED' && (
                      <button
                        disabled={actionLoading}
                        onClick={() => handleStatusClick(loan.id, 'DISBURSED')}
                        className="text-xs px-2 py-1 rounded bg-blue-700 hover:bg-blue-600 text-white disabled:opacity-50"
                      >
                        Mark Disbursed
                      </button>
                    )}
                  </RoleGate>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => setTimelineLoanId(loan.id)}
                    className="text-xs text-blue-400 hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}

            {loans.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-4 text-center text-gray-500 text-sm"
                >
                  No loans
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {activeTimelineLoan && (
        <LoanTimelineModal
          open={!!activeTimelineLoan}
          onClose={() => setTimelineLoanId(null)}
          events={activeTimelineLoan.statusTimeline ?? []}
        />
      )}
    </div>
  );
}

// components/LoanTimelineModal.tsx
'use client';

import { LoanStatusEvent } from '@/lib/types';

interface Props {
  open: boolean;
  onClose: () => void;
  events: LoanStatusEvent[];
}

export function LoanTimelineModal({ open, onClose, events }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-[#111827] rounded-xl p-6 w-full max-w-lg shadow-xl border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">Loan Timeline</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 text-sm"
          >
            Close
          </button>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {events.map((e) => (
            <div key={e.id} className="border-b border-gray-700 pb-2 last:border-b-0">
              <div className="text-xs text-gray-400">
                {new Date(e.createdAt).toLocaleString()}
              </div>
              <div className="font-medium text.white text-white">
                {e.from ? `${e.from} → ${e.to}` : e.to}
              </div>
              {e.actorName && (
                <div className="text-xs text-gray-400">
                  {e.actorName} ({e.actorRole ?? 'SYSTEM'})
                </div>
              )}
              {e.note && (
                <div className="text-sm text-gray-200 mt-1">
                  {e.note}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

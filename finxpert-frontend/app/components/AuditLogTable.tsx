// components/AuditLogTable.tsx
'use client';

import { AuditLogEntry } from '@/lib/types';

interface Props {
  logs: AuditLogEntry[];
}

export function AuditLogTable({ logs }: Props) {
  if (!logs.length) return null;

  return (
    <div className="mt-8">
      <h3 className="text-sm font-semibold text-gray-300 mb-2">
        Activity / Audit Log
      </h3>
      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="min-w-full text-xs">
          <thead className="bg-[#020617] border-b border-gray-800">
            <tr>
              <th className="px-3 py-2 text-left text-gray-400">Time</th>
              <th className="px-3 py-2 text-left text-gray-400">Actor</th>
              <th className="px-3 py-2 text-left text-gray-400">Role</th>
              <th className="px-3 py-2 text-left text-gray-400">Action</th>
              <th className="px-3 py-2 text-left text-gray-400">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-gray-800">
                <td className="px-3 py-2 text-gray-300">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="px-3 py-2 text-gray-200">{log.actorName}</td>
                <td className="px-3 py-2 text-gray-400">{log.actorRole}</td>
                <td className="px-3 py-2 text-gray-200">{log.action}</td>
                <td className="px-3 py-2 text-gray-400">
                  {log.details ?? '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

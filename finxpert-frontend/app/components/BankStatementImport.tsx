'use client';

import { useState } from 'react';

interface BankStatementImportProps {
  clientId: string;
  onImportSuccess?: () => void;
}

export function BankStatementImport({ clientId, onImportSuccess }: BankStatementImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [importedCount, setImportedCount] = useState<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setSuccess(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/bank/import/${clientId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Import failed');
      }

      const data = await response.json();
      setImportedCount(data.importedCount || 0);
      setSuccess(true);
      setFile(null);
      
      if (onImportSuccess) {
        onImportSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to import bank statement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <h3 className="text-lg font-semibold text-white mb-4">Import Bank Statement</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Statement File (PDF or Excel)
          </label>
          <input
            type="file"
            accept=".pdf,.xlsx,.xls"
            onChange={handleFileChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-700"
          />
          <p className="mt-1 text-xs text-slate-400">
            Supported formats: PDF, Excel (.xlsx, .xls). The system will automatically parse transactions using AI.
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-800 bg-red-950/20 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg border border-emerald-800 bg-emerald-950/20 p-3 text-sm text-emerald-400">
            Successfully imported {importedCount} transactions!
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !file}
          className="w-full rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Importing...' : 'Import Statement'}
        </button>
      </form>
    </div>
  );
}

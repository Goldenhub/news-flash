'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Status = 'idle' | 'loading' | 'done' | 'error';

interface Result {
  ok: boolean;
  fetched: number;
  inserted: number;
  cleaned: number;
  total_articles: number;
  elapsed_ms: number;
}

export default function RefreshButton({ label = 'Fetch News Now', variant = 'primary' }: { label?: string; variant?: 'primary' | 'header' }) {
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<Result | null>(null);
  const router = useRouter();

  const handleClick = async () => {
    setStatus('loading');
    setResult(null);
    try {
      const res = await fetch('/api/refresh', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch');
      setResult(data);
      setStatus('done');
      setTimeout(() => {
        router.refresh();
        setStatus('idle');
      }, 2000);
    } catch (e) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  if (variant === 'header') {
    return (
      <button
        onClick={handleClick}
        disabled={status === 'loading'}
        className="text-[11px] text-neutral-400 hover:text-neutral-600 transition-colors disabled:opacity-50 dark:hover:text-neutral-300"
      >
        {status === 'loading' ? (
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Fetching
          </span>
        ) : (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        )}
      </button>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={status === 'loading'}
        className="px-6 py-2.5 bg-neutral-900 text-white rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
      >
        {status === 'loading' ? 'Fetching...' : label}
      </button>

      {status === 'loading' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-3 border-neutral-200 border-t-neutral-900 rounded-full animate-spin dark:border-neutral-600 dark:border-t-white" />
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Fetching articles from 18 sources...</p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">This may take up to a minute</p>
          </div>
        </div>
      )}

      {status === 'done' && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Done</p>
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500">{(result.elapsed_ms / 1000).toFixed(1)}s</p>
              </div>
            </div>
            <div className="space-y-1.5 text-sm text-neutral-600 dark:text-neutral-300">
              <p><span className="font-medium text-neutral-800 dark:text-neutral-100">{result.fetched}</span> articles fetched</p>
              <p><span className="font-medium text-neutral-800 dark:text-neutral-100">{result.inserted}</span> new</p>
              {result.cleaned > 0 && <p><span className="font-medium text-neutral-800 dark:text-neutral-100">{result.cleaned}</span> old cleaned</p>}
              <p><span className="font-medium text-neutral-800 dark:text-neutral-100">{result.total_articles}</span> total in database</p>
            </div>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-red-600">Failed</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

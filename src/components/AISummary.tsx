'use client';

import { useState } from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export default function AISummary({ articleId }: { articleId: string }) {
  const online = useOnlineStatus();
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSummarize = async () => {
    if (summary || !online) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: articleId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to summarize');
      setSummary(data.summary);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-10 p-4 rounded-2xl bg-white border border-neutral-200/60 dark:bg-neutral-800/60 dark:border-neutral-700/40">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          {!summary && !loading && !error && (
            <button
              onClick={handleSummarize}
              disabled={!online}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                online
                  ? 'bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed dark:bg-neutral-700 dark:text-neutral-500'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              {online ? 'AI Summary' : 'Offline'}
            </button>
          )}

          {loading && (
            <div className="space-y-2 animate-pulse">
              <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-full" />
              <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-5/6" />
              <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-4/5" />
              <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4" />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-red-500">{error}</span>
              <button
                onClick={() => { setError(''); setSummary(null); }}
                className="text-xs text-neutral-500 underline hover:text-neutral-700"
              >
                Try again
              </button>
            </div>
          )}

          {summary && !loading && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span className="text-[11px] uppercase tracking-widest font-semibold text-neutral-400">AI Summary</span>
              </div>
              <p className="text-sm text-neutral-700 leading-relaxed dark:text-neutral-300">{summary}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

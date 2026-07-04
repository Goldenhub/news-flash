'use client';

import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export default function OfflineNotice() {
  const online = useOnlineStatus();
  if (online) return null;

  return (
    <div className="mb-6 flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 dark:bg-amber-900/30 dark:border-amber-700/40 dark:text-amber-300">
      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m-2.829-2.829a5 5 0 000-7.07m-4.243 4.243a1 1 0 010-1.414" />
      </svg>
      <span>You&rsquo;re offline &mdash; showing cached content. Images may not load.</span>
    </div>
  );
}

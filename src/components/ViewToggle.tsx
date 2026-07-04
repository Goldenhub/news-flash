'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function ViewToggle({ view }: { view: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setView = (v: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', v);
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-1 shrink-0 bg-teal-card border border-teal-border/40 rounded-xl p-0.5">
      <button
        onClick={() => setView('grid')}
        className={`p-1.5 rounded-lg transition-all ${view === 'grid' ? 'bg-white text-teal-bg shadow-sm' : 'text-white/40 hover:text-white/70'}`}
        aria-label="Grid view"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
          <path d="M1 2.5A1.5 1.5 0 012.5 1h3A1.5 1.5 0 017 2.5v3A1.5 1.5 0 015.5 7h-3A1.5 1.5 0 011 5.5v-3zm8 0A1.5 1.5 0 0110.5 1h3A1.5 1.5 0 0115 2.5v3A1.5 1.5 0 0113.5 7h-3A1.5 1.5 0 019 5.5v-3zm-8 8A1.5 1.5 0 012.5 9h3A1.5 1.5 0 017 10.5v3A1.5 1.5 0 015.5 15h-3A1.5 1.5 0 011 13.5v-3zm8 0A1.5 1.5 0 0110.5 9h3a1.5 1.5 0 011.5 1.5v3a1.5 1.5 0 01-1.5 1.5h-3A1.5 1.5 0 019 13.5v-3z" />
        </svg>
      </button>
      <button
        onClick={() => setView('list')}
        className={`p-1.5 rounded-lg transition-all ${view === 'list' ? 'bg-white text-teal-bg shadow-sm' : 'text-white/40 hover:text-white/70'}`}
        aria-label="List view"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M2.5 12a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5z" />
        </svg>
      </button>
    </div>
  );
}

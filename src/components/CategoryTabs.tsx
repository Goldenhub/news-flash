'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { CATEGORIES } from '@/lib/sources';

export default function CategoryTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get('category') || 'all';

  const handleSelect = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === 'all') {
      params.delete('category');
    } else {
      params.set('category', slug);
    }
    params.delete('page');
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
      <button
        onClick={() => handleSelect('all')}
        className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
          active === 'all'
            ? 'bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-900'
            : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200/60 dark:bg-neutral-800/60 dark:text-neutral-400 dark:border-neutral-700/40 dark:hover:bg-neutral-700/50'
        }`}
      >
        All
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => handleSelect(cat.slug)}
          className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            active === cat.slug
              ? 'bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-900'
              : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200/60 dark:bg-neutral-800/60 dark:text-neutral-400 dark:border-neutral-700/40 dark:hover:bg-neutral-700/50'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}

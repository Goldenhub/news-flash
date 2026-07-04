'use client';

import { useEffect } from 'react';

export default function ArticlePrefetcher({ ids }: { ids: string[] }) {
  useEffect(() => {
    if (!('serviceWorker' in navigator) || !navigator.onLine || ids.length === 0) return;

    const prefetch = () => {
      ids.forEach((id) => fetch(`/article/${id}`).catch(() => {}));
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(prefetch, { timeout: 3000 });
    } else {
      setTimeout(prefetch, 1000);
    }
  }, [ids]);

  return null;
}

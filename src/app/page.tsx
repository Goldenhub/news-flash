import { getArticles, articleCount } from '@/lib/db';
import type { Category } from '@/lib/types';
import { CATEGORIES, SOURCES } from '@/lib/sources';
import CategoryTabs from '@/components/CategoryTabs';
import ArticleCard from '@/components/ArticleCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ViewToggle from '@/components/ViewToggle';
import RefreshButton from '@/components/RefreshButton';
import ArticlePrefetcher from '@/components/ArticlePrefetcher';
import { Suspense } from 'react';

const validCategories: Category[] = CATEGORIES.map((c) => c.slug);

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string; view?: string }>;
}) {
  const params = await searchParams;
  const category = params.category && validCategories.includes(params.category as Category)
    ? (params.category as Category)
    : undefined;
  const page = Math.max(1, parseInt(params.page || '1', 10));
  const view = params.view === 'list' ? 'list' : 'grid';

  const total = articleCount();
  const isEmpty = total === 0;

  if (isEmpty) {
    return (
      <main className="min-h-dvh bg-teal-bg">
        <Header />
        <div className="flex flex-col items-center justify-center px-4" style={{ minHeight: 'calc(100dvh - 120px)' }}>
          <div className="w-20 h-20 rounded-2xl bg-teal-card flex items-center justify-center mb-5">
            <svg className="w-10 h-10 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-white mb-1.5">No articles yet</h2>
          <p className="text-sm text-white/60 mb-7 max-w-xs text-center leading-relaxed">
            Your daily brief is empty. Hit the button below or set up a cron job to fetch the latest news.
          </p>
          <RefreshButton />
        </div>
      </main>
    );
  }

  const c = category || CATEGORIES[0].slug;
  const { articles } = getArticles(c, page);

  return (
    <main className="min-h-dvh bg-teal-bg">
      <Header />
      <div className="max-w-6xl mx-auto px-4 pb-16">
          <div className="mb-7 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CategoryTabs />
          </div>
          <ViewToggle view={view} />
        </div>

        <Suspense fallback={<LoadingSkeleton view={view} />}>
          {articles.length === 0 ? (
            <p className="text-center text-white/40 py-20 text-sm">No articles in this category yet.</p>
          ) : (
            <>
              <div className={view === 'list' ? 'flex flex-col gap-4' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'}>
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} currentCategory={c} listView={view === 'list'} />
                ))}
              </div>
              <ArticlePrefetcher ids={articles.map((a) => a.id)} />
            </>
          )}
        </Suspense>
      </div>
    </main>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-10 bg-teal-bg/80 backdrop-blur-lg border-b border-teal-border/50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white">NewsFlash</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-white/40">
            {SOURCES.length} sources &middot; 7-day auto-clean
          </span>
          <RefreshButton label="Refresh" variant="header" />
        </div>
      </div>
    </header>
  );
}

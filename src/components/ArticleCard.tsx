import Link from 'next/link';
import type { Article } from '@/lib/types';

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

const GRADIENTS = [
  'from-blue-600 to-indigo-700', 'from-emerald-600 to-teal-700',
  'from-violet-600 to-purple-700', 'from-rose-600 to-pink-700',
  'from-cyan-600 to-blue-700', 'from-amber-600 to-orange-700',
];

function hashGradient(url: string): string {
  let hash = 0;
  for (let i = 0; i < url.length; i++) hash = ((hash << 5) - hash) + url.charCodeAt(i);
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

export default function ArticleCard({ article, currentCategory, listView }: { article: Article; currentCategory?: string; listView?: boolean }) {
  const href = currentCategory
    ? `/article/${article.id}?from=${encodeURIComponent(currentCategory)}`
    : `/article/${article.id}`;

  if (listView) {
    return (
      <Link
        href={href}
        className="group relative flex items-start gap-4 rounded-2xl border border-neutral-200/70 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 p-3 dark:border-neutral-700/50 dark:bg-neutral-800/80"
      >
        <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-700">
          {article.image_url ? (
            <img
              src={article.image_url}
              alt=""
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${hashGradient(article.url)} flex items-center justify-center`}>
              <span className="text-white/20 text-3xl font-black tracking-tight select-none">
                {article.source.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-[10px] font-semibold rounded-md dark:bg-neutral-700 dark:text-neutral-400">
              {article.source}
            </span>
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500">{timeAgo(article.published_at)}</span>
          </div>
          <h3 className="font-semibold text-[14px] text-neutral-900 leading-snug line-clamp-2 dark:text-neutral-100">
            {article.title}
          </h3>
          {article.description && (
            <p className="text-xs text-neutral-500 leading-relaxed line-clamp-1 mt-0.5 dark:text-neutral-400">
              {article.description}
            </p>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group relative flex flex-col rounded-2xl border border-neutral-200/70 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 dark:border-neutral-700/50 dark:bg-neutral-800/80"
    >
      <div className="aspect-[16/10] relative overflow-hidden bg-neutral-100 dark:bg-neutral-700">
        {article.image_url ? (
          <>
            <img
              src={article.image_url}
              alt=""
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${hashGradient(article.url)} flex items-center justify-center`}>
            <span className="text-white/20 text-7xl font-black tracking-tight select-none">
              {article.source.charAt(0)}
            </span>
          </div>
        )}
        <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-neutral-800 text-[11px] font-semibold rounded-lg shadow-xs">
          {article.source}
        </span>
      </div>
      <div className="flex flex-col gap-1.5 p-4">
        <h3 className="font-semibold text-[15px] text-neutral-900 leading-snug line-clamp-2 dark:text-neutral-100">
          {article.title}
        </h3>
        {article.description && (
          <p className="text-sm text-neutral-500 leading-relaxed line-clamp-2 dark:text-neutral-400">
            {article.description}
          </p>
        )}
        <span className="text-[11px] text-neutral-400 mt-1 dark:text-neutral-500">
          {timeAgo(article.published_at)}
        </span>
      </div>
    </Link>
  );
}

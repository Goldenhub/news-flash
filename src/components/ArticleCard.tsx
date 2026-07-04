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
  'from-teal-600 to-cyan-700', 'from-emerald-600 to-teal-700',
  'from-cyan-600 to-blue-700', 'from-teal-500 to-emerald-600',
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
        className="group relative flex items-start gap-4 rounded-2xl border border-teal-border/60 bg-teal-card overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 p-3"
      >
        <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-teal-hover">
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
            <span className="px-2 py-0.5 bg-white/15 text-white/80 text-[10px] font-semibold rounded-md">
              {article.source}
            </span>
            <span className="text-[10px] text-white/40">{timeAgo(article.published_at)}</span>
          </div>
          <h3 className="font-semibold text-[14px] text-white leading-snug line-clamp-2">
            {article.title}
          </h3>
          {article.description && (
            <p className="text-xs text-white/60 leading-relaxed line-clamp-1 mt-0.5">
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
      className="group relative flex flex-col rounded-2xl border border-teal-border/60 bg-teal-card overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
    >
      <div className="aspect-[16/10] relative overflow-hidden bg-teal-hover">
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
        <span className="absolute top-3 left-3 px-2.5 py-1 bg-teal-bg/80 text-white text-[11px] font-semibold rounded-lg shadow-xs backdrop-blur-sm">
          {article.source}
        </span>
      </div>
      <div className="flex flex-col gap-1.5 p-4">
        <h3 className="font-semibold text-[15px] text-white leading-snug line-clamp-2">
          {article.title}
        </h3>
        {article.description && (
          <p className="text-sm text-white/60 leading-relaxed line-clamp-2">
            {article.description}
          </p>
        )}
        <span className="text-[11px] text-white/40 mt-1">
          {timeAgo(article.published_at)}
        </span>
      </div>
    </Link>
  );
}

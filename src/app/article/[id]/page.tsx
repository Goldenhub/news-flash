import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticle } from '@/lib/db';
import TTSControls from '@/components/TTSControls';
import AISummary from '@/components/AISummary';
import OfflineNotice from '@/components/OfflineNotice';
import SafeImage from '@/components/SafeImage';

export default async function ArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { id } = await params;
  const { from } = await searchParams;
  const article = getArticle(id);

  if (!article) notFound();

  const displayContent = article.content || article.description || 'No content available.';
  const displayHtml = article.content_html || null;
  const backHref = from ? `/?category=${encodeURIComponent(from)}` : '/';

  return (
    <main className="min-h-dvh bg-teal-bg">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80 mb-8 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>

        <OfflineNotice />

        <article>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 bg-white/15 text-white text-[11px] font-semibold rounded-lg">
                {article.source}
              </span>
              <span className="text-xs text-white/50">
                {new Date(article.published_at).toLocaleDateString('en-US', {
                  weekday: 'short', year: 'numeric', month: 'long', day: 'numeric',
                })}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight tracking-tight">
              {article.title}
            </h1>
          </div>

          {article.image_url && (
            <div className="mb-10 rounded-2xl overflow-hidden">
              <SafeImage src={article.image_url} alt="" className="w-full h-auto max-h-96 object-cover" />
            </div>
          )}

          <div className="mb-10 p-4 rounded-2xl bg-teal-card border border-teal-border/60">
            <TTSControls text={`${article.title}. ${displayContent}`} />
          </div>

          <AISummary articleId={id} />

          {displayHtml ? (
            <div
              className="prose prose-invert max-w-none text-[15px] leading-relaxed [&_p]:mb-4 [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:font-semibold [&_h2]:text-lg [&_blockquote]:border-l-4 [&_blockquote]:border-white/20 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-white/60 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1 [&_a]:text-teal-accent [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: displayHtml }}
            />
          ) : (
            <div className="text-white/80 leading-[1.75] text-[15px] whitespace-pre-line">
              {displayContent}
            </div>
          )}

          <div className="mt-12 pt-6 border-t border-teal-border/60 flex items-center justify-between">
            <Link
              href={backHref}
              className="text-sm text-white/50 hover:text-white/80 transition-colors"
            >
              &larr; Back to articles
            </Link>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80 transition-colors"
            >
              Read original
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </article>
      </div>
    </main>
  );
}

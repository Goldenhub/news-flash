import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticle } from '@/lib/db';
import TTSControls from '@/components/TTSControls';
import AISummary from '@/components/AISummary';

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
    <main className="min-h-dvh bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-8 transition-colors dark:hover:text-neutral-300"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>

        <article>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 bg-neutral-200/70 text-neutral-700 text-[11px] font-semibold rounded-lg dark:bg-neutral-700/70 dark:text-neutral-300">
                {article.source}
              </span>
              <span className="text-xs text-neutral-400 dark:text-neutral-500">
                {new Date(article.published_at).toLocaleDateString('en-US', {
                  weekday: 'short', year: 'numeric', month: 'long', day: 'numeric',
                })}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 leading-tight tracking-tight dark:text-neutral-100">
              {article.title}
            </h1>
          </div>

          {article.image_url && (
            <div className="mb-10 rounded-2xl overflow-hidden">
              <img src={article.image_url} alt="" className="w-full h-auto max-h-96 object-cover" />
            </div>
          )}

          <div className="mb-10 p-4 rounded-2xl bg-white border border-neutral-200/60 dark:bg-neutral-800/60 dark:border-neutral-700/40">
            <TTSControls text={`${article.title}. ${displayContent}`} />
          </div>

          <AISummary articleId={id} />

          {displayHtml ? (
            <div
              className="prose prose-neutral max-w-none dark:prose-invert text-[15px] leading-relaxed [&_p]:mb-4 [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:font-semibold [&_h2]:text-lg [&_blockquote]:border-l-4 [&_blockquote]:border-neutral-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-neutral-600 [&_blockquote]:dark:border-neutral-600 [&_blockquote]:dark:text-neutral-400 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1 [&_a]:text-blue-600 [&_a]:underline [&_a]:dark:text-blue-400"
              dangerouslySetInnerHTML={{ __html: displayHtml }}
            />
          ) : (
            <div className="text-neutral-700 leading-[1.75] text-[15px] whitespace-pre-line dark:text-neutral-300">
              {displayContent}
            </div>
          )}

          <div className="mt-12 pt-6 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between">
            <Link
              href={backHref}
              className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors dark:hover:text-neutral-300"
            >
              &larr; Back to articles
            </Link>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 transition-colors dark:hover:text-neutral-300"
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

import { NextRequest, NextResponse } from 'next/server';
import { fetchAllSources } from '@/lib/rss';
import { runCleanup } from '@/lib/cleanup';
import { upsertArticle, articleCount } from '@/lib/db';

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('key');
  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const start = Date.now();

  const { articles } = await fetchAllSources();
  let inserted = 0;
  for (const article of articles) {
    if (upsertArticle(article)) inserted++;
  }

  const { cleaned } = runCleanup();
  const total = articleCount();
  const elapsed = Date.now() - start;

  return NextResponse.json({
    ok: true,
    fetched: articles.length,
    inserted,
    cleaned,
    total_articles: total,
    elapsed_ms: elapsed,
  });
}

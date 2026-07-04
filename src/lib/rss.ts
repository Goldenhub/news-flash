import Parser from 'rss-parser';
import crypto from 'crypto';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import { SOURCES } from './sources';
import type { Article, Source } from './types';

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['media:thumbnail', 'mediaThumbnail'],
      'description',
      'content',
      'content:encoded',
    ],
  },
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*',
  },
  timeout: 10000,
});

function hashUrl(url: string): string {
  return crypto.createHash('md5').update(url).digest('hex');
}

type CustomItem = Parser.Item & {
  'content:encoded'?: string;
  description?: string;
  mediaContent?: { $: { url: string } };
  mediaThumbnail?: { $: { url: string } };
};

function extractImage(item: CustomItem): string {
  if (item.enclosure?.url && /\.(jpg|jpeg|png|gif|webp)$/i.test(item.enclosure.url)) {
    return item.enclosure.url;
  }
  const media = item.mediaContent?.$?.url || item.mediaThumbnail?.$?.url;
  if (media) return media;
  const content = item['content:encoded'] || item.content || '';
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch) return imgMatch[1];
  const descMatch = item.description?.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (descMatch) return descMatch[1];
  return '';
}

function stripHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[^;]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchFullContent(url: string): Promise<{ text: string; html: string } | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
      },
    });
    clearTimeout(timeout);
    if (!response.ok) return null;
    const html = await response.text();
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const result = reader.parse();
    if (!result?.textContent || !result.content) return null;
    return {
      text: result.textContent.replace(/\s+/g, ' ').trim(),
      html: result.content,
    };
  } catch {
    return null;
  }
}

async function fetchSource(source: Source, maxArticles: number = 5): Promise<Article[]> {
  const articles: Article[] = [];

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const feed = await parser.parseURL(source.url);
    clearTimeout(timeout);

    const items = (feed.items as CustomItem[])?.slice(0, maxArticles) || [];

    for (const item of items) {
      const link = item.link || item.guid || '';
      if (!link) continue;

      const contentHtml = item['content:encoded'] || item.content || '';
      const description = item.description ? stripHtml(item.description.slice(0, 500)) : '';
      const rssContent = contentHtml ? stripHtml(contentHtml) : description;
      const pubDate = item.pubDate || item.isoDate || new Date().toISOString();
      const publishedAt = new Date(pubDate).toISOString();

      articles.push({
        id: hashUrl(link),
        title: item.title?.trim()?.slice(0, 500) || 'Untitled',
        description,
        content: rssContent,
        content_html: '',
        url: link,
        source: source.name,
        category: source.category,
        image_url: extractImage(item),
        published_at: publishedAt,
        fetched_at: '',
      });
    }
  } catch (err) {
    console.error(`[rss] Failed to fetch ${source.name}:`, err instanceof Error ? err.message : err);
  }

  return articles;
}

async function enrichArticles(articles: Article[]): Promise<Article[]> {
  const enriched: Article[] = [];
  const concurrency = 3;
  for (let i = 0; i < articles.length; i += concurrency) {
    const batch = articles.slice(i, i + concurrency);
    const results = await Promise.allSettled(
      batch.map(async (article) => {
        const hasGoodContent = article.content.length > 400;
        if (hasGoodContent) return article;
        const full = await fetchFullContent(article.url);
        if (full && full.text.length > article.content.length) {
          return { ...article, content: full.text, content_html: full.html.replace(/<img\s/g, '<img onerror="this.style.display=\'none\'" ') };
        }
        return article;
      })
    );
    results.forEach((r, idx) => {
      enriched.push(r.status === 'fulfilled' ? r.value : batch[idx]);
    });
  }
  return enriched;
}

const CATEGORY_ARTICLES_LIMIT = 10;

export async function fetchAllSources(): Promise<{ articles: Article[]; fetched: number; errors: number }> {
  const results = await Promise.allSettled(SOURCES.map((s) => fetchSource(s, 5)));

  let allArticles: Article[] = [];
  let errors = 0;

  for (const result of results) {
    if (result.status === 'fulfilled') {
      allArticles.push(...result.value);
    } else {
      errors++;
    }
  }

  allArticles.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

  const deduped: Article[] = [];
  const seen = new Set<string>();
  for (const article of allArticles) {
    if (!seen.has(article.url)) {
      seen.add(article.url);
      deduped.push(article);
    }
  }

  const limited: Article[] = [];
  const categoryCounts: Record<string, number> = {};
  for (const article of deduped) {
    const cat = article.category;
    if ((categoryCounts[cat] || 0) < CATEGORY_ARTICLES_LIMIT) {
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      limited.push(article);
    }
  }

  const enriched = await enrichArticles(limited);

  return { articles: enriched, fetched: enriched.length, errors };
}

export { fetchSource, fetchFullContent };

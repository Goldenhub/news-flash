import type { Source, CategoryInfo } from './types';

export const SOURCES: Source[] = [
  { name: 'Punch Nigeria', url: 'https://punchng.com/topics/politics/feed', category: 'nigerian-politics' },
  { name: 'Vanguard', url: 'https://www.vanguardngr.com/category/politics/feed', category: 'nigerian-politics' },
  { name: 'Premium Times', url: 'https://www.premiumtimesng.com/category/news/feed', category: 'nigerian-politics' },
  { name: 'BBC News', url: 'https://feeds.bbci.co.uk/news/world/rss.xml', category: 'world' },
  { name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml', category: 'world' },
  { name: 'The Guardian', url: 'https://www.theguardian.com/world/rss', category: 'world' },
  { name: 'TechCrunch', url: 'https://techcrunch.com/feed/', category: 'tech' },
  { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', category: 'tech' },
  { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index', category: 'tech' },
];

export const CATEGORIES: CategoryInfo[] = [
  { slug: 'nigerian-politics', label: 'Nigerian Politics' },
  { slug: 'world', label: 'World News' },
  { slug: 'tech', label: 'Tech News' },
];

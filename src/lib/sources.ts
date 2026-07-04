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
  { name: 'Banking Dive', url: 'https://www.bankingdive.com/feeds/news/', category: 'investment-banking' },
  { name: 'Seeking Alpha', url: 'https://seekingalpha.com/feed.xml', category: 'investment-banking' },
  { name: 'NYT Business', url: 'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml', category: 'investment-banking' },
  { name: 'MarketWatch', url: 'https://feeds.content.dowjones.io/public/rss/mw_topstories', category: 'finance' },
  { name: 'Bloomberg', url: 'https://feeds.bloomberg.com/markets/news.rss', category: 'finance' },
  { name: 'Investing.com', url: 'https://www.investing.com/rss/news.rss', category: 'finance' },
  { name: 'BBC Sport', url: 'https://feeds.bbci.co.uk/sport/football/rss.xml', category: 'soccer' },
  { name: 'The Guardian Football', url: 'https://www.theguardian.com/football/rss', category: 'soccer' },
  { name: 'Sky Sports Football', url: 'https://www.skysports.com/rss/11095', category: 'soccer' },
];

export const CATEGORIES: CategoryInfo[] = [
  { slug: 'nigerian-politics', label: 'Nigerian Politics' },
  { slug: 'world', label: 'World News' },
  { slug: 'tech', label: 'Tech News' },
  { slug: 'investment-banking', label: 'Investment Banking' },
  { slug: 'finance', label: 'Finance' },
  { slug: 'soccer', label: 'Soccer' },
];

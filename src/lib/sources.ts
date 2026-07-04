import type { Source, CategoryInfo } from "./types";

export const SOURCES: Source[] = [
  { name: "Punch Nigeria", url: "https://punchng.com/topics/politics/feed", category: "nigerian-politics" },
  { name: "Vanguard", url: "https://www.vanguardngr.com/category/politics/feed/", category: "nigerian-politics" },
  { name: "BBC News", url: "https://feeds.bbci.co.uk/news/world/rss.xml", category: "world" },
  { name: "Al Jazeera", url: "https://www.aljazeera.com/xml/rss/all.xml", category: "world" },
  { name: "TechCrunch", url: "https://techcrunch.com/feed/", category: "tech" },
  { name: "The Verge", url: "https://www.theverge.com/rss/index.xml", category: "tech" },
  { name: "Yahoo Finance", url: "https://finance.yahoo.com/news/rssindex", category: "investment-banking" },
  { name: "NYT Business", url: "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml", category: "investment-banking" },
  { name: "MarketWatch", url: "https://feeds.content.dowjones.io/public/rss/mw_topstories", category: "finance" },
  { name: "Bloomberg", url: "https://feeds.bloomberg.com/markets/news.rss", category: "finance" },
  { name: "BBC Sport", url: "https://feeds.bbci.co.uk/sport/football/rss.xml", category: "soccer" },
  { name: "The Guardian Football", url: "https://www.theguardian.com/football/rss", category: "soccer" },
];

export const CATEGORIES: CategoryInfo[] = [
  { slug: "nigerian-politics", label: "Nigerian Politics" },
  { slug: "world", label: "World News" },
  { slug: "tech", label: "Tech News" },
  { slug: "investment-banking", label: "Investment Banking" },
  { slug: "finance", label: "Finance" },
  { slug: "soccer", label: "Soccer" },
];

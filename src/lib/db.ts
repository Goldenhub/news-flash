import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import type { Article, Category } from './types';

const DB_DIR = path.join(process.cwd(), '.data');
const DB_PATH = path.join(DB_DIR, 'news.db');

let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!_db) {
    fs.mkdirSync(DB_DIR, { recursive: true });
    _db = new Database(DB_PATH);
    _db.pragma('journal_mode = WAL');
    _db.pragma('synchronous = NORMAL');
    initSchema(_db);
  }
  return _db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id           TEXT PRIMARY KEY,
      title        TEXT NOT NULL,
      description  TEXT DEFAULT '',
      content      TEXT DEFAULT '',
      content_html TEXT DEFAULT '',
      url          TEXT NOT NULL UNIQUE,
      source       TEXT NOT NULL,
      category     TEXT NOT NULL,
      image_url    TEXT DEFAULT '',
      published_at TEXT NOT NULL,
      fetched_at   TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
    CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at DESC);
    CREATE INDEX IF NOT EXISTS idx_articles_fetched ON articles(fetched_at);
  `);
}

export function getArticles(category?: Category, page: number = 1, limit: number = 30): { articles: Article[]; total: number } {
  const db = getDb();
  const offset = (page - 1) * limit;

  let countQuery = 'SELECT COUNT(*) as total FROM articles';
  let query = 'SELECT * FROM articles';
  const params: unknown[] = [];

  if (category) {
    const clause = ' WHERE category = ?';
    countQuery += clause;
    query += clause;
    params.push(category);
  }

  query += ' ORDER BY published_at DESC LIMIT ? OFFSET ?';

  const total = (db.prepare(countQuery).get(...params) as { total: number }).total;
  const articles = db.prepare(query).all(...params, limit, offset) as Article[];

  return { articles, total };
}

export function getArticle(id: string): Article | undefined {
  const db = getDb();
  return db.prepare('SELECT * FROM articles WHERE id = ?').get(id) as Article | undefined;
}

export function upsertArticle(article: Omit<Article, 'fetched_at'>): boolean {
  const db = getDb();
  const result = db.prepare(`
    INSERT OR IGNORE INTO articles (id, title, description, content, content_html, url, source, category, image_url, published_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    article.id,
    article.title,
    article.description,
    article.content,
    article.content_html,
    article.url,
    article.source,
    article.category,
    article.image_url,
    article.published_at,
  );
  return result.changes > 0;
}

export function deleteOldArticles(): number {
  const db = getDb();
  const result = db.prepare("DELETE FROM articles WHERE fetched_at < datetime('now', '-7 days')").run();
  return result.changes;
}

export function articleCount(): number {
  const db = getDb();
  const row = db.prepare('SELECT COUNT(*) as count FROM articles').get() as { count: number };
  return row.count;
}

export function closeDb() {
  if (_db) {
    _db.close();
    _db = null;
  }
}

import { deleteOldArticles } from './db';

export function runCleanup(): { cleaned: number } {
  const cleaned = deleteOldArticles();
  return { cleaned };
}

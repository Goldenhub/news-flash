import { NextRequest, NextResponse } from 'next/server';
import { getArticles } from '@/lib/db';
import type { Category } from '@/lib/types';

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get('category') as Category | null;
  const page = Math.max(1, parseInt(request.nextUrl.searchParams.get('page') || '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(request.nextUrl.searchParams.get('limit') || '30', 10)));

  const validCategories: Category[] = ['nigerian-politics', 'world', 'tech'];
  const cat = category && validCategories.includes(category) ? category : undefined;

  const { articles, total } = getArticles(cat, page, limit);

  return NextResponse.json({
    articles,
    page,
    limit,
    total,
    hasMore: page * limit < total,
  });
}

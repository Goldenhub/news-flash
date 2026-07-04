export type Category = 'nigerian-politics' | 'world' | 'tech';

export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  content_html: string;
  url: string;
  source: string;
  category: Category;
  image_url: string;
  published_at: string;
  fetched_at: string;
}

export interface Source {
  name: string;
  url: string;
  category: Category;
}

export interface CategoryInfo {
  slug: Category;
  label: string;
}

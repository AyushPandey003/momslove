import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import { ArticleWithTags } from '@/app/lib/articles';

type SearchResult = {
  type: 'article' | 'tag' | 'category';
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  cover_image?: string;
  author_name?: string;
  published_at?: Date;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    
    if (!q || q.trim() === '') {
      return NextResponse.json({ results: [] });
    }

    const term = `%${q.toLowerCase()}%`;
    
    // Search articles
    const articles = await query<ArticleWithTags>(`
      SELECT id, title, slug, excerpt, cover_image, author_name, published_at, 'article' as type
      FROM articles
      WHERE 
        status = 'published' AND
        (
          LOWER(title) LIKE $1 OR
          LOWER(content) LIKE $1 OR
          LOWER(excerpt) LIKE $1
        )
      ORDER BY published_at DESC
      LIMIT 10
    `, [term]);
    
    // Search tags
    const tags = await query<SearchResult>(`
      SELECT id, name as title, slug, 'tag' as type
      FROM tags
      WHERE LOWER(name) LIKE $1
      LIMIT 5
    `, [term]);
    
    // Search categories
    const categories = await query<SearchResult>(`
      SELECT id, name as title, slug, 'category' as type
      FROM categories
      WHERE LOWER(name) LIKE $1
      LIMIT 5
    `, [term]);
    
    // Combine and format results
    const results = [
      ...articles.map(article => ({
        type: 'article',
        id: article.id,
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        cover_image: article.cover_image,
        author_name: article.author_name,
        published_at: article.published_at
      })),
      ...tags,
      ...categories
    ];
    
    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search failed:", error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
} 
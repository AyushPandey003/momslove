import { pool, query } from './db';
import { v4 as uuidv4 } from 'uuid';
import { notFound } from 'next/navigation';

export type Article = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string;
  user_id: string;
  author_name: string;
  created_at: Date;
  updated_at: Date;
  published_at: Date | null;
  status: 'draft' | 'published';
  reading_time: number | null;
  category_id: string | null;
};

export type ArticleWithTags = Article & {
  tags: { id: string; name: string }[];
  category?: { id: string; name: string; slug: string } | null;
};

export async function getRecentArticles(limit = 10): Promise<ArticleWithTags[]> {
  const articles = await query<Article>(`
    SELECT * FROM articles
    WHERE status = 'published'
    ORDER BY published_at DESC
    LIMIT $1
  `, [limit]);

  return await addTagsToArticles(articles);
}

export async function getArticleBySlug(slug: string): Promise<ArticleWithTags | null> {
  const articles = await query<Article>(`
    SELECT * FROM articles
    WHERE slug = $1
  `, [slug]);

  if (!articles.length) {
    return null;
  }

  const articlesWithTags = await addTagsToArticles(articles);
  return articlesWithTags[0];
}

export async function getArticlesByCategory(categorySlug: string, limit = 10): Promise<ArticleWithTags[]> {
  const articles = await query<Article>(`
    SELECT a.* 
    FROM articles a
    JOIN categories c ON a.category_id = c.id
    WHERE c.slug = $1 AND a.status = 'published'
    ORDER BY a.published_at DESC
    LIMIT $2
  `, [categorySlug, limit]);

  return await addTagsToArticles(articles);
}

export async function getArticlesByTag(tagSlug: string, limit = 10): Promise<ArticleWithTags[]> {
  const articles = await query<Article>(`
    SELECT a.*
    FROM articles a
    JOIN article_tags at ON a.id = at.article_id
    JOIN tags t ON at.tag_id = t.id
    WHERE t.slug = $1 AND a.status = 'published'
    ORDER BY a.published_at DESC
    LIMIT $2
  `, [tagSlug, limit]);

  return await addTagsToArticles(articles);
}

export async function createArticle(article: Omit<Article, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
  const id = uuidv4();
  const now = new Date();
  
  await query(`
    INSERT INTO articles (
      id, title, slug, content, excerpt, cover_image, 
      user_id, author_name, created_at, updated_at, 
      published_at, status, reading_time, category_id
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  `, [
    id, article.title, article.slug, article.content, article.excerpt, article.cover_image,
    article.user_id, article.author_name, now, now,
    article.published_at, article.status, article.reading_time, article.category_id
  ]);
  
  return id;
}

export async function updateArticle(id: string, article: Partial<Omit<Article, 'id' | 'created_at' | 'updated_at'>>): Promise<void> {
  // Build dynamic set clause for update
  const updates: string[] = [];
  const values: any[] = [];
  let counter = 1;
  
  // Add each field that needs to be updated
  for (const [key, value] of Object.entries(article)) {
    if (value !== undefined) {
      updates.push(`${key} = $${counter}`);
      values.push(value);
      counter++;
    }
  }
  
  // Add updated_at timestamp
  updates.push(`updated_at = $${counter}`);
  values.push(new Date());
  counter++;
  
  // Add id as the last parameter
  values.push(id);
  
  if (updates.length === 0) {
    return; // Nothing to update
  }
  
  const sql = `
    UPDATE articles
    SET ${updates.join(', ')}
    WHERE id = $${counter}
  `;
  
  await query(sql, values);
}

export async function deleteArticle(id: string): Promise<void> {
  await query(`DELETE FROM article_tags WHERE article_id = $1`, [id]);
  await query(`DELETE FROM articles WHERE id = $1`, [id]);
}

// Helper function to add tags to articles
async function addTagsToArticles(articles: Article[]): Promise<ArticleWithTags[]> {
  if (!articles.length) return [];
  
  // Get all the article IDs
  const articleIds = articles.map(article => article.id);
  
  // Get tags for all articles in one query
  const tags = await query<{ article_id: string, tag_id: string, name: string }>(`
    SELECT at.article_id, at.tag_id, t.name
    FROM article_tags at
    JOIN tags t ON at.tag_id = t.id
    WHERE at.article_id = ANY($1)
  `, [articleIds]);
  
  // Get categories for all articles in one query
  const categories = await query<{ id: string, name: string, slug: string, article_id: string }>(`
    SELECT c.id, c.name, c.slug, a.id as article_id
    FROM categories c
    JOIN articles a ON c.id = a.category_id
    WHERE a.id = ANY($1)
  `, [articleIds]);
  
  // Map categories by article ID for quick lookup
  const categoryMap = categories.reduce((map, category) => {
    map[category.article_id] = {
      id: category.id,
      name: category.name,
      slug: category.slug
    };
    return map;
  }, {} as Record<string, { id: string, name: string, slug: string }>);
  
  // Group tags by article ID
  const tagsByArticleId = tags.reduce((acc, tag) => {
    if (!acc[tag.article_id]) {
      acc[tag.article_id] = [];
    }
    acc[tag.article_id].push({ id: tag.tag_id, name: tag.name });
    return acc;
  }, {} as Record<string, { id: string, name: string }[]>);
  
  // Add tags and category to each article
  return articles.map(article => ({
    ...article,
    tags: tagsByArticleId[article.id] || [],
    category: categoryMap[article.id] || null
  }));
} 
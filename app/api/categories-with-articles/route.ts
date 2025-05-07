import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

// Define types
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  article_count: number;
}

interface ArticlePreview {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  reading_time: number | null;
}

// Function to get all categories
async function getAllCategories(): Promise<Category[]> {
  const categories = await query<Category>(`
    SELECT c.id, c.name, c.slug, c.description, c.image_url, 
    COUNT(a.id) FILTER (WHERE a.status = 'published') as article_count
    FROM categories c
    LEFT JOIN articles a ON c.id = a.category_id
    GROUP BY c.id
    ORDER BY c.name ASC
  `);
  
  console.log(`Found ${categories.length} total categories`);
  return categories;
}

// Function to get preview articles for each category
async function getCategoryArticles(categoryId: string): Promise<ArticlePreview[]> {
  const articles = await query<ArticlePreview>(`
    SELECT id, title, slug, excerpt, cover_image, reading_time
    FROM articles
    WHERE category_id = $1 AND status = 'published'
    ORDER BY published_at DESC
    LIMIT 10
  `, [categoryId]);
  
  console.log(`Found ${articles.length} articles for category ${categoryId}`);
  return articles;
}

export async function GET() {
  try {
    const categories = await getAllCategories();
    const defaultImage = '/images/hero-mother.avif';
    
    // Get articles for each category
    const categoriesWithArticles = await Promise.all(
      categories.map(async (category) => {
        const articles = await getCategoryArticles(category.id);
        
        return {
          title: category.name,
          id: category.id,
          slug: category.slug,
          description: category.description || '',
          article_count: category.article_count,
          items: articles.map(article => ({
            id: article.id,
            title: article.title,
            description: article.excerpt,
            imageUrl: article.cover_image || defaultImage,
            readingTime: article.reading_time ? `${article.reading_time} min read` : "5 min read",
            href: `/blog/${article.slug}`
          }))
        };
      })
    );
    
    // Log category information for debugging
    console.log(`Returning ${categoriesWithArticles.length} categories with their articles`);
    categoriesWithArticles.forEach(cat => {
      console.log(`Category: ${cat.title}, Articles: ${cat.items.length}`);
    });
    
    return NextResponse.json({ categories: categoriesWithArticles });
  } catch (error) {
    console.error('Failed to fetch categories with articles:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
} 
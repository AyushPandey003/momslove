import { query } from './db';
import { v4 as uuidv4 } from 'uuid';

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  created_at: Date;
};

export async function getAllCategories(): Promise<Category[]> {
  return await query<Category>(`
    SELECT * 
    FROM categories
    ORDER BY name ASC
  `);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await query<Category>(`
    SELECT * 
    FROM categories
    WHERE slug = $1
  `, [slug]);

  return categories.length > 0 ? categories[0] : null;
}

export async function createCategory(category: Omit<Category, 'id' | 'created_at'>): Promise<string> {
  const id = uuidv4();
  
  await query(`
    INSERT INTO categories (id, name, slug, description, image_url, created_at)
    VALUES ($1, $2, $3, $4, $5, $6)
  `, [
    id,
    category.name,
    category.slug,
    category.description,
    category.image_url,
    new Date()
  ]);
  
  return id;
}

export async function updateCategory(id: string, category: Partial<Omit<Category, 'id' | 'created_at'>>): Promise<void> {
  // Build dynamic set clause for update
  const updates: string[] = [];
  const values: (string | null)[] = [];
  let counter = 1;

  for (const [key, value] of Object.entries(category)) {
    if (value !== undefined) {
      updates.push(`${key} = $${counter}`);
      values.push(value);
      counter++;
    }
  }

  if (updates.length === 0) {
    return; // Nothing to update
  }

  // Add id as the last parameter
  values.push(id);

  const sql = `
    UPDATE categories
    SET ${updates.join(', ')}
    WHERE id = $${counter}
  `;

  await query(sql, values);
}

export async function deleteCategory(id: string): Promise<void> {
  // First update any articles to remove this category
  await query(`
    UPDATE articles 
    SET category_id = NULL 
    WHERE category_id = $1
  `, [id]);
  
  // Then delete the category
  await query(`
    DELETE FROM categories 
    WHERE id = $1
  `, [id]);
}

export async function getCategoryWithArticleCount(): Promise<(Category & { article_count: number })[]> {
  return await query<Category & { article_count: number }>(`
    SELECT c.*, COUNT(a.id) as article_count
    FROM categories c
    LEFT JOIN articles a ON c.id = a.category_id AND a.status = 'published'
    GROUP BY c.id
    ORDER BY c.name ASC
  `);
} 
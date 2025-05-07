import { query } from './db';
import { v4 as uuidv4 } from 'uuid';

export type Tag = {
  id: string;
  name: string;
  slug: string;
  created_at: Date;
};

export async function getAllTags(): Promise<Tag[]> {
  return await query<Tag>(`
    SELECT * 
    FROM tags
    ORDER BY name ASC
  `);
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  const tags = await query<Tag>(`
    SELECT * 
    FROM tags
    WHERE slug = $1
  `, [slug]);

  return tags.length > 0 ? tags[0] : null;
}

export async function createTag(tag: Omit<Tag, 'id' | 'created_at'>): Promise<string> {
  const id = uuidv4();
  
  await query(`
    INSERT INTO tags (id, name, slug, created_at)
    VALUES ($1, $2, $3, $4)
  `, [
    id,
    tag.name,
    tag.slug,
    new Date()
  ]);
  
  return id;
}

export async function updateTag(id: string, tag: Partial<Omit<Tag, 'id' | 'created_at'>>): Promise<void> {
  // Build dynamic set clause for update
  const updates: string[] = [];
  const values: string[] = [];
  let counter = 1;

  for (const [key, value] of Object.entries(tag)) {
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
    UPDATE tags
    SET ${updates.join(', ')}
    WHERE id = $${counter}
  `;

  await query(sql, values);
}

export async function deleteTag(id: string): Promise<void> {
  // First remove any article-tag connections
  await query(`
    DELETE FROM article_tags
    WHERE tag_id = $1
  `, [id]);
  
  // Then delete the tag
  await query(`
    DELETE FROM tags
    WHERE id = $1
  `, [id]);
}

export async function addTagsToArticle(articleId: string, tagIds: string[]): Promise<void> {
  if (!tagIds.length) return;
  
  // Build a values string for multiple insertions
  const values: string[] = [];
  const placeholders: string[] = [];
  let counter = 1;
  
  for (const tagId of tagIds) {
    values.push(articleId, tagId);
    placeholders.push(`($${counter}, $${counter + 1})`);
    counter += 2;
  }
  
  await query(`
    INSERT INTO article_tags (article_id, tag_id)
    VALUES ${placeholders.join(', ')}
    ON CONFLICT (article_id, tag_id) DO NOTHING
  `, values);
}

export async function removeTagsFromArticle(articleId: string, tagIds: string[]): Promise<void> {
  if (!tagIds.length) return;
  
  await query(`
    DELETE FROM article_tags
    WHERE article_id = $1 AND tag_id = ANY($2)
  `, [articleId, tagIds]);
}

export async function getTagsWithArticleCount(): Promise<(Tag & { article_count: number })[]> {
  return await query<Tag & { article_count: number }>(`
    SELECT t.*, COUNT(DISTINCT a.id) as article_count
    FROM tags t
    LEFT JOIN article_tags at ON t.id = at.tag_id
    LEFT JOIN articles a ON at.article_id = a.id AND a.status = 'published'
    GROUP BY t.id
    ORDER BY t.name ASC
  `);
} 
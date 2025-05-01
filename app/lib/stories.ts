'use server';

import { query } from './db';
import { v4 as uuidv4 } from 'uuid';

export type Story = {
  id: string;
  title: string;
  content: string;
  userId: string;
  user_name: string;
  user_email: string | null;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: Date;
  approved_at: Date | null;
  rejected_at: Date | null;
  rejection_reason: string | null;
};

export async function getStories(status?: 'pending' | 'approved' | 'rejected'): Promise<Story[]> {
  let sql = `
    SELECT id, title, content, "userId", user_name, user_email, status, 
      submitted_at, approved_at, rejected_at, rejection_reason
    FROM stories
  `;
  const values: any[] = [];

  if (status) {
    sql += ` WHERE status = $1`;
    values.push(status);
  }

  sql += ` ORDER BY submitted_at DESC`;

  return await query<Story>(sql, values);
}

export async function getStoryById(id: string): Promise<Story | null> {
  const stories = await query<Story>(`
    SELECT id, title, content, "userId", user_name, user_email, status, 
      submitted_at, approved_at, rejected_at, rejection_reason
    FROM stories
    WHERE id = $1
  `, [id]);

  return stories.length > 0 ? stories[0] : null;
}

export async function getUserStories(userId: string): Promise<Story[]> {
  return await query<Story>(`
    SELECT id, title, content, "userId", user_name, user_email, status, 
      submitted_at, approved_at, rejected_at, rejection_reason
    FROM stories
    WHERE "userId" = $1
    ORDER BY submitted_at DESC
  `, [userId]);
}

export async function createStory(
  userId: string,
  userName: string,
  userEmail: string | null,
  title: string,
  content: string
): Promise<string> {
  const id = uuidv4();
  const now = new Date();
  
  await query(`
    INSERT INTO stories (
      id, title, content, "userId", user_name, user_email, 
      status, submitted_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `, [
    id,
    title,
    content,
    userId,
    userName,
    userEmail,
    'pending',
    now
  ]);
  
  return id;
}

export async function approveStory(id: string): Promise<void> {
  const now = new Date();
  
  await query(`
    UPDATE stories
    SET status = 'approved', approved_at = $1, rejected_at = NULL, rejection_reason = NULL
    WHERE id = $2
  `, [now, id]);
}

export async function rejectStory(id: string, reason: string): Promise<void> {
  const now = new Date();
  
  await query(`
    UPDATE stories
    SET status = 'rejected', rejected_at = $1, rejection_reason = $2, approved_at = NULL
    WHERE id = $3
  `, [now, reason, id]);
}

// Convert a story to a blog article
export async function convertStoryToArticle(
  storyId: string, 
  categoryId: string | null = null,
  status: 'draft' | 'published' = 'draft'
): Promise<string | null> {
  // Get the story
  const story = await getStoryById(storyId);
  if (!story) return null;
  
  // Generate slug from title
  const slug = story.title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '-');
    
  // Create excerpt from content (first 150 chars)
  const excerpt = story.content.substring(0, 150) + (story.content.length > 150 ? '...' : '');
  
  // Create article
  const articleId = uuidv4();
  const now = new Date();
  
  await query(`
    INSERT INTO articles (
      id, title, slug, content, excerpt, cover_image, 
      user_id, author_name, created_at, updated_at, 
      published_at, status, category_id
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
  `, [
    articleId,
    story.title,
    slug,
    story.content,
    excerpt,
    '/images/default-cover.jpg', // Default cover image
    story.userId,
    story.user_name,
    now,
    now,
    status === 'published' ? now : null,
    status,
    categoryId
  ]);
  
  return articleId;
} 
import { query } from './db';
import { v4 as uuidv4 } from 'uuid';

export type Comment = {
  id: string;
  article_id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: Date;
  updated_at: Date;
  status: 'published' | 'hidden';
};

export async function getCommentsByArticleId(articleId: string): Promise<Comment[]> {
  return await query<Comment>(`
    SELECT *
    FROM comments
    WHERE article_id = $1 AND status = 'published'
    ORDER BY created_at DESC
  `, [articleId]);
}

export async function getCommentById(id: string): Promise<Comment | null> {
  const comments = await query<Comment>(`
    SELECT *
    FROM comments
    WHERE id = $1
  `, [id]);

  return comments.length > 0 ? comments[0] : null;
}

export async function createComment(
  articleId: string,
  userId: string,
  userName: string,
  content: string
): Promise<string> {
  const id = uuidv4();
  const now = new Date();
  
  await query(`
    INSERT INTO comments (
      id, article_id, user_id, user_name, content, 
      created_at, updated_at, status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `, [
    id,
    articleId,
    userId,
    userName,
    content,
    now,
    now,
    'published'
  ]);
  
  return id;
}

export async function updateComment(id: string, content: string): Promise<void> {
  const now = new Date();
  
  await query(`
    UPDATE comments
    SET content = $1, updated_at = $2
    WHERE id = $3
  `, [content, now, id]);
}

export async function deleteComment(id: string): Promise<void> {
  await query(`
    DELETE FROM comments
    WHERE id = $1
  `, [id]);
}

export async function hideComment(id: string): Promise<void> {
  await query(`
    UPDATE comments
    SET status = 'hidden'
    WHERE id = $1
  `, [id]);
}

export async function publishComment(id: string): Promise<void> {
  await query(`
    UPDATE comments
    SET status = 'published'
    WHERE id = $1
  `, [id]);
}

export async function getUserComments(userId: string): Promise<Comment[]> {
  return await query<Comment>(`
    SELECT *
    FROM comments
    WHERE user_id = $1
    ORDER BY created_at DESC
  `, [userId]);
} 
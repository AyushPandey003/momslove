// Server actions for the app
'use server'

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { createStory } from './stories';
import { createComment, updateComment, deleteComment } from './comments';
import { updateUserPreferences, createUserPreferences } from './preferences';
import { revalidatePath } from 'next/cache';
import { UserPreferences } from './preferences';
import { migrateAllData } from './migration';

// Story submission action
export async function submitStory(formData: FormData): Promise<{ success: boolean; message: string }> {
  const session = await auth();
  
  if (!session?.user) {
    return { success: false, message: 'You must be logged in to submit a story' };
  }
  
  try {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    
    if (!title || title.trim() === '') {
      return { success: false, message: 'Title is required' };
    }
    
    if (!content || content.trim() === '') {
      return { success: false, message: 'Content is required' };
    }
    
    await createStory(
      session.user.id,
      session.user.name || 'Anonymous',
      session.user.email || null,
      title,
      content
    );
    
    revalidatePath('/approved-stories');
    return { success: true, message: 'Story submitted successfully!' };
  } catch (error) {
    console.error('Error submitting story:', error);
    return { success: false, message: 'Failed to submit story. Please try again.' };
  }
}

// Comment submission action
export async function submitComment(formData: FormData): Promise<{ success: boolean; message: string }> {
  const session = await auth();
  
  if (!session?.user) {
    return { success: false, message: 'You must be logged in to comment' };
  }
  
  try {
    const articleId = formData.get('articleId') as string;
    const content = formData.get('content') as string;
    
    if (!articleId) {
      return { success: false, message: 'Article ID is required' };
    }
    
    if (!content || content.trim() === '') {
      return { success: false, message: 'Comment content is required' };
    }
    
    await createComment(
      articleId,
      session.user.id,
      session.user.name || 'Anonymous',
      content
    );
    
    revalidatePath(`/blog/${formData.get('slug')}`);
    return { success: true, message: 'Comment posted successfully!' };
  } catch (error) {
    console.error('Error posting comment:', error);
    return { success: false, message: 'Failed to post comment. Please try again.' };
  }
}

// Comment edit action
export async function editComment(formData: FormData): Promise<{ success: boolean; message: string }> {
  const session = await auth();
  
  if (!session?.user) {
    return { success: false, message: 'You must be logged in to edit a comment' };
  }
  
  try {
    const commentId = formData.get('commentId') as string;
    const content = formData.get('content') as string;
    
    if (!commentId) {
      return { success: false, message: 'Comment ID is required' };
    }
    
    if (!content || content.trim() === '') {
      return { success: false, message: 'Comment content is required' };
    }
    
    await updateComment(commentId, content);
    
    revalidatePath(`/blog/${formData.get('slug')}`);
    return { success: true, message: 'Comment updated successfully!' };
  } catch (error) {
    console.error('Error updating comment:', error);
    return { success: false, message: 'Failed to update comment. Please try again.' };
  }
}

// Comment delete action
export async function removeComment(formData: FormData): Promise<{ success: boolean; message: string }> {
  const session = await auth();
  
  if (!session?.user) {
    return { success: false, message: 'You must be logged in to delete a comment' };
  }
  
  try {
    const commentId = formData.get('commentId') as string;
    
    if (!commentId) {
      return { success: false, message: 'Comment ID is required' };
    }
    
    await deleteComment(commentId);
    
    revalidatePath(`/blog/${formData.get('slug')}`);
    return { success: true, message: 'Comment deleted successfully!' };
  } catch (error) {
    console.error('Error deleting comment:', error);
    return { success: false, message: 'Failed to delete comment. Please try again.' };
  }
}

// User preferences update action
export async function updatePreferences(formData: FormData): Promise<{ success: boolean; message: string }> {
  const session = await auth();
  
  if (!session?.user) {
    return { success: false, message: 'You must be logged in to update preferences' };
  }
  
  try {
    const emailNotifications = formData.get('emailNotifications') === 'on';
    const theme = formData.get('theme') as 'light' | 'dark' | 'system';
    const digestFrequency = formData.get('digestFrequency') as 'daily' | 'weekly' | 'monthly' | 'none';
    
    const preferences: Partial<Omit<UserPreferences, 'user_id' | 'created_at' | 'updated_at'>> = {
      email_notifications: emailNotifications,
      theme,
      digest_frequency: digestFrequency
    };
    
    await updateUserPreferences(session.user.id, preferences);
    
    revalidatePath('/preferences');
    return { success: true, message: 'Preferences updated successfully!' };
  } catch (error) {
    console.error('Error updating preferences:', error);
    return { success: false, message: 'Failed to update preferences. Please try again.' };
  }
}

// Initialize user preferences when they first sign up
export async function initializeUserPreferences(): Promise<void> {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/');
  }
  
  await createUserPreferences(session.user.id);
}

// Admin action to migrate data
export async function runDataMigration(): Promise<{ success: boolean; message: string }> {
  const session = await auth();
  
  if (!session?.user || !session.user.admin) {
    return { success: false, message: 'You must be an admin to perform this action' };
  }
  
  try {
    await migrateAllData(session.user.id);
    
    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath('/category2');
    
    return { success: true, message: 'Data migration completed successfully!' };
  } catch (error) {
    console.error('Error migrating data:', error);
    return { success: false, message: 'Failed to migrate data. Please try again.' };
  }
} 
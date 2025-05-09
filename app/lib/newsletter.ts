import { query } from './db';

export type NewsletterSubscriber = {
  id: string;
  email: string;
  name?: string;
  status: 'active' | 'unsubscribed';
  source?: string;
  created_at: Date;
  updated_at: Date;
  last_email_sent?: Date;
};

/**
 * Subscribe a user to the newsletter
 */
export async function subscribeToNewsletter(
  email: string,
  name?: string,
  source?: string
): Promise<NewsletterSubscriber | null> {
  try {
    const now = new Date();
    
    const result = await query<NewsletterSubscriber>(`
      INSERT INTO newsletter_subscribers (
        email, name, source, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) 
      DO UPDATE SET 
        status = 'active', 
        name = COALESCE($2, newsletter_subscribers.name),
        updated_at = $5
      RETURNING *
    `, [
      email,
      name || null,
      source || null,
      now,
      now
    ]);
    
    return result[0] || null;
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return null;
  }
}

/**
 * Unsubscribe a user from the newsletter
 */
export async function unsubscribeFromNewsletter(email: string, id: string): Promise<boolean> {
  try {
    const now = new Date();
    
    const result = await query<{ id: string }>(`
      UPDATE newsletter_subscribers
      SET status = 'unsubscribed', updated_at = $3
      WHERE email = $1 AND id = $2
      RETURNING id
    `, [email, id, now]);
    
    return result.length > 0;
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    return false;
  }
}

/**
 * Get all active newsletter subscribers
 */
export async function getActiveSubscribers(): Promise<NewsletterSubscriber[]> {
  try {
    const result = await query<NewsletterSubscriber>(`
      SELECT * FROM newsletter_subscribers
      WHERE status = 'active'
      ORDER BY created_at DESC
    `);
    
    return result;
  } catch (error) {
    console.error('Error getting active subscribers:', error);
    return [];
  }
}

/**
 * Update the last_email_sent timestamp for a subscriber
 */
export async function updateLastEmailSent(id: string): Promise<boolean> {
  try {
    const now = new Date();
    
    const result = await query<{ id: string }>(`
      UPDATE newsletter_subscribers
      SET last_email_sent = $2, updated_at = $2
      WHERE id = $1
      RETURNING id
    `, [id, now]);
    
    return result.length > 0;
  } catch (error) {
    console.error('Error updating last email sent:', error);
    return false;
  }
}

/**
 * Check if an email is already subscribed
 */
export async function isEmailSubscribed(email: string): Promise<boolean> {
  try {
    const result = await query<{ id: string }>(`
      SELECT id FROM newsletter_subscribers
      WHERE email = $1 AND status = 'active'
    `, [email]);
    
    return result.length > 0;
  } catch (error) {
    console.error('Error checking if email is subscribed:', error);
    return false;
  }
} 
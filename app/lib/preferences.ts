import { query } from './db';

export type UserPreferences = {
  user_id: string;
  email_notifications: boolean;
  theme: 'light' | 'dark' | 'system';
  digest_frequency: 'daily' | 'weekly' | 'monthly' | 'none';
  created_at: Date;
  updated_at: Date;
};

export async function getUserPreferences(userId: string): Promise<UserPreferences | null> {
  const prefs = await query<UserPreferences>(`
    SELECT * 
    FROM user_preferences
    WHERE user_id = $1
  `, [userId]);

  return prefs.length > 0 ? prefs[0] : null;
}

export async function createUserPreferences(
  userId: string,
  preferences: Partial<Omit<UserPreferences, 'user_id' | 'created_at' | 'updated_at'>> = {}
): Promise<void> {
  const now = new Date();
  
  // Set defaults if not provided
  const emailNotifications = preferences.email_notifications ?? true;
  const theme = preferences.theme ?? 'light';
  const digestFrequency = preferences.digest_frequency ?? 'weekly';
  
  await query(`
    INSERT INTO user_preferences (
      user_id, email_notifications, theme, digest_frequency, 
      created_at, updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (user_id) DO NOTHING
  `, [
    userId,
    emailNotifications,
    theme,
    digestFrequency,
    now,
    now
  ]);
}

export async function updateUserPreferences(
  userId: string, 
  preferences: Partial<Omit<UserPreferences, 'user_id' | 'created_at' | 'updated_at'>>
): Promise<void> {
  // Check if preferences exist, create if they don't
  const existingPrefs = await getUserPreferences(userId);
  if (!existingPrefs) {
    await createUserPreferences(userId, preferences);
    return;
  }
  
  // Build dynamic set clause for update
  const updates: string[] = [];
  const values: any[] = [];
  let counter = 1;
  
  for (const [key, value] of Object.entries(preferences)) {
    if (value !== undefined) {
      updates.push(`${key} = $${counter}`);
      values.push(value);
      counter++;
    }
  }
  
  if (updates.length === 0) {
    return; // Nothing to update
  }
  
  // Add updated_at timestamp
  updates.push(`updated_at = $${counter}`);
  values.push(new Date());
  counter++;
  
  // Add user_id as the last parameter
  values.push(userId);
  
  const sql = `
    UPDATE user_preferences
    SET ${updates.join(', ')}
    WHERE user_id = $${counter}
  `;
  
  await query(sql, values);
} 
import { query } from './db';

export type Profile = {
  id: string;
  user_id: number;
  bio: string | null;
  location: string | null;
  website: string | null;
  twitter: string | null;
  instagram: string | null;
  facebook: string | null;
  profile_image: string | null;
  gallery_images: string[] | null;
  phone_number: string | null;
  display_email: boolean;
  created_at: Date;
  updated_at: Date;
};

export type ProfileFormData = {
  bio: string | null;
  location: string | null;
  website: string | null;
  twitter: string | null;
  instagram: string | null;
  facebook: string | null;
  phone_number: string | null;
  display_email: boolean;
};

/**
 * Get a user's profile
 */
export async function getUserProfile(userId: number): Promise<Profile | null> {
  try {
    const profiles = await query<Profile>(
      `SELECT * FROM profiles WHERE user_id = $1`,
      [userId]
    );
    
    return profiles.length > 0 ? profiles[0] : null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

/**
 * Create or update a user's profile
 */
export async function upsertUserProfile(
  userId: number, 
  profileData: ProfileFormData
): Promise<Profile | null> {
  try {
    // Check if profile exists
    const existingProfile = await getUserProfile(userId);
    
    if (existingProfile) {
      // Update existing profile
      const updated = await query<Profile>(
        `UPDATE profiles
         SET bio = $1, location = $2, website = $3, twitter = $4, instagram = $5, 
             facebook = $6, phone_number = $7, display_email = $8, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $9
         RETURNING *`,
        [
          profileData.bio,
          profileData.location,
          profileData.website,
          profileData.twitter,
          profileData.instagram,
          profileData.facebook,
          profileData.phone_number,
          profileData.display_email,
          userId
        ]
      );
      
      return updated.length > 0 ? updated[0] : null;
    } else {
      // Create new profile
      const created = await query<Profile>(
        `INSERT INTO profiles
         (user_id, bio, location, website, twitter, instagram, facebook, phone_number, display_email)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [
          userId,
          profileData.bio,
          profileData.location,
          profileData.website,
          profileData.twitter,
          profileData.instagram,
          profileData.facebook,
          profileData.phone_number,
          profileData.display_email
        ]
      );
      
      return created.length > 0 ? created[0] : null;
    }
  } catch (error) {
    console.error('Error upserting user profile:', error);
    return null;
  }
}

/**
 * Update a user's profile image
 */
export async function updateProfileImage(
  userId: number,
  imageUrl: string
): Promise<boolean> {
  try {
    // Check if profile exists
    const existingProfile = await getUserProfile(userId);
    
    if (existingProfile) {
      // Update existing profile
      await query(
        `UPDATE profiles
         SET profile_image = $1, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $2`,
        [imageUrl, userId]
      );
    } else {
      // Create new profile with just the image
      await query(
        `INSERT INTO profiles
         (user_id, profile_image)
         VALUES ($1, $2)`,
        [userId, imageUrl]
      );
    }
    
    return true;
  } catch (error) {
    console.error('Error updating profile image:', error);
    return false;
  }
}

/**
 * Update a user's gallery images
 */
export async function updateGalleryImages(
  userId: number,
  imageUrls: string[]
): Promise<boolean> {
  try {
    // Check if profile exists
    const existingProfile = await getUserProfile(userId);
    
    if (existingProfile) {
      // Update existing profile
      await query(
        `UPDATE profiles
         SET gallery_images = $1, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $2`,
        [imageUrls, userId]
      );
    } else {
      // Create new profile with just the gallery images
      await query(
        `INSERT INTO profiles
         (user_id, gallery_images)
         VALUES ($1, $2)`,
        [userId, imageUrls]
      );
    }
    
    return true;
  } catch (error) {
    console.error('Error updating gallery images:', error);
    return false;
  }
} 
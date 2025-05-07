import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile, upsertUserProfile, ProfileFormData } from '@/app/lib/profiles';
import { auth } from '@/auth';

// GET /api/profile - Get the authenticated user's profile
export async function GET() {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = parseInt(session.user.id);
    const profile = await getUserProfile(userId);
    
    if (!profile) {
      return NextResponse.json(
        { message: 'Profile not found, but you can create one' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// POST /api/profile - Create or update the authenticated user's profile
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = parseInt(session.user.id);
    const data = await request.json();
    
    // Validate data
    const profileData: ProfileFormData = {
      bio: data.bio || null,
      location: data.location || null,
      website: data.website || null,
      twitter: data.twitter || null,
      instagram: data.instagram || null,
      facebook: data.facebook || null,
      phone_number: data.phone_number || null,
      display_email: data.display_email || false
    };
    
    const profile = await upsertUserProfile(userId, profileData);
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ profile, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
} 
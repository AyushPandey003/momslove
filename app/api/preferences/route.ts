import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { 
  getUserPreferences,
  updateUserPreferences,
  createUserPreferences
} from '@/app/lib/preferences';

// GET handler to fetch user preferences
export async function GET(request: Request) {
  const session = await auth();

  // Check if user is authenticated
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get user preferences
    const preferences = await getUserPreferences(session.user.id);
    
    // If preferences don't exist, create default preferences
    if (!preferences) {
      await createUserPreferences(session.user.id);
      const newPreferences = await getUserPreferences(session.user.id);
      return NextResponse.json({ preferences: newPreferences });
    }
    
    return NextResponse.json({ preferences });
  } catch (error) {
    console.error("Failed to fetch user preferences:", error);
    return NextResponse.json({ error: 'Failed to fetch user preferences' }, { status: 500 });
  }
}

// PUT handler to update user preferences
export async function PUT(request: Request) {
  const session = await auth();

  // Check if user is authenticated
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { email_notifications, theme, digest_frequency } = await request.json();

    // Prepare update data
    const updateData: any = {};
    if (email_notifications !== undefined) updateData.email_notifications = email_notifications;
    if (theme !== undefined) updateData.theme = theme;
    if (digest_frequency !== undefined) updateData.digest_frequency = digest_frequency;

    // Update user preferences
    await updateUserPreferences(session.user.id, updateData);

    // Get updated preferences
    const updatedPreferences = await getUserPreferences(session.user.id);

    return NextResponse.json({ 
      message: 'Preferences updated successfully',
      preferences: updatedPreferences
    });
  } catch (error) {
    console.error('Preferences update failed:', error);
    return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
  }
} 
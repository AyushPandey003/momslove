import { NextRequest, NextResponse } from 'next/server';
import { updateProfileImage } from '@/app/lib/profiles';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = parseInt(session.user.id);
    const data = await request.json();
    const imageUrl = data.imageUrl;
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'No image URL provided' }, { status: 400 });
    }
    
    // Update profile with new image URL from UploadThing
    const success = await updateProfileImage(userId, imageUrl);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update profile image' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: 'Profile image updated successfully',
      imageUrl: imageUrl
    });
  } catch (error) {
    console.error('Error updating profile image:', error);
    return NextResponse.json(
      { error: 'Failed to update profile image' },
      { status: 500 }
    );
  }
} 
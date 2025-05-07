import { NextRequest, NextResponse } from 'next/server';
import { updateGalleryImages, getUserProfile } from '@/app/lib/profiles';
import { auth } from '@/auth';

// GET - Get gallery images for the authenticated user's profile
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
        { gallery_images: [] },
        { status: 200 }
      );
    }
    
    return NextResponse.json({ gallery_images: profile.gallery_images || [] });
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery images' },
      { status: 500 }
    );
  }
}

// POST - Update gallery images for the authenticated user's profile
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = parseInt(session.user.id);
    const data = await request.json();
    
    // Validate data
    if (!data.imageUrls || !Array.isArray(data.imageUrls)) {
      return NextResponse.json(
        { error: 'Invalid data format. Expected array of image URLs' },
        { status: 400 }
      );
    }
    
    // Update gallery images
    const success = await updateGalleryImages(userId, data.imageUrls);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update gallery images' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Gallery images updated successfully',
      gallery_images: data.imageUrls
    });
  } catch (error) {
    console.error('Error updating gallery images:', error);
    return NextResponse.json(
      { error: 'Failed to update gallery images' },
      { status: 500 }
    );
  }
} 
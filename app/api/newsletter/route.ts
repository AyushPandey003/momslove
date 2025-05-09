import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { subscribeToNewsletter, unsubscribeFromNewsletter, isEmailSubscribed } from '@/app/lib/newsletter';

// Schema for subscribe request
const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
  source: z.string().optional(),
});

// Schema for unsubscribe request
const unsubscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  id: z.string().min(1, 'Subscriber ID is required'),
});

/**
 * POST handler for subscribing to newsletter
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const result = subscribeSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: result.error.format() },
        { status: 400 }
      );
    }
    
    const { email, name, source } = result.data;
    
    // Check if email is already subscribed
    const isSubscribed = await isEmailSubscribed(email);
    
    // Subscribe the user
    const subscriber = await subscribeToNewsletter(email, name, source);
    
    if (!subscriber) {
      return NextResponse.json(
        { error: 'Failed to subscribe' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: isSubscribed ? 'Email already subscribed' : 'Successfully subscribed to newsletter',
      subscriber,
    });
  } catch (error) {
    console.error('Error in newsletter subscription:', error);
    return NextResponse.json(
      { error: 'An error occurred during subscription' },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler for unsubscribing from newsletter
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const result = unsubscribeSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: result.error.format() },
        { status: 400 }
      );
    }
    
    const { email, id } = result.data;
    
    // Unsubscribe the user
    const success = await unsubscribeFromNewsletter(email, id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to unsubscribe or subscriber not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Successfully unsubscribed from newsletter',
    });
  } catch (error) {
    console.error('Error in newsletter unsubscription:', error);
    return NextResponse.json(
      { error: 'An error occurred during unsubscription' },
      { status: 500 }
    );
  }
}

/**
 * Check subscription status
 */
export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }
    
    const isSubscribed = await isEmailSubscribed(email);
    
    return NextResponse.json({
      email,
      isSubscribed,
    });
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return NextResponse.json(
      { error: 'An error occurred while checking subscription status' },
      { status: 500 }
    );
  }
} 
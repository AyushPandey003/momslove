import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendEmail, createWelcomeTemplate } from '@/app/lib/gmail';
import { subscribeToNewsletter, isEmailSubscribed } from '@/app/lib/newsletter';

// Schema for welcome request
const welcomeSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
  source: z.string().optional(),
});

/**
 * POST handler for subscribing and sending welcome email
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const result = welcomeSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: result.error.format() },
        { status: 400 }
      );
    }
    
    const { email, name, source } = result.data;
    
    // Check if already subscribed
    const wasAlreadySubscribed = await isEmailSubscribed(email);
    
    // Subscribe the user first
    const subscriber = await subscribeToNewsletter(email, name, source);
    
    if (!subscriber) {
      return NextResponse.json(
        { error: 'Failed to subscribe' },
        { status: 500 }
      );
    }
    
    // Only send welcome email if this is a new subscription
    if (!wasAlreadySubscribed) {
      // Generate unsubscribe URL
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
      const unsubscribeUrl = `${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}&id=${subscriber.id}`;
      
      // Create welcome email content
      const welcomeEmail = createWelcomeTemplate(name || '', unsubscribeUrl);
      
      // Send welcome email
      const emailSent = await sendEmail({
        to: email,
        subject: 'Welcome to MomsLove Newsletter!',
        html: welcomeEmail
      });
      
      if (!emailSent) {
        // Still return success but with a warning that email failed
        return NextResponse.json({
          message: 'Subscription successful but welcome email failed to send',
          subscriber,
          emailSent: false
        });
      }
    }
    
    return NextResponse.json({
      message: wasAlreadySubscribed 
        ? 'Email already subscribed' 
        : 'Successfully subscribed and sent welcome email',
      subscriber,
      emailSent: !wasAlreadySubscribed
    });
  } catch (error) {
    console.error('Error in newsletter subscription and welcome:', error);
    return NextResponse.json(
      { error: 'An error occurred during subscription process' },
      { status: 500 }
    );
  }
} 
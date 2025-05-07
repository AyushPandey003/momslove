import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendEmail, createNewsletterTemplate } from '@/app/lib/gmail';
import { getActiveSubscribers, updateLastEmailSent } from '@/app/lib/newsletter';

// Schema for newsletter request
const newsletterSchema = z.object({
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  testMode: z.boolean().optional(),
  testEmail: z.string().email('Invalid test email').optional(),
});

/**
 * POST handler for sending newsletter to all subscribers
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const result = newsletterSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: result.error.format() },
        { status: 400 }
      );
    }
    
    const { subject, content, testMode, testEmail } = result.data;
    
    // Generate base URL for unsubscribe links
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    
    // In test mode, send only to the test email
    if (testMode && testEmail) {
      const unsubscribeUrl = `${baseUrl}/unsubscribe?email=${encodeURIComponent(testEmail)}`;
      const emailContent = createNewsletterTemplate('Test User', content, unsubscribeUrl);
      
      const emailSent = await sendEmail({
        to: testEmail,
        subject,
        html: emailContent
      });
      
      return NextResponse.json({
        message: emailSent ? 'Test email sent successfully' : 'Failed to send test email',
        testMode: true,
        success: emailSent
      });
    }
    
    // Get all active subscribers
    const subscribers = await getActiveSubscribers();
    
    if (subscribers.length === 0) {
      return NextResponse.json({
        message: 'No active subscribers found',
        success: false
      });
    }
    
    // Send to all subscribers
    const results = [];
    let successCount = 0;
    let failCount = 0;
    
    for (const subscriber of subscribers) {
      const unsubscribeUrl = `${baseUrl}/unsubscribe?email=${encodeURIComponent(subscriber.email)}`;
      const emailContent = createNewsletterTemplate(subscriber.name || '', content, unsubscribeUrl);
      
      try {
        const emailSent = await sendEmail({
          to: subscriber.email,
          subject,
          html: emailContent
        });
        
        if (emailSent) {
          // Update last email sent timestamp
          await updateLastEmailSent(subscriber.id);
          successCount++;
        } else {
          failCount++;
        }
        
        results.push({
          email: subscriber.email,
          success: emailSent
        });
      } catch (error) {
        console.error(`Error sending to ${subscriber.email}:`, error);
        failCount++;
        results.push({
          email: subscriber.email,
          success: false,
          error: 'Failed to send'
        });
      }
    }
    
    return NextResponse.json({
      message: `Newsletter sent to ${successCount} subscribers (${failCount} failed)`,
      totalSubscribers: subscribers.length,
      successCount,
      failCount,
      results: results.slice(0, 10) // Only return the first 10 results to keep response size reasonable
    });
  } catch (error) {
    console.error('Error sending newsletter:', error);
    return NextResponse.json(
      { error: 'An error occurred while sending the newsletter' },
      { status: 500 }
    );
  }
} 
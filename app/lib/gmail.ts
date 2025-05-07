import { google } from 'googleapis';

// Define the type for Gmail client configuration
interface GmailConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  refreshToken: string;
}

// Define the type for email data
export interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

// Create a Gmail API client using OAuth2
function getGmailClient(config: GmailConfig) {
  const oauth2Client = new google.auth.OAuth2(
    config.clientId,
    config.clientSecret,
    config.redirectUri
  );

  oauth2Client.setCredentials({
    refresh_token: config.refreshToken
  });

  return google.gmail({ version: 'v1', auth: oauth2Client });
}

// Create a base64 encoded email
function createEmail(emailData: EmailData): string {
  const from = emailData.from || process.env.EMAIL_FROM || 'noreply@momslove.com';
  const str = [
    `From: ${from}`,
    `To: ${emailData.to}`,
    `Subject: ${emailData.subject}`,
    'Content-Type: text/html; charset=utf-8',
    '',
    emailData.html
  ].join('\r\n');

  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Send an email using Gmail API
export async function sendEmail(emailData: EmailData): Promise<boolean> {
  try {
    // Get config from environment variables
    const config: GmailConfig = {
      clientId: process.env.GMAIL_CLIENT_ID || '',
      clientSecret: process.env.GMAIL_CLIENT_SECRET || '',
      redirectUri: process.env.GMAIL_REDIRECT_URI || 'https://developers.google.com/oauthplayground',
      refreshToken: process.env.GMAIL_REFRESH_TOKEN || ''
    };

    // Create Gmail client
    const gmail = getGmailClient(config);
    
    // Create raw email
    const raw = createEmail(emailData);
    
    // Send the email
    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw
      }
    });

    console.log('Email sent successfully:', res.data.id);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// Newsletter template
export function createNewsletterTemplate(
  subscriberName: string,
  content: string,
  unsubscribeUrl: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>MomsLove Newsletter</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .header img {
          max-width: 150px;
        }
        .greeting {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .content {
          margin-bottom: 30px;
        }
        .footer {
          font-size: 12px;
          color: #666;
          border-top: 1px solid #eee;
          padding-top: 20px;
          text-align: center;
        }
        .unsubscribe {
          display: block;
          margin-top: 10px;
          color: #999;
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>MomsLove</h1>
      </div>
      
      <div class="greeting">
        Hello ${subscriberName || 'there'},
      </div>
      
      <div class="content">
        ${content}
      </div>
      
      <div class="footer">
        <p>© ${new Date().getFullYear()} MomsLove. All rights reserved.</p>
        <p>Thank you for being part of our community!</p>
        <a href="${unsubscribeUrl}" class="unsubscribe">Unsubscribe from future emails</a>
      </div>
    </body>
    </html>
  `;
}

// Welcome template for new subscribers
export function createWelcomeTemplate(
  subscriberName: string,
  unsubscribeUrl: string
): string {
  const content = `
    <p>Welcome to the MomsLove community!</p>
    <p>Thank you for subscribing to our newsletter. We're excited to share stories, insights, and updates with you about motherhood and parenting.</p>
    <p>You'll receive updates about:</p>
    <ul>
      <li>New articles and stories</li>
      <li>Community highlights</li>
      <li>Tips and resources for mothers</li>
      <li>Special announcements</li>
    </ul>
    <p>Feel free to visit our website anytime to explore more content.</p>
    <p>Warm regards,<br>The MomsLove Team</p>
  `;
  
  return createNewsletterTemplate(subscriberName, content, unsubscribeUrl);
} 
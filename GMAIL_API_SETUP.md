# Gmail API Setup Instructions

This document provides instructions for setting up the Gmail API credentials required for the newsletter functionality in MomsLove.

## Required Environment Variables

Add the following variables to your `.env.local` file:

```
# Gmail API Configuration
GMAIL_CLIENT_ID=your-google-client-id
GMAIL_CLIENT_SECRET=your-google-client-secret
GMAIL_REFRESH_TOKEN=your-google-refresh-token
GMAIL_REDIRECT_URI=https://developers.google.com/oauthplayground
EMAIL_FROM=your-email@gmail.com

# App URL for links in emails
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Steps to Obtain Gmail API Credentials

1. **Create a Google Cloud Project**:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Navigate to "APIs & Services" > "Library"
   - Search for "Gmail API" and enable it for your project

2. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" and select "OAuth client ID"
   - Select "Web application" as the application type
   - Add a name for your client
   - Add authorized redirect URIs:
     - Add `https://developers.google.com/oauthplayground` as a redirect URI
   - Click "Create" and note your Client ID and Client Secret

3. **Generate Refresh Token**:
   - Go to [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
   - Click the settings icon (⚙️) in the top right
   - Check "Use your own OAuth credentials"
   - Enter your OAuth Client ID and Client Secret
   - Close the settings
   - Select "Gmail API v1" from the list and select the scope: `https://mail.google.com/`
   - Click "Authorize APIs" and log in with the Gmail account you want to use for sending emails
   - Click "Exchange authorization code for tokens"
   - Copy the refresh token that appears

4. **Add Credentials to Environment Variables**:
   - Update your `.env.local` file with the obtained credentials
   - Set `EMAIL_FROM` to the Gmail address you used to authorize the API
   - Set `NEXT_PUBLIC_APP_URL` to your application's URL (or localhost for development)

## Important Security Notes

- Never commit your `.env.local` file to version control
- Restrict access to the Gmail API in the Google Cloud Console to only what's needed
- Consider using a service account for production environments
- If your refresh token expires, you'll need to generate a new one

## Testing the Setup

After configuring the environment variables, you can test the setup by:

1. Going to the admin newsletter page at `/admin/newsletter`
2. Creating a test newsletter
3. Sending a test email to yourself before sending to all subscribers 
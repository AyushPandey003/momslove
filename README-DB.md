# MomsLove Database Setup Guide

This guide will help you set up the database for the MomsLove application.

## Prerequisites

1. Make sure you have a PostgreSQL database set up. The application uses NeonDB, but you can use any PostgreSQL-compatible database.
2. Ensure your `.env` file contains a valid `DATABASE_URL` environment variable.
3. **Important**: Ensure the NextAuth.js tables (`users`, `accounts`, `sessions`, `verification_tokens`) already exist in your database. You can typically set these up by running your Next.js application once with authentication enabled.
4. Ensure an admin user exists in the `users` table (e.g., with email `admin@momslove.com`). The initialization script will need this user's ID for data migration.

## Database Schema

The application uses the following database tables:

1. **Users** - Managed by NextAuth.js (Assumed to exist)
2. **Accounts** - Managed by NextAuth.js (Assumed to exist)
3. **Sessions** - Managed by NextAuth.js (Assumed to exist)
4. **Verification Tokens** - Managed by NextAuth.js (Assumed to exist)
5. **Articles** - Blog posts/articles
6. **Categories** - Article categories
7. **Tags** - Article tags
8. **Article Tags** - Junction table for article-tag relationships
9. **Stories** - User-submitted stories that can be converted to articles
10. **User Preferences** - User settings and preferences
11. **Comments** - User comments on articles

## Setting Up Application Tables and Data

This script focuses on creating the *application-specific* tables and migrating seed data. It assumes the NextAuth tables and an admin user are already present.

1. Install the project dependencies (if you haven't already):
   ```
   npm install
   ```

2. Run the database initialization script:
   ```
   npm run init-db
   ```

This script will:
- Create the application-specific tables (`articles`, `categories`, `tags`, `stories`, `comments`, `user_preferences`, `article_tags`) IF THEY DON'T EXIST.
- Find the existing admin user (expected email: `admin@momslove.com`).
- Migrate seed data from hardcoded content, associating it with the found admin user.

**Note:** If the admin user is not found, the script will exit with an error.

## Data Migration (Alternative)

If you only need to run the data migration (e.g., after manually creating tables), you can use the admin interface:

1. Log in as an admin user.
2. Navigate to `/admin/migration`.
3. Click "Run Migration" to populate the database with seed data.

## Troubleshooting

If you encounter issues with the database setup:

1. **Connection Errors**: Ensure your `DATABASE_URL` is correct in the `.env` file.
2. **"users table not found"**: Verify that you have run the Next.js app at least once to allow NextAuth to create its tables, or create them manually.
3. **"Admin user not found"**: Ensure a user with the email `admin@momslove.com` exists in your `users` table.
4. **Table Creation Failures**: Check if your database user has sufficient privileges.
5. **Migration Errors**: Review the console logs for specific error messages during the `npm run init-db` process.

## Database Schema Reference

For more detailed information about the database schema, refer to:
- `app/lib/schema.sql` - Full schema definition (includes NextAuth tables)
- `app/lib/migration.ts` - Data migration logic 
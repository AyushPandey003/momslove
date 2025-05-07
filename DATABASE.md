# MomsLove Database Setup Guide

This guide explains how to set up and seed the database for the MomsLove blog application.

## Prerequisites

1. Make sure you have a Neon PostgreSQL database set up (or another PostgreSQL database)
2. Create a `.env` file in the root directory with your database connection string:

```
DATABASE_URL=postgres://username:password@host:port/database
```

## Setting Up the Database

The application uses NextAuth.js for authentication and requires specific tables for user management.

### NextAuth.js Tables

Run the following SQL to create the required NextAuth.js tables:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  email_verified TIMESTAMPTZ,
  image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  password TEXT
);

CREATE TABLE accounts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(provider, provider_account_id)
);

CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  session_token TEXT NOT NULL UNIQUE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (identifier, token)
);
```

## Seeding the Database

We provide a script to automatically seed the database with the necessary tables and sample data:

1. First, make sure the NextAuth.js tables are created (see above)
2. Run the seed script:

```bash
npm run seed-db
```

This script will:
1. Check for (and create if needed) an admin user
2. Create all the required application tables (articles, categories, tags, etc.)
3. Seed the database with sample articles, categories, and tags
4. Add sample comments to some articles

## Admin Account

The default admin account will be created with these credentials:
- Email: admin@momslove.com
- Password: password123

**IMPORTANT**: This is just for development. In production, you should:
1. Change this password immediately after setup
2. Use a strong password
3. Consider using OAuth providers instead (Google, GitHub, etc.)

## Manual Database Initialization

If you prefer to initialize the database without sample data, you can run:

```bash
npm run init-db
```

This will create only the required tables without adding sample data.

## Database Schema

The application uses the following tables:

- `users` - User accounts (managed by NextAuth.js)
- `articles` - Blog articles and posts
- `categories` - Article categories
- `tags` - Article tags
- `article_tags` - Junction table for article-tag relationships
- `stories` - User-submitted stories
- `comments` - Article comments

See `app/lib/schema.sql` for the complete database schema. 
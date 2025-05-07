import dotenv from 'dotenv';
import { pool, query } from '../app/lib/db';
import { migrateAllData } from '../app/lib/migration';
import crypto from 'crypto';

// Load environment variables
dotenv.config();

// Define user type
interface User {
  id: string | number;
  name: string;
  email: string;
}

// Define article type
interface Article {
  id: string;
}

// Generate a SHA-256 hash for password (NextAuth.js compatible)
// Note: In a real application, use bcrypt or a proper password hashing library
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function checkAdmin(): Promise<string> {
  try {
    console.log('Checking for admin user...');
    const adminEmail = 'admin@momslove.com';
    
    // Check if admin user exists
    const adminExists = await query<User>(`
      SELECT id FROM users WHERE email = $1
    `, [adminEmail]);

    if (adminExists.length === 0) {
      console.log(`Admin user with email ${adminEmail} not found.`);
      console.log(`Creating admin user...`);
      
      // Create admin user if it doesn't exist
      const hashedPassword = hashPassword('password123'); // CHANGE THIS IN PRODUCTION!
      
      const result = await query<User>(`
        INSERT INTO users (name, email, email_verified, image, created_at, updated_at, password)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `, [
        'Admin User', 
        adminEmail, 
        new Date(), 
        'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
        new Date(),
        new Date(),
        hashedPassword
      ]);
      
      console.log('Admin user created successfully!');
      return String(result[0].id);
    } else {
      console.log('Admin user found.');
      return String(adminExists[0].id);
    }
  } catch (error) {
    console.error('Error checking/creating admin user:', error);
    
    // Check if the error is because the 'users' table doesn't exist
    if (error instanceof Error && error.message.includes('relation "users" does not exist')) {
      console.error("The 'users' table wasn't found. Please run the NextAuth.js setup first.");
      console.error("You can create it with the following SQL:");
      console.log(`
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
      `);
    }
    
    process.exit(1);
    return ''; // This line will never be reached but satisfies TypeScript
  }
}

async function createSchema() {
  try {
    console.log('Creating database schema...');
    
    // Create tables according to schema.sql
    // This is a simplified version; in production you might want to read from schema.sql
    await query(`
      -- Articles/Blog Posts Table
      CREATE TABLE IF NOT EXISTS articles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        content TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        cover_image TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        author_name TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        published_at TIMESTAMP WITH TIME ZONE,
        status TEXT NOT NULL DEFAULT 'draft', -- draft, published
        reading_time INTEGER,
        category_id UUID, -- Reference to categories table
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    await query(`
      -- Categories Table
      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL UNIQUE,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        image_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await query(`
      -- Tags Table
      CREATE TABLE IF NOT EXISTS tags (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL UNIQUE,
        slug TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await query(`
      -- Article Tags Junction Table (Many-to-Many)
      CREATE TABLE IF NOT EXISTS article_tags (
        article_id UUID NOT NULL,
        tag_id UUID NOT NULL,
        PRIMARY KEY (article_id, tag_id),
        FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
      );
    `);

    await query(`
      -- Stories Table
      CREATE TABLE IF NOT EXISTS stories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        "userId" INTEGER NOT NULL,
        "user_name" TEXT NOT NULL,
        "user_email" TEXT,
        status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
        "submitted_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "approved_at" TIMESTAMP WITH TIME ZONE,
        "rejected_at" TIMESTAMP WITH TIME ZONE,
        "rejection_reason" TEXT,
        FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    await query(`
      -- Comments Table
      CREATE TABLE IF NOT EXISTS comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        article_id UUID NOT NULL,
        user_id INTEGER NOT NULL,
        user_name TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'published', -- published, hidden
        FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    console.log('Schema created successfully!');
  } catch (error) {
    console.error('Error creating schema:', error);
    process.exit(1);
  }
}

async function seedSampleData(adminId: string) {
  try {
    console.log('Seeding sample data...');
    await migrateAllData(adminId);
    console.log('Sample data seeded successfully!');
  } catch (error) {
    console.error('Error seeding sample data:', error);
    process.exit(1);
  }
}

async function seedExtraData(adminId: string) {
  try {
    console.log('Seeding additional data...');
    
    // Add a few comments to the first few articles
    const articles = await query<Article>(`
      SELECT id FROM articles LIMIT 3
    `);
    
    for (const article of articles) {
      await query(`
        INSERT INTO comments (article_id, user_id, user_name, content)
        VALUES ($1, $2, $3, $4)
      `, [
        article.id,
        adminId,
        'Admin User',
        'This is a great article! Thanks for sharing these insights.'
      ]);

      await query(`
        INSERT INTO comments (article_id, user_id, user_name, content)
        VALUES ($1, $2, $3, $4)
      `, [
        article.id,
        adminId,
        'Admin User',
        'I love how you explained this topic. Very informative!'
      ]);
    }
    
    console.log('Additional data seeded successfully!');
  } catch (error) {
    console.error('Error seeding additional data:', error);
    process.exit(1);
  }
}

async function main() {
  try {
    console.log('Starting database seeding...');
    
    // 1. Check for/create admin user
    const adminId = await checkAdmin();
    
    // 2. Create schema
    await createSchema();
    
    // 3. Seed sample data from migration file
    await seedSampleData(adminId);
    
    // 4. Seed extra data (comments, etc)
    await seedExtraData(adminId);
    
    console.log('Database seeding completed successfully!');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Error during database seeding:', error);
    await pool.end();
    process.exit(1);
  }
}

// Run the seeding process
main(); 
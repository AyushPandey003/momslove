import { pool, query } from '../app/lib/db';
import fs from 'fs';
import path from 'path';
import { migrateAllData } from '../app/lib/migration';

// Type for the expected structure of the user row
type UserRow = {
  id: string;
};

async function createApplicationTables() {
  try {
    console.log('Reading schema SQL file...');
    const schemaPath = path.join(process.cwd(), 'app', 'lib', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Split schema into statements and filter out non-application table creations
    // This is a basic split, might need refinement based on exact SQL structure
    const statements = schemaSql.split(';').filter(s => s.trim() !== '');
    const appTableStatements = statements.filter(stmt =>
      !stmt.toLowerCase().includes('create table if not exists users') &&
      !stmt.toLowerCase().includes('create table if not exists accounts') &&
      !stmt.toLowerCase().includes('create table if not EXISTS sessions') &&
      !stmt.toLowerCase().includes('create table if not EXISTS verification_tokens')
    );

    console.log('Creating application database tables...');
    // Execute only application table creation statements
    for (const statement of appTableStatements) {
      if (statement.trim()) { // Ensure statement is not empty
        await query(statement.trim());
      }
    }

    console.log('Application tables created successfully (or already existed)!');
    return true;
  } catch (error) {
    console.error('Error creating application tables:', error instanceof Error ? error.message : String(error));
    return false;
  }
}

async function getAdminUserId(): Promise<string | null> {
  const adminEmail = 'admin@momslove.com'; // Assuming this is the admin email
  try {
    console.log(`Checking for admin user (${adminEmail})...`);
    // Check if admin user exists
    const adminExists = await query<UserRow>(`
      SELECT id FROM users WHERE email = $1
    `, [adminEmail]);

    if (adminExists.length === 0) {
      console.error(`Admin user with email ${adminEmail} not found.`);
      console.error('Please ensure the admin user exists in the users table before running this script.');
      return null;
    } else {
      console.log('Admin user found.');
      // Explicitly cast the row structure if needed, otherwise assume 'id' exists
      const adminId = adminExists[0].id;
      if (typeof adminId !== 'string') {
         console.error('Admin user ID is not in the expected format.');
         return null;
      }
      return adminId;
    }
  } catch (error) {
    console.error('Error checking/fetching admin user:', error instanceof Error ? error.message : String(error));
    // Check if the error is because the 'users' table doesn't exist
     if (error instanceof Error && error.message.includes('relation "users" does not exist')) {
       console.error("The 'users' table was not found. Please ensure NextAuth tables are set up correctly.");
     }
    return null;
  }
}

async function main() {
  try {
    console.log('Initializing application data...');

    // Get Admin User ID (assuming users table exists)
    const adminId = await getAdminUserId();
    if (!adminId) {
      console.error('Failed to get admin user ID. Exiting.');
      process.exit(1);
    }

    // Create application tables (articles, categories, etc.)
    const tablesResult = await createApplicationTables();
    if (!tablesResult) {
      console.error('Failed to create application tables. Exiting.');
      process.exit(1);
    }

    // Migrate seed data using the found admin ID
    console.log('Migrating seed data with admin user ID:', adminId);
    await migrateAllData(adminId);

    console.log('Application data initialization completed successfully!');

    // Close pool
    await pool.end();

  } catch (error) {
    console.error('Error initializing application data:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// Run the initialization
main(); 
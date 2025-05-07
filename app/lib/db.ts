import { Pool } from '@neondatabase/serverless';

// Ensure DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL environment variable");
}

// Create a singleton database connection pool
const globalPool = global as unknown as { pool: Pool | undefined };
export const pool = globalPool.pool ?? new Pool({ connectionString: process.env.DATABASE_URL });
if (process.env.NODE_ENV !== 'production') globalPool.pool = pool;

// Helper function to get a client from the pool
export async function getClient() {
  const client = await pool.connect();
  return client;
}

// Helper function to execute a query and release the client
export async function query<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  const client = await getClient();
  try {
    const result = await client.query(sql, params);
    return result.rows as T[];
  } finally {
    client.release();
  }
} 
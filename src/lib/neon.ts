import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const DATABASE_URL = process.env.NEON_DATABASE_URL || process.env.NETLIFY_DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('NEON_DATABASE_URL is not set');
}

const sql = neon(DATABASE_URL);
export const db = drizzle(sql);

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const DATABASE_URL = process.env.NEON_DATABASE_URL || process.env.NETLIFY_DATABASE_URL;

if (!DATABASE_URL) {
  console.error('환경변수 확인:', {
    NEON_DATABASE_URL: process.env.NEON_DATABASE_URL ? 'SET' : 'NOT SET',
    NETLIFY_DATABASE_URL: process.env.NETLIFY_DATABASE_URL ? 'SET' : 'NOT SET'
  });
  throw new Error('NEON_DATABASE_URL or NETLIFY_DATABASE_URL is not set');
}

console.log('데이터베이스 연결 중...', DATABASE_URL.substring(0, 50) + '...');

const sql = neon(DATABASE_URL);
export const db = drizzle(sql);

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

let db: ReturnType<typeof drizzle>;

try {
  const DATABASE_URL = process.env.NEON_DATABASE_URL || process.env.NETLIFY_DATABASE_URL;

  if (!DATABASE_URL) {
    console.error('환경변수 확인:', {
      NEON_DATABASE_URL: process.env.NEON_DATABASE_URL ? 'SET' : 'NOT SET',
      NETLIFY_DATABASE_URL: process.env.NETLIFY_DATABASE_URL ? 'SET' : 'NOT SET'
    });
    throw new Error('NEON_DATABASE_URL or NETLIFY_DATABASE_URL is not set');
  }

  console.log('데이터베이스 연결 중...', DATABASE_URL.substring(0, 30) + '...');

  const sql = neon(DATABASE_URL);
  db = drizzle(sql);
  
  console.log('데이터베이스 연결 성공');
} catch (error) {
  console.error('데이터베이스 연결 실패:', error);
  
  // 더미 커넥션 제공 (이 경우 실제 DB 작업은 실패하지만 앱이 크래시되지는 않음)
  const dummySql = () => Promise.resolve({ rows: [] });
  // @ts-ignore - 에러 방지용 더미 DB 객체
  db = {
    select: () => ({
      from: () => Promise.resolve([]),
      leftJoin: () => ({ where: () => Promise.resolve([]) })
    }),
    insert: () => ({ values: () => ({ returning: () => Promise.resolve([]) }) }),
    query: () => ({ where: () => Promise.resolve([]) }),
  };
}

export { db };

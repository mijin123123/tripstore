import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// 데이터베이스 연결 함수
export function connectToDatabase() {
  const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
  
  if (!databaseUrl) {
    throw new Error('DATABASE_URL 또는 NEON_DATABASE_URL 환경 변수가 설정되지 않았습니다.');
  }

  const client = postgres(databaseUrl);
  return drizzle(client, { schema });
}

// 데이터베이스 상태 확인 함수 (일반 PostgreSQL 클라이언트 사용)
export async function getDatabaseStatus() {
  try {
    const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
    
    if (!databaseUrl) {
      throw new Error('DATABASE_URL 또는 NEON_DATABASE_URL 환경 변수가 설정되지 않았습니다.');
    }
    
    const pool = new Pool({ connectionString: databaseUrl });
    const result = await pool.query('SELECT NOW() as current_time, version() as db_version');
    await pool.end();
    
    return {
      status: 'connected',
      timestamp: result.rows[0]?.current_time || new Date().toISOString(),
      database_version: result.rows[0]?.db_version,
      message: '데이터베이스에 성공적으로 연결되었습니다.'
    };
  } catch (error) {
    console.error('데이터베이스 연결 실패:', error);
    return {
      status: 'error',
      message: '데이터베이스 연결에 실패했습니다.',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

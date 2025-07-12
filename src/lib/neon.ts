import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { Pool } from '@neondatabase/serverless';
import * as schema from './schema';

// 데이터베이스 연결 함수
export function connectToDatabase() {
  if (!process.env.NEON_DATABASE_URL) {
    throw new Error('NEON_DATABASE_URL 환경 변수가 설정되지 않았습니다.');
  }

  const client = neon(process.env.NEON_DATABASE_URL);
  return drizzle(client, { schema });
}

// 데이터베이스 인스턴스 export (호환성을 위해)
export const db = connectToDatabase();

// 데이터베이스 상태 확인 함수
export async function getDatabaseStatus() {
  try {
    if (!process.env.NEON_DATABASE_URL) {
      throw new Error('NEON_DATABASE_URL 환경 변수가 설정되지 않았습니다.');
    }
    
    const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });
    const result = await pool.query('SELECT NOW()');
    
    return {
      status: 'connected',
      timestamp: result.rows[0]?.now || new Date().toISOString(),
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

// 호환성을 위한 별칭
export const checkConnection = getDatabaseStatus;
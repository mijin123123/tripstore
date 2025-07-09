import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { sql } from 'drizzle-orm';
import { config } from 'dotenv';

// .env 파일을 로드합니다.
config();

// DB 연결 문자열 가져오기
const DATABASE_URL = process.env.NEON_DATABASE_URL;

if (!DATABASE_URL) {
  console.error('NEON_DATABASE_URL 환경 변수가 설정되지 않았습니다.');
}

// 안전하게 데이터베이스 연결 및 Drizzle ORM 초기화
let db;

try {
  const sql_connection = DATABASE_URL ? neon(DATABASE_URL) : null;
  
  if (sql_connection) {
    db = drizzle(sql_connection);
    console.log('Neon DB 연결 및 Drizzle ORM 초기화 완료');
  } else {
    throw new Error('데이터베이스 연결 문자열이 없습니다.');
  }
} catch (error) {
  console.error('DB 초기화 오류:', error);
  
  // 더미 DB 객체 생성
  db = {
    select: () => ({
      from: () => Promise.resolve([]),
      where: () => Promise.resolve([])
    }),
    insert: () => ({
      values: () => ({
        returning: () => Promise.resolve([])
      })
    }),
    update: () => ({
      set: () => ({
        where: () => Promise.resolve([])
      })
    }),
    delete: () => ({
      where: () => Promise.resolve([])
    }),
    execute: (query) => Promise.resolve([])
  };
  
  console.warn('더미 DB 객체를 사용합니다. 실제 DB 작업은 실패할 수 있습니다.');
}

// DB 연결 상태 확인 유틸리티 함수
export async function checkConnection() {
  try {
    const result = await db.execute(sql`SELECT NOW()`);
    return { connected: true, timestamp: result[0]?.now };
  } catch (error) {
    console.error('데이터베이스 연결 오류:', error);
    return { connected: false, error };
  }
}

export { db };

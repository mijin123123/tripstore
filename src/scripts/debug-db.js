// 데이터베이스 연결 디버그 스크립트
import { config } from 'dotenv';
config();

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import pg from 'pg';

const DATABASE_URL = process.env.NEON_DATABASE_URL || 
                    'postgresql://neondb_owner:npg_lu3rwg6HpLGn@ep-noisy-meadow-aex8wbzi-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';

console.log('===== DB 연결 디버그 =====');
console.log('1. 환경변수 상태:', { 
  NEON_URL_SET: !!process.env.NEON_DATABASE_URL, 
  URL_PREVIEW: DATABASE_URL.substring(0, 20) + '...' 
});

async function debugConnection() {
  try {
    // 1. Neon Serverless 방식
    console.log('2. Neon Serverless 클라이언트 초기화 중...');
    try {
      const sql = neon(DATABASE_URL);
      const db = drizzle(sql);
      console.log('3. Neon 클라이언트 초기화 성공!');
    } catch (neonErr) {
      console.error('Neon 클라이언트 초기화 오류:', neonErr?.message);
    }

    // 2. pg 클라이언트 방식
    console.log('\n4. pg 클라이언트로 시도...');
    const { Pool } = pg;
    const pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });

    try {
      const client = await pool.connect();
      console.log('5. pg 클라이언트 연결 성공!');
      
      const result = await client.query('SELECT COUNT(*) FROM packages');
      console.log(`6. 패키지 개수: ${result.rows[0].count}`);
      
      if (parseInt(result.rows[0].count) > 0) {
        const pkgsResult = await client.query('SELECT id, title FROM packages LIMIT 5');
        console.log('7. 첫 5개 패키지:');
        pkgsResult.rows.forEach(pkg => console.log(`- ${pkg.id}: ${pkg.title}`));
      }
      
      client.release();
      await pool.end();
    } catch (pgErr) {
      console.error('pg 클라이언트 오류:', pgErr?.message);
    }
  } catch (err) {
    console.error('오류 발생:', err);
    console.error('오류 상세:', err?.message);
    if (err?.stack) console.error('스택 트레이스:', err.stack.split('\n').slice(0, 3).join('\n'));
  }
}

debugConnection();

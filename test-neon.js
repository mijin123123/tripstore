import { Pool } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testNeonConnection() {
  const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });
  
  try {
    console.log('네온DB 연결 테스트 시작...');
    console.log('연결 URL:', process.env.NEON_DATABASE_URL?.substring(0, 50) + '...');
    
    // 단순한 쿼리로 연결 테스트
    const result = await pool.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('✅ 네온DB 연결 성공!');
    console.log('현재 시간:', result.rows[0].current_time);
    console.log('PostgreSQL 버전:', result.rows[0].pg_version);
    
    // 현재 테이블 목록 확인
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('현재 테이블 목록:', tables.rows.map(row => row.table_name));
    
    return true;
  } catch (error) {
    console.error('❌ 네온DB 연결 실패:', error);
    return false;
  } finally {
    await pool.end();
  }
}

testNeonConnection();

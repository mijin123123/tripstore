const { Pool } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function testDBConnection() {
  console.log('🔍 데이터베이스 연결 테스트 시작...');
  
  try {
    if (!process.env.NEON_DATABASE_URL) {
      console.error('❌ NEON_DATABASE_URL 환경 변수가 없습니다.');
      return;
    }
    
    console.log('✅ NEON_DATABASE_URL 존재:', process.env.NEON_DATABASE_URL.substring(0, 30) + '...');
    
    const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });
    
    console.log('🔗 데이터베이스 연결 시도...');
    const result = await pool.query('SELECT version(), now() as current_time');
    console.log('✅ 연결 성공!');
    console.log('PostgreSQL 버전:', result.rows[0].version);
    console.log('현재 시간:', result.rows[0].current_time);
    
    console.log('📋 기존 테이블 확인...');
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('기존 테이블:', tables.rows.map(row => row.table_name));
    
    console.log('✅ 테스트 완료');
    
  } catch (error) {
    console.error('❌ 데이터베이스 연결 실패:', error.message);
    console.error('전체 에러:', error);
  }
}

testDBConnection();

// 매우 간단한 DB 연결 테스트 스크립트
require('dotenv').config();
const { Pool } = require('pg');

// 직접 콘솔에 환경 변수 출력 (비밀번호는 일부만 표시)
const dbUrl = process.env.NEON_DATABASE_URL;
let maskedUrl = '';
if (dbUrl) {
  // URL에서 비밀번호 부분 마스킹
  maskedUrl = dbUrl.replace(/(postgresql:\/\/[^:]+:)([^@]+)(@.+)/, '$1****$3');
  console.log('DB URL:', maskedUrl);
} else {
  console.log('DB URL이 설정되지 않았습니다.');
  process.exit(1);
}

// 간단한 연결 테스트
async function testConnection() {
  console.log('DB 연결 테스트 시작...');
  
  const pool = new Pool({
    connectionString: dbUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    console.log('연결 시도 중...');
    const client = await pool.connect();
    console.log('✅ 연결 성공!');
    
    // 간단한 쿼리 실행
    const result = await client.query('SELECT NOW()');
    console.log('현재 DB 시간:', result.rows[0].now);
    
    client.release();
  } catch (err) {
    console.error('❌ 연결 실패:', err.message);
  } finally {
    await pool.end();
    console.log('테스트 완료');
  }
}

testConnection();

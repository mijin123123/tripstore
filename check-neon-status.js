require('dotenv').config();
const { Pool } = require('pg');

console.log('NEON_DATABASE_URL:', process.env.NEON_DATABASE_URL ? '설정됨' : '설정되지 않음');

const connectionString = process.env.NEON_DATABASE_URL;
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
  // 연결 유지 설정
  keepAlive: true,
  idleTimeoutMillis: 30000
});

async function checkConnection() {
  console.log('Neon DB 연결 확인 중...');
  try {
    const client = await pool.connect();
    console.log('연결 성공!');
    
    // DB 정보 확인
    const dbResult = await client.query('SELECT current_database(), current_user, version();');
    console.log('데이터베이스 정보:', dbResult.rows[0]);
    
    // 테이블 목록 확인
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    console.log('테이블 목록:');
    tablesResult.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });
    
    // packages 테이블 데이터 확인
    try {
      const packagesResult = await client.query('SELECT COUNT(*) as count FROM packages;');
      console.log(`packages 테이블 데이터 수: ${packagesResult.rows[0].count}`);
      
      if (parseInt(packagesResult.rows[0].count) > 0) {
        const sampleData = await client.query('SELECT id, title FROM packages LIMIT 5;');
        console.log('샘플 패키지 데이터:');
        sampleData.rows.forEach(row => {
          console.log(`- ${row.id}: ${row.title}`);
        });
      }
    } catch (err) {
      console.error('packages 테이블 조회 실패:', err.message);
    }
    
    client.release();
    
    console.log('연결 풀 종료 중...');
    await pool.end();
    console.log('연결 풀 종료 완료.');
    
  } catch (err) {
    console.error('DB 연결 오류:', err);
    try {
      await pool.end();
    } catch (e) {
      console.error('연결 풀 종료 오류:', e);
    }
  }
}

checkConnection();

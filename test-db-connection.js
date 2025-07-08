// DB 연결 디버그 스크립트
import { config } from 'dotenv';
config();

import { Pool } from 'pg';

async function testDatabaseConnection() {
  console.log('=========================================');
  console.log('Neon DB 연결 테스트');
  console.log('=========================================');
  
  try {
    const DATABASE_URL = process.env.NEON_DATABASE_URL;
    
    if (!DATABASE_URL) {
      console.error('오류: NEON_DATABASE_URL 환경 변수가 설정되지 않았습니다.');
      return;
    }
    
    console.log('DB URL 확인됨. 연결 중...');
    
    const pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    // 연결 테스트
    console.log('연결 테스트 중...');
    const client = await pool.connect();
    console.log('✅ 연결 성공!');
    
    // 패키지 테이블 확인
    console.log('\n패키지 테이블 데이터 확인 중...');
    const packagesResult = await client.query(`SELECT * FROM packages;`);
    
    console.log(`패키지 수: ${packagesResult.rows.length}`);
    console.log('패키지 목록:');
    packagesResult.rows.forEach((pkg, index) => {
      console.log(`${index + 1}. ID: ${pkg.id}, 제목: ${pkg.title}, 가격: ${pkg.price}`);
    });
    
    // 테이블 목록 확인
    console.log('\n테이블 목록 확인:');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `);
    
    console.log('존재하는 테이블:');
    tablesResult.rows.forEach((table, index) => {
      console.log(`${index + 1}. ${table.table_name}`);
    });
    
    client.release();
    await pool.end();
    console.log('\nDB 연결 테스트 완료');
    
  } catch (error) {
    console.error('오류 발생:', error);
    console.error('스택 트레이스:', error.stack);
  }
}

testDatabaseConnection().catch(console.error);

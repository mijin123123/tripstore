// 패키지 데이터베이스 상태 확인 스크립트 (CommonJS 버전)
require('dotenv').config();
const { Pool } = require('pg');

async function checkPackagesInDB() {
  console.log('=========================================');
  console.log('패키지 데이터베이스 상태 확인 스크립트');
  console.log('=========================================');
  
  try {
    // 직접 쿼리로 확인
    console.log('\n직접 SQL 쿼리로 패키지 조회 중...');
    const pool = new Pool({
      connectionString: process.env.NEON_DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    // DB 연결 확인
    console.log('데이터베이스 연결 테스트 중...');
    const client = await pool.connect();
    console.log('데이터베이스 연결 성공!');
    client.release();
    
    // 패키지 테이블 존재 여부 확인
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'packages'
      );
    `);
    
    const packagesTableExists = tableCheck.rows[0].exists;
    console.log(`packages 테이블 존재 여부: ${packagesTableExists ? '존재함' : '존재하지 않음'}`);
    
    if (packagesTableExists) {
      // 패키지 수 확인
      const countResult = await pool.query('SELECT COUNT(*) FROM packages');
      console.log(`직접 쿼리 결과: ${countResult.rows[0].count}개의 패키지 발견`);
      
      // 패키지 데이터 샘플 확인
      const samplesResult = await pool.query('SELECT * FROM packages LIMIT 3');
      console.log('\n패키지 샘플 (최대 3개):');
      samplesResult.rows.forEach((pkg, index) => {
        console.log(`\n[${index + 1}번 패키지]`);
        console.log(`- ID: ${pkg.id}`);
        console.log(`- 제목: ${pkg.title}`);
        console.log(`- 가격: ${pkg.price}`);
        console.log(`- 목적지: ${pkg.destination}`);
        console.log(`- 생성일: ${pkg.created_at}`);
      });
    }
    
    await pool.end();
    console.log('\n패키지 데이터베이스 확인 완료');
    
  } catch (error) {
    console.error('오류 발생:', error);
    console.error('오류 세부 정보:', error.message);
    
    // Neon DB SUSPENDED 상태 감지
    if (error.message.includes('ECONNREFUSED') || 
        error.message.includes('Connection terminated') ||
        error.message.includes('timeout')) {
      console.log('\n[중요] Neon DB가 SUSPENDED 상태일 가능성이 높습니다.');
      console.log('Neon 콘솔(https://console.neon.tech)에 접속하여 브랜치를 활성화해주세요:');
      console.log('1. 프로젝트로 이동');
      console.log('2. 브랜치 탭 클릭');
      console.log('3. SUSPENDED 상태의 브랜치에서 "Resume" 또는 "활성화" 버튼 클릭');
    }
  }
}

checkPackagesInDB().catch(err => {
  console.error('스크립트 실행 중 오류 발생:', err);
});

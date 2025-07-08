// 파일에 로그를 저장하는 DB 테스트 스크립트
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { Pool } = require('pg');

// 로그 파일 설정
const logFile = path.join(__dirname, 'db-test-log.txt');

// 로그 기록 함수
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  
  console.log(message);
  fs.appendFileSync(logFile, logMessage);
}

// 시작 로그
log('DB 연결 테스트 시작');
log('-------------------------------------');

// 환경 변수 확인
const dbUrl = process.env.NEON_DATABASE_URL;
if (dbUrl) {
  // URL에서 비밀번호 부분 마스킹
  const maskedUrl = dbUrl.replace(/(postgresql:\/\/[^:]+:)([^@]+)(@.+)/, '$1****$3');
  log(`환경 변수 NEON_DATABASE_URL: ${maskedUrl}`);
} else {
  log('오류: NEON_DATABASE_URL이 설정되지 않았습니다.');
  process.exit(1);
}

// DB 연결 테스트
async function testConnection() {
  log('DB 연결 초기화 중...');
  
  try {
    const pool = new Pool({
      connectionString: dbUrl,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    log('DB 연결 풀 생성됨. 연결 시도 중...');
    
    const client = await pool.connect();
    log('✅ DB 연결 성공!');
    
    // 버전 확인
    const versionResult = await client.query('SELECT version()');
    log(`PostgreSQL 버전: ${versionResult.rows[0].version}`);
    
    // 패키지 테이블 확인
    try {
      log('패키지 테이블 확인 중...');
      const packagesResult = await client.query('SELECT COUNT(*) FROM packages');
      log(`패키지 수: ${packagesResult.rows[0].count}`);
      
      if (parseInt(packagesResult.rows[0].count) > 0) {
        // 샘플 데이터 확인
        const sampleResult = await client.query('SELECT * FROM packages LIMIT 2');
        log(`첫 번째 패키지: ID=${sampleResult.rows[0].id}, 제목=${sampleResult.rows[0].title}`);
      } else {
        log('패키지 테이블이 비어 있습니다.');
      }
    } catch (tableError) {
      log(`패키지 테이블 오류: ${tableError.message}`);
    }
    
    client.release();
    log('클라이언트 연결 해제됨');
  } catch (err) {
    log(`❌ DB 연결 실패: ${err.message}`);
    log(`오류 상세: ${JSON.stringify(err)}`);
  } finally {
    log('테스트 완료');
  }
}

// 테스트 실행
testConnection().then(() => {
  log('스크립트 실행 완료. 로그 파일 위치: ' + logFile);
}).catch(err => {
  log(`예기치 않은 오류: ${err.message}`);
});

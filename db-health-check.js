// 데이터베이스 연결 건강 체크 스크립트
require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// 로그 기록용 함수
function logWithTimestamp(message) {
  const now = new Date();
  const timestamp = now.toISOString();
  return `[${timestamp}] ${message}`;
}

// 로그 파일에 기록
function writeToLog(message) {
  const logMessage = logWithTimestamp(message);
  console.log(logMessage);
  
  const logFile = path.join(__dirname, 'db-health-check.log');
  fs.appendFileSync(logFile, logMessage + '\n');
}

async function checkDbHealth() {
  writeToLog('데이터베이스 건강 체크 시작...');
  
  try {
    // DB 연결 설정
    const pool = new Pool({
      connectionString: process.env.NEON_DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    // 연결 시도
    const client = await pool.connect();
    writeToLog('DB 연결 성공');
    
    // 간단한 쿼리 실행
    const result = await client.query('SELECT NOW() as time');
    writeToLog(`DB 서버 시간: ${result.rows[0].time}`);
    
    // packages 테이블 상태 확인
    try {
      const pkgCount = await client.query('SELECT COUNT(*) FROM packages');
      writeToLog(`패키지 수: ${pkgCount.rows[0].count}`);
    } catch (err) {
      writeToLog(`패키지 테이블 쿼리 실패: ${err.message}`);
    }
    
    // 연결 종료
    client.release();
    await pool.end();
    writeToLog('DB 연결 정상 종료');
    
    return true;
  } catch (error) {
    writeToLog(`DB 연결 실패: ${error.message}`);
    
    if (error.message.includes('ECONNREFUSED') || 
        error.message.includes('Connection terminated') ||
        error.message.includes('timeout')) {
      writeToLog('Neon DB가 SUSPENDED 상태일 가능성이 있습니다. 콘솔에서 브랜치를 활성화해주세요.');
    }
    
    return false;
  }
}

// 직접 실행 시
if (require.main === module) {
  checkDbHealth().then(isHealthy => {
    const status = isHealthy ? '정상' : '비정상';
    writeToLog(`건강 체크 결과: ${status}`);
    process.exit(isHealthy ? 0 : 1);
  });
}

module.exports = { checkDbHealth };

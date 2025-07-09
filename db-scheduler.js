// DB 건강 체크 스케줄러
require('dotenv').config();
const { checkDbHealth } = require('./db-health-check');
const fs = require('fs');
const path = require('path');

// 설정
const CHECK_INTERVAL = 12 * 60 * 60 * 1000; // 12시간마다 체크 (밀리초)
const MAX_RETRIES = 3; // 최대 재시도 횟수
const RETRY_DELAY = 5 * 60 * 1000; // 재시도 간격 5분 (밀리초)

// 로그 함수
function logWithTimestamp(message) {
  const now = new Date();
  const timestamp = now.toISOString();
  console.log(`[${timestamp}] ${message}`);
  
  const logFile = path.join(__dirname, 'db-scheduler.log');
  fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`);
}

// 건강 체크 실행 함수 (재시도 로직 포함)
async function runHealthCheck() {
  logWithTimestamp('정기 건강 체크 시작');
  
  let isHealthy = false;
  let retries = 0;
  
  while (!isHealthy && retries < MAX_RETRIES) {
    if (retries > 0) {
      logWithTimestamp(`연결 재시도 중... (${retries}/${MAX_RETRIES})`);
      // 재시도 전 대기
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
    
    isHealthy = await checkDbHealth();
    retries++;
  }
  
  if (isHealthy) {
    logWithTimestamp('건강 체크 완료: DB 정상');
  } else {
    logWithTimestamp('건강 체크 실패: DB 연결 불가');
    logWithTimestamp('수동 개입이 필요합니다. Neon 콘솔에서 브랜치를 활성화해주세요.');
  }
}

// 스케줄러 시작
function startScheduler() {
  logWithTimestamp('DB 건강 체크 스케줄러 시작됨');
  
  // 시작 시 즉시 체크
  runHealthCheck();
  
  // 정기 체크 설정
  setInterval(runHealthCheck, CHECK_INTERVAL);
  
  logWithTimestamp(`다음 체크는 ${CHECK_INTERVAL / (60*60*1000)}시간 후에 실행됩니다.`);
}

// 직접 실행 시
if (require.main === module) {
  startScheduler();
}

module.exports = { startScheduler };

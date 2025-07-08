// API 응답 테스트 스크립트
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { Pool } = require('pg');

// 로그 파일 설정
const logFile = path.join(__dirname, 'api-test-log.txt');

// 로그 기록 함수
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  
  console.log(message);
  fs.appendFileSync(logFile, logMessage);
}

// 시작 로그
log('패키지 API 테스트 시작');
log('-------------------------------------');

// DB에서 직접 패키지 데이터 가져오기 (API 로직 시뮬레이션)
async function getPackagesFromDB() {
  log('DB에서 패키지 데이터 가져오기 시작');
  
  try {
    const dbUrl = process.env.NEON_DATABASE_URL;
    if (!dbUrl) {
      log('오류: NEON_DATABASE_URL 환경 변수가 설정되지 않았습니다.');
      return { success: false, error: 'DB URL이 설정되지 않음' };
    }
    
    const pool = new Pool({
      connectionString: dbUrl,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    log('DB 연결 중...');
    const client = await pool.connect();
    log('DB 연결 성공');
    
    // 패키지 데이터 조회
    log('패키지 데이터 조회 중...');
    const result = await client.query('SELECT * FROM packages');
    log(`${result.rows.length}개의 패키지 데이터 발견`);
    
    // 패키지 데이터 분석
    if (result.rows.length > 0) {
      const firstPackage = result.rows[0];
      log('\n첫 번째 패키지 정보:');
      log(`- ID: ${firstPackage.id}`);
      log(`- 제목: ${firstPackage.title}`);
      log(`- 목적지: ${firstPackage.destination}`);
      log(`- 가격: ${firstPackage.price}`);
      
      // 데이터 타입 확인
      log('\n데이터 타입 확인:');
      for (const [key, value] of Object.entries(firstPackage)) {
        log(`- ${key}: ${typeof value} ${value === null ? '(null)' : value instanceof Date ? '(Date)' : Array.isArray(value) ? `(Array[${value.length}])` : ''}`);
      }
    }
    
    // 파일에 저장 (API 결과 시뮬레이션)
    const outputPath = path.join(__dirname, 'api-packages.json');
    fs.writeFileSync(
      outputPath, 
      JSON.stringify(result.rows, null, 2)
    );
    log(`\n패키지 데이터를 ${outputPath}에 저장했습니다.`);
    
    client.release();
    await pool.end();
    log('DB 연결 종료');
    
    return { success: true, count: result.rows.length, packages: result.rows };
  } catch (error) {
    log(`오류 발생: ${error.message}`);
    log(error.stack);
    return { success: false, error: error.message };
  }
}

// 실행
getPackagesFromDB().then(result => {
  if (result.success) {
    log(`스크립트 실행 완료. ${result.count}개의 패키지 데이터를 검증했습니다.`);
  } else {
    log(`스크립트 실행 실패: ${result.error}`);
  }
});

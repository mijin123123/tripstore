// 패키지 페이지 로드 테스트 유틸리티
import fs from 'fs';
import path from 'path';

// 디버깅용 로그 파일
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// 로그 파일에 기록
function logToFile(message) {
  const logPath = path.join(logDir, `packages-${new Date().toISOString().replace(/[:.]/g, '-')}.log`);
  const logMessage = `[${new Date().toISOString()}] ${message}\n`;
  
  fs.appendFileSync(logPath, logMessage);
  console.log(message); // 콘솔에도 출력
}

// 패키지 상태 진단
async function diagnosePackages() {
  logToFile('=== 패키지 로드 진단 시작 ===');
  
  try {
    // 1. 환경 변수 확인
    logToFile('1. 환경 변수 확인:');
    const hasEnvVar = !!process.env.NEON_DATABASE_URL;
    logToFile(`- NEON_DATABASE_URL: ${hasEnvVar ? '설정됨' : '설정되지 않음'}`);
    
    // 2. DB 연결 테스트
    const { Pool } = require('pg');
    
    if (!process.env.NEON_DATABASE_URL) {
      logToFile('❌ NEON_DATABASE_URL이 설정되지 않아 DB 연결을 테스트할 수 없습니다');
      return;
    }
    
    logToFile('2. DB 연결 테스트:');
    
    const pool = new Pool({
      connectionString: process.env.NEON_DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    
    try {
      const client = await pool.connect();
      logToFile('✅ DB 연결 성공!');
      
      // 3. 패키지 테이블 존재 확인
      logToFile('3. 패키지 테이블 확인:');
      const tableCheck = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'packages'
        );
      `);
      
      const packagesTableExists = tableCheck.rows[0].exists;
      logToFile(`- 패키지 테이블 존재: ${packagesTableExists ? '✅ 있음' : '❌ 없음'}`);
      
      if (packagesTableExists) {
        // 4. 패키지 데이터 확인
        const countResult = await client.query('SELECT COUNT(*) FROM packages');
        const packageCount = parseInt(countResult.rows[0].count);
        logToFile(`- 패키지 수: ${packageCount}`);
        
        if (packageCount > 0) {
          logToFile(`✅ ${packageCount}개의 패키지 데이터가 존재합니다`);
          
          // 5. 샘플 데이터 확인
          const sampleResult = await client.query('SELECT * FROM packages LIMIT 2');
          
          if (sampleResult.rows.length > 0) {
            const samplePackage = sampleResult.rows[0];
            logToFile('- 첫 번째 패키지 샘플:');
            logToFile(`  - ID: ${samplePackage.id}`);
            logToFile(`  - 제목: ${samplePackage.title}`);
            logToFile(`  - 목적지: ${samplePackage.destination}`);
          }
        } else {
          logToFile('❌ 패키지 테이블에 데이터가 없습니다');
        }
      }
      
      client.release();
    } catch (dbError) {
      logToFile(`❌ DB 연결 실패: ${dbError.message}`);
    } finally {
      await pool.end();
    }
    
    // 6. API 테스트
    logToFile('6. API 테스트 (생략됨 - 서버 사이드에서 클라이언트 API 호출 불가)');
    logToFile('✅ 진단 완료! 로그 파일을 확인하세요: ' + logDir);
    
  } catch (error) {
    logToFile(`❌ 진단 중 오류 발생: ${error.message}`);
  }
}

// 실행
diagnosePackages().catch(error => {
  console.error('진단 실패:', error);
});

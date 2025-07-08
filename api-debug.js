// API 처리를 위한 직접적인 핸들러 구현
import { config } from 'dotenv';
config();

import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

// API 응답 형식 모방
function jsonResponse(data, status = 200) {
  console.log(`응답 (${status}):`);
  console.log(JSON.stringify(data).substring(0, 100) + '...');
  return data;
}

// GET 핸들러 구현 (패키지 목록 가져오기)
async function handleGetPackages() {
  console.log('=== 패키지 GET 요청 처리 시작 ===');
  
  try {
    const DATABASE_URL = process.env.NEON_DATABASE_URL;
    
    if (!DATABASE_URL) {
      throw new Error('NEON_DATABASE_URL 환경 변수가 설정되지 않았습니다.');
    }
    
    console.log('DB URL 확인됨. 연결 중...');
    
    const pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    console.log('직접 PostgreSQL 연결 시도 중...');
    
    try {
      const result = await pool.query('SELECT * FROM packages');
      await pool.end(); // 연결 종료
      
      console.log(`직접 PostgreSQL 연결로 ${result.rows.length}개의 패키지 데이터를 가져왔습니다.`);
      
      if (result.rows && result.rows.length > 0) {
        console.log('첫 번째 패키지:', result.rows[0]);
        
        // 결과를 파일로 저장 (디버깅용)
        fs.writeFileSync(
          path.join(process.cwd(), 'debug-packages.json'), 
          JSON.stringify(result.rows, null, 2)
        );
        console.log('debug-packages.json 파일에 결과 저장됨');
        
        return jsonResponse(result.rows);
      }
      
      console.log('직접 PostgreSQL 연결로도 데이터를 찾을 수 없습니다.');
      return jsonResponse({ error: '패키지를 찾을 수 없습니다' }, 404);
    } catch (pgError) {
      console.error('PostgreSQL 직접 연결 오류:', pgError);
      throw pgError;
    }
  } catch (error) {
    console.error('패키지 데이터 조회 중 오류:', error);
    return jsonResponse({ 
      error: '패키지 데이터 조회 실패', 
      message: error.message
    }, 500);
  }
}

// 메인 실행
async function main() {
  console.log('패키지 데이터 직접 조회 테스트');
  
  try {
    const result = await handleGetPackages();
    console.log('\n결과 요약:');
    
    if (Array.isArray(result)) {
      console.log(`${result.length}개의 패키지를 가져왔습니다.`);
    } else {
      console.log('패키지를 가져오는데 실패했습니다:', result);
    }
  } catch (error) {
    console.error('오류 발생:', error);
  }
}

main().catch(console.error);

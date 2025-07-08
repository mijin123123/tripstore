// API 테스트와 DB 테스트를 동시에 수행하는 통합 테스트
import { config } from 'dotenv';
config();

import pg from 'pg';
import fetch from 'node-fetch';

const DATABASE_URL = process.env.NEON_DATABASE_URL || 
                    'postgresql://neondb_owner:npg_lu3rwg6HpLGn@ep-noisy-meadow-aex8wbzi-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';

async function runIntegratedTest() {
  console.log('===== API와 DB 통합 테스트 =====');
  
  // 1. 직접 DB 연결 테스트
  console.log('\n1. 직접 DB 연결 테스트:');
  const { Pool } = pg;
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    const client = await pool.connect();
    console.log('- DB 연결 성공!');
    
    // 패키지 테이블 데이터 확인
    const result = await client.query('SELECT COUNT(*) FROM packages');
    console.log(`- packages 테이블에 ${result.rows[0].count}개의 패키지가 있습니다.`);
    
    if (parseInt(result.rows[0].count) > 0) {
      // 첫번째 패키지 데이터 가져오기
      const firstPackage = await client.query('SELECT id, title FROM packages LIMIT 1');
      console.log('- 첫 번째 패키지:', firstPackage.rows[0]);
    }
    
    client.release();
    await pool.end();
  } catch (dbErr) {
    console.error('DB 연결 오류:', dbErr);
  }
  
  // 2. API 엔드포인트 테스트
  console.log('\n2. API 엔드포인트 테스트:');
  try {
    // 로컬 서버 테스트
    const ports = [3000, 3001];
    
    for (const port of ports) {
      try {
        console.log(`- 포트 ${port}에서 API 테스트 중...`);
        const response = await fetch(`http://localhost:${port}/api/packages`, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
            'X-Test-Timestamp': new Date().toISOString()
          },
          timeout: 5000 // 5초 타임아웃
        });
        
        console.log(`- API 응답 상태 코드: ${response.status}`);
        
        if (response.ok) {
          // 응답 내용 확인
          const responseText = await response.text();
          try {
            const data = JSON.parse(responseText);
            console.log(`- API가 ${Array.isArray(data) ? data.length : 0}개의 아이템을 반환했습니다.`);
            
            if (Array.isArray(data) && data.length > 0) {
              // 첫 번째 아이템 확인
              console.log('- 첫 번째 아이템 ID:', data[0].id);
              
              // 더미 데이터인지 확인
              if (data[0].id === 'pkg-001') {
                console.log('- ⚠️ API가 더미 데이터를 반환하고 있습니다.');
              } else {
                console.log('- ✅ API가 실제 DB 데이터를 반환하고 있습니다.');
              }
            }
          } catch (parseErr) {
            console.error('- 응답 파싱 오류:', parseErr);
            console.log('- 응답 내용 (처음 100자):', responseText.substring(0, 100));
          }
        }
        
        // 성공적으로 테스트했으면 반복 종료
        break;
      } catch (portErr) {
        console.log(`- 포트 ${port} 테스트 실패:`, portErr.message);
      }
    }
  } catch (apiErr) {
    console.error('API 테스트 오류:', apiErr);
  }
}

// 실행
runIntegratedTest();

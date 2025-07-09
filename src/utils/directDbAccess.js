// 페이지에서 직접 패키지 가져오기 (API 사용 안함)
// 클라이언트 측에서는 dotenv를 사용할 수 없으므로 제거
// 환경 변수는 서버 컴포넌트나 API 라우트에서만 접근
import pg from 'pg';

// 관리자 UI에서 직접 사용할 수 있는 DB 함수
// 이 함수는 서버 사이드에서만 실행되어야 합니다!
export async function fetchPackagesDirectly() {
  // 클라이언트에서 실행되었는지 확인
  if (typeof window !== 'undefined') {
    console.error('직접 DB 접근은 서버 사이드에서만 가능합니다');
    return {
      success: false,
      error: 'Client-side DB access is not supported',
      packages: [],
      count: 0
    };
  }
  
  // 서버 사이드에서만 실행되는 코드
  let DATABASE_URL;
  
  try {
    // 동적으로 환경 변수 가져오기 (서버 사이드에서만 작동)
    DATABASE_URL = process.env.NEON_DATABASE_URL;
    
    if (!DATABASE_URL) {
      throw new Error('NEON_DATABASE_URL 환경 변수가 설정되지 않았습니다');
    }
    
    console.log('직접 DB 연결을 통해 패키지 데이터 가져오는 중...');
    
    const { Pool } = pg;
    const pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    const client = await pool.connect();
    console.log('DB 연결 성공!');
    
    const result = await client.query('SELECT * FROM packages');
    console.log(`${result.rows.length}개의 패키지를 찾았습니다.`);
    
    client.release();
    await pool.end();
    
    return {
      success: true,
      packages: result.rows,
      count: result.rows.length
    };
  } catch (error) {
    console.error('DB 연결 오류:', error);
    return {
      success: false,
      error: error?.message || '알 수 없는 오류',
      packages: []
    };
  }
}

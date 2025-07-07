import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// 데이터베이스 연결 상태와 디버깅 정보
let db: ReturnType<typeof drizzle>;
let connectionStatus = {
  isConnected: false,
  error: null as Error | null,
  databaseUrl: '',
  timestamp: new Date(),
  driverVersion: {
    neon: typeof neon,
    drizzle: typeof drizzle
  },
  lastChecked: new Date()
};

// 연결 시도 횟수를 제한하기 위한 변수
let connectionAttempts = 0;
const MAX_CONNECTION_ATTEMPTS = 3;

// DB 연결 함수
function connectToDatabase() {
  // 이미 연결 시도 횟수가 초과된 경우
  if (connectionAttempts >= MAX_CONNECTION_ATTEMPTS) {
    console.warn(`최대 연결 시도 횟수(${MAX_CONNECTION_ATTEMPTS})를 초과했습니다. 더미 DB 객체를 사용합니다.`);
    return false;
  }
  
  connectionAttempts++;
  
  try {
    // DB URL 변수 선택 로직
    const DATABASE_URL = process.env.NEON_DATABASE_URL || 
                         process.env.NETLIFY_DATABASE_URL || 
                         process.env.DATABASE_URL;

    // 환경변수 상태 로깅
    const envStatus = {
      NEON_DATABASE_URL: process.env.NEON_DATABASE_URL ? 'SET' : 'NOT SET',
      NETLIFY_DATABASE_URL: process.env.NETLIFY_DATABASE_URL ? 'SET' : 'NOT SET',
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
    };
    console.log(`[시도 ${connectionAttempts}/${MAX_CONNECTION_ATTEMPTS}] 환경변수 상태:`, envStatus);

    if (!DATABASE_URL) {
      console.error('데이터베이스 URL이 설정되지 않았습니다. 환경변수를 확인하세요:', envStatus);
      throw new Error('데이터베이스 URL이 설정되지 않았습니다');
    }

    connectionStatus.databaseUrl = DATABASE_URL.substring(0, 15) + '...';
    console.log('데이터베이스 연결 시도 중...', connectionStatus.databaseUrl);

    try {
      const sql = neon(DATABASE_URL);
      db = drizzle(sql);
      connectionStatus.isConnected = true;
      console.log('데이터베이스 연결 성공!', { 
        neon: typeof neon === 'function' ? 'loaded' : 'not-loaded', 
        drizzle: typeof drizzle === 'function' ? 'loaded' : 'not-loaded' 
      });
      return true;
    } catch (dbInitError: any) {
      console.error('데이터베이스 초기화 오류:', dbInitError);
      throw dbInitError;
    }
    
  } catch (error: any) {
    console.error('데이터베이스 연결 중 오류 발생:', error);
    connectionStatus.error = error;
    connectionStatus.isConnected = false;
    return false;
  }
}

// 첫 번째 연결 시도
const isConnected = connectToDatabase();

// 연결에 실패한 경우 더미 DB 객체 생성
if (!isConnected) {
  // 더미 커넥션 제공 (이 경우 실제 DB 작업은 실패하지만 앱이 크래시되지는 않음)
  console.warn('더미 DB 객체를 대신 사용합니다. 실제 DB 작업은 실패할 수 있습니다.');
  
  // @ts-ignore - 에러 방지용 더미 DB 객체
  db = {
    select: () => ({
      from: () => {
        console.error('DB 연결 실패 상태에서 select.from 호출됨');
        return Promise.resolve([]);
      },
      leftJoin: () => ({ where: () => Promise.resolve([]) })
    }),
    insert: () => ({ 
      values: () => ({ 
        returning: () => {
          console.error('DB 연결 실패 상태에서 insert.values.returning 호출됨');
          return Promise.resolve([]); 
        } 
      }) 
    }),
    query: () => ({ where: () => Promise.resolve([]) }),
  };
}

// 연결 상태 확인 및 재시도 함수
export async function checkConnection() {
  // 이미 연결된 경우 상태만 반환
  if (connectionStatus.isConnected) {
    try {
      // 간단한 테스트 쿼리로 연결 확인
      const testResult = await db.execute(sql`SELECT 1 as test`);
      return { 
        connected: true, 
        status: connectionStatus,
        testQuery: testResult ? 'success' : 'failed'
      };
    } catch (testError) {
      console.error('DB 연결 테스트 실패:', testError);
      // 테스트에 실패하면 연결 끊김으로 간주하고 재시도
      connectionStatus.isConnected = false;
      return { connected: false, error: testError, status: connectionStatus };
    }
  }
  
  // 연결 끊김 상태에서 재시도
  const reconnected = connectToDatabase();
  return { 
    connected: reconnected, 
    status: connectionStatus,
    reconnectAttempt: connectionAttempts
  };
}

export { db };

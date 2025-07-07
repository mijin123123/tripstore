import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

let db: ReturnType<typeof drizzle>;
let connectionStatus = {
  isConnected: false,
  error: null as Error | null,
  databaseUrl: '',
  timestamp: new Date()
};

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
  console.log('환경변수 상태:', envStatus);

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
    console.log('데이터베이스 연결 성공! 드라이버:', { neon: !!neon, drizzle: !!drizzle });
  } catch (dbInitError: any) {
    console.error('데이터베이스 초기화 오류:', dbInitError);
    throw dbInitError;
  }
  
} catch (error: any) {
  console.error('데이터베이스 연결 중 오류 발생:', error);
  connectionStatus.error = error;
  connectionStatus.isConnected = false;
  
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
    insert: () => ({ values: () => ({ returning: () => Promise.resolve([]) }) }),
    query: () => ({ where: () => Promise.resolve([]) }),
  };
}

export { db };

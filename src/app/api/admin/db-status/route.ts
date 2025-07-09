// DB 상태 확인 API
import { NextResponse } from 'next/server';
import { db, checkConnection } from '@/lib/neon';

export async function GET() {
  try {
    // DB 연결 상태 확인
    const connectionStatus = await checkConnection();
    
    if (!connectionStatus.connected) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'DB 연결 실패', 
        details: connectionStatus.status 
      }, { status: 500 });
    }
    
    // DB가 연결된 경우 패키지 수 확인
    try {
      const { count } = await db.select({ count: db.fn.count() }).from(packages);
      
      return NextResponse.json({
        status: 'ok',
        connection: connectionStatus,
        packageCount: Number(count),
        timestamp: new Date().toISOString()
      });
    } catch (dbError) {
      return NextResponse.json({
        status: 'error',
        message: 'DB 쿼리 실패',
        error: dbError instanceof Error ? dbError.message : String(dbError),
        connection: connectionStatus
      }, { status: 500 });
    }
  } catch (error) {
    console.error('DB 상태 확인 중 오류:', error);
    return NextResponse.json({
      status: 'error',
      message: 'DB 상태 확인 실패',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { db } from '@/lib/neon';
import { packages } from '@/lib/schema';

export async function GET() {
  const dbStatus = {
    timestamp: new Date().toISOString(),
    db: !!db,
    environment: process.env.NODE_ENV,
    envVars: {
      NEON_DATABASE_URL: process.env.NEON_DATABASE_URL ? 'SET' : 'NOT SET',
      NETLIFY_DATABASE_URL: process.env.NETLIFY_DATABASE_URL ? 'SET' : 'NOT SET',
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
    }
  };

  try {
    // 실제로 DB 쿼리를 실행하여 연결 상태 확인
    const startTime = Date.now();
    const testResult = await db.select({ count: packages.id }).from(packages);
    const queryTime = Date.now() - startTime;

    return NextResponse.json({
      ...dbStatus,
      connectionTest: {
        success: true,
        packageCount: testResult[0]?.count || 0,
        queryTimeMs: queryTime
      }
    });
  } catch (error: any) {
    console.error('DB 연결 상태 확인 중 오류:', error);
    
    return NextResponse.json({
      ...dbStatus,
      connectionTest: {
        success: false,
        error: error.message,
        stack: error.stack?.slice(0, 200)
      }
    }, { status: 500 });
  }
}

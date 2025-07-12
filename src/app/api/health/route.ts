import { NextRequest, NextResponse } from 'next/server';

// Node.js Runtime 명시 (MongoDB 연결을 위해)
export const runtime = 'nodejs';

export async function GET() {
  try {
    // 환경변수 확인
    const mongoUri = process.env.MONGODB_URI;
    const jwtSecret = process.env.JWT_SECRET;
    
    const envStatus = {
      mongodb: mongoUri ? '✅ 설정됨' : '❌ 누락됨',
      jwt: jwtSecret ? '✅ 설정됨' : '❌ 누락됨',
      nodeEnv: process.env.NODE_ENV || 'development'
    };

    // MongoDB 연결 테스트
    let dbStatus = '❌ 연결 실패';
    if (mongoUri) {
      try {
        const { connectMongoDB } = await import('@/lib/mongodb');
        await connectMongoDB();
        dbStatus = '✅ 연결 성공';
      } catch (error) {
        console.error('MongoDB 연결 오류:', error);
        dbStatus = `❌ 연결 오류: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    }

    return NextResponse.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: envStatus,
      database: dbStatus,
      runtime: 'nodejs'
    });
  } catch (error) {
    console.error('Health check 오류:', error);
    return NextResponse.json(
      { 
        status: 'ERROR', 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

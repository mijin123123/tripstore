import { NextRequest, NextResponse } from 'next/server';

// Node.js Runtime 명시 (MongoDB 연결을 위해)
export const runtime = 'nodejs';

export async function GET() {
  try {
    // 환경변수 확인
    const mongoUri = process.env.MONGODB_URI;
    const jwtSecret = process.env.JWT_SECRET;
    const nodeEnv = process.env.NODE_ENV || 'development';
    
    console.log('🔍 Health Check 시작...');
    console.log('📋 환경 정보:', {
      nodeEnv,
      mongoUriExists: !!mongoUri,
      jwtSecretExists: !!jwtSecret,
      mongoUriPreview: mongoUri ? `${mongoUri.substring(0, 20)}...` : 'null'
    });
    
    const envStatus = {
      mongodb: mongoUri ? '✅ 설정됨' : '❌ 누락됨',
      jwt: jwtSecret ? '✅ 설정됨' : '❌ 누락됨',
      nodeEnv: nodeEnv,
      timestamp: new Date().toISOString()
    };

    // MongoDB 연결 테스트
    let dbStatus = '❌ 연결 실패';
    let dbError = null;
    
    if (mongoUri) {
      try {
        console.log('📡 MongoDB 연결 테스트 시작...');
        const connectMongoDB = (await import('@/lib/mongodb')).default;
        const connection = await connectMongoDB();
        
        if (connection && connection.connection.readyState === 1) {
          dbStatus = '✅ 연결 성공';
          console.log('✅ MongoDB 연결 성공!');
        } else {
          dbStatus = `⚠️ 연결 상태: ${connection?.connection.readyState}`;
        }
      } catch (error) {
        console.error('❌ MongoDB 연결 오류:', error);
        dbStatus = '❌ 연결 오류';
        dbError = error instanceof Error ? error.message : 'Unknown error';
      }
    } else {
      dbError = 'MONGODB_URI 환경변수가 설정되지 않음';
    }

    const response = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: envStatus,
      database: {
        status: dbStatus,
        error: dbError
      },
      runtime: 'nodejs',
      version: process.version
    };

    console.log('📤 Health Check 응답:', response);
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('💥 Health check 오류:', error);
    return NextResponse.json(
      { 
        status: 'ERROR', 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        runtime: 'nodejs'
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

/**
 * MongoDB 진단 및 연결 상태 확인 API
 */
export async function GET() {
  try {
    // 환경 변수 및 시스템 정보 수집
    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      mongoUriProvided: !!process.env.MONGODB_URI,
      node_version: process.version,
      platform: process.platform,
      memory: process.memoryUsage(),
    };

    // MongoDB URI가 설정되지 않은 경우
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        status: 'error',
        message: 'MongoDB URI가 설정되지 않았습니다.',
        diagnostics
      }, { status: 500 });
    }

    // 기존 연결이 있는지 확인
    if (mongoose.connection.readyState) {
      const status = mongoose.STATES[mongoose.connection.readyState];
      return NextResponse.json({
        status: 'info',
        message: `이미 MongoDB 연결이 ${status} 상태입니다.`,
        connectionState: status,
        diagnostics
      });
    }

    // 새 연결 시도
    console.log('🔄 MongoDB 연결 시도...');
    const uri = process.env.MONGODB_URI;
    
    // 연결 시도
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 5000,
    });
    
    // 연결 정보 수집
    const connectionInfo = {
      readyState: mongoose.connection.readyState,
      status: mongoose.STATES[mongoose.connection.readyState],
      host: conn.connection.host,
      name: conn.connection.name,
    };

    // 연결 성공 응답
    return NextResponse.json({
      status: 'success',
      message: 'MongoDB 연결 성공',
      connection: connectionInfo,
      diagnostics
    });
  } catch (error) {
    console.error('❌ MongoDB 연결 실패:', error);
    
    // 자세한 에러 정보
    const errorInfo = {
      message: error.message,
      name: error.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      code: error.code,
    };
    
    return NextResponse.json({
      status: 'error',
      message: 'MongoDB 연결 실패',
      error: errorInfo,
      diagnostics,
    }, { status: 500 });
  }
}

// 서버 사이드 렌더링 설정
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

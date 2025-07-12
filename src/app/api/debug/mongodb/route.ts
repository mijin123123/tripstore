import { NextResponse } from 'next/server';
import connectMongoDBDirect from '@/lib/mongodb-direct';

/**
 * API 환경 진단 엔드포인트
 * 이 API는 디버깅 목적으로만 사용됩니다.
 */
export async function GET() {
  try {
    // 환경 정보 수집
    const envInfo = {
      node_env: process.env.NODE_ENV || '설정되지 않음',
      mongodb_uri_set: !!process.env.MONGODB_URI,
      jwt_secret_set: !!process.env.JWT_SECRET,
      runtime: typeof window === 'undefined' ? '서버사이드' : '클라이언트사이드',
      timestamp: new Date().toISOString(),
    };

    // MongoDB 연결 시도
    try {
      console.log('데이터베이스 연결 진단 시작...');
      await connectMongoDBDirect();
      return NextResponse.json({
        status: 'success',
        message: 'MongoDB 연결 성공',
        env: envInfo
      });
    } catch (dbError: any) {
      return NextResponse.json({
        status: 'error',
        message: '데이터베이스 연결 오류',
        error: dbError.message,
        env: envInfo
      }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: '진단 처리 중 오류 발생',
      error: error.message,
    }, { status: 500 });
  }
}

// Node.js 런타임 사용
export const runtime = 'nodejs';

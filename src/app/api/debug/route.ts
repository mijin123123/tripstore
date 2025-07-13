import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('🔍 Debug API 호출됨');
    
    // 환경 변수 확인
    const mongoUri = process.env.MONGODB_URI;
    const jwtSecret = process.env.JWT_SECRET;
    
    console.log('🔧 환경 변수 상태:');
    console.log('- MONGODB_URI:', mongoUri ? '설정됨' : '누락됨');
    console.log('- JWT_SECRET:', jwtSecret ? '설정됨' : '누락됨');
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    
    if (!mongoUri) {
      return NextResponse.json({
        status: 'error',
        message: 'MONGODB_URI 환경 변수가 설정되지 않았습니다.',
        env: {
          MONGODB_URI: false,
          JWT_SECRET: !!jwtSecret,
          NODE_ENV: process.env.NODE_ENV
        }
      }, { status: 500 });
    }
    
    // MongoDB 연결 테스트
    try {
      console.log('🔄 MongoDB 연결 테스트 시작...');
      await connectMongoDB();
      console.log('✅ MongoDB 연결 성공');
      
      return NextResponse.json({
        status: 'success',
        message: 'MongoDB 연결 성공',
        env: {
          MONGODB_URI: true,
          JWT_SECRET: !!jwtSecret,
          NODE_ENV: process.env.NODE_ENV
        },
        timestamp: new Date().toISOString()
      });
      
    } catch (dbError: any) {
      console.error('❌ MongoDB 연결 실패:', dbError);
      
      return NextResponse.json({
        status: 'error',
        message: 'MongoDB 연결 실패',
        error: dbError.message,
        env: {
          MONGODB_URI: true,
          JWT_SECRET: !!jwtSecret,
          NODE_ENV: process.env.NODE_ENV
        },
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
    
  } catch (error: any) {
    console.error('❌ Debug API 오류:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Debug API 오류',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

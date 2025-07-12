import { NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import mongoose from 'mongoose';

// MongoDB 연결 상태 확인을 위한 헬스체크 API
export async function GET() {
  try {
    const mongodbUri = process.env.MONGODB_URI;
    
    if (!mongodbUri) {
      // 데이터베이스 연결이 없으면 Mock 모드로 작동
      return NextResponse.json({
        status: 'mock',
        timestamp: new Date().toISOString(),
        database: 'Mock Database v1.0',
        message: 'MongoDB 연결이 설정되지 않아 Mock 모드로 작동 중입니다.'
      });
    }

    await connectMongoDB();
    
    // MongoDB 연결 상태 확인
    const dbState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'MongoDB',
      connection_state: states[dbState as keyof typeof states],
      database_name: mongoose.connection.name,
      message: 'MongoDB 연결이 정상입니다.'
    });
  } catch (error) {
    console.error('MongoDB 헬스체크 실패:', error);
    return NextResponse.json(
      { 
        status: 'error',
        timestamp: new Date().toISOString(),
        message: 'MongoDB 연결에 실패했습니다.',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

"use client";
import connectMongoDB from '@/lib/mongodb';

// MongoDB 연결 함수 (클라이언트에서 사용하지 않음)
export function createClient() {
  console.warn('MongoDB는 클라이언트에서 직접 연결할 수 없습니다. API 라우트를 사용해주세요.');
  return null;
}

// MongoDB 연결 상태 확인
export const mongodb = {
  isConnected: false,
  connect: async () => {
    try {
      await connectMongoDB();
      mongodb.isConnected = true;
      return true;
    } catch (error) {
      console.error('MongoDB 연결 실패:', error);
      mongodb.isConnected = false;
      return false;
    }
  }
};

// MongoDB 연결 상태 확인 함수
export async function getDatabaseStatus() {
  try {
    const connected = await mongodb.connect();
    
    if (!connected) {
      throw new Error('MongoDB 연결에 실패했습니다.');
    }
    
    return {
      status: 'connected',
      timestamp: new Date().toISOString(),
      message: 'MongoDB 데이터베이스에 성공적으로 연결되었습니다.',
      database: 'mongodb'
    };
  } catch (error) {
    console.error('MongoDB 연결 실패:', error);
    return {
      status: 'error',
      message: 'MongoDB 데이터베이스 연결에 실패했습니다.',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

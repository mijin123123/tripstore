import mongoose from 'mongoose';

/**
 * 직접 MongoDB 연결을 시도하는 간단한 함수
 * 트러블슈팅용으로 사용됩니다.
 */
export default async function connectMongoDBDirect() {
  try {
    // 환경 변수에서 URI 가져오기
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MongoDB URI가 환경 변수에 설정되어 있지 않습니다.');
    }

    // 연결 시도
    console.log('직접 MongoDB 연결 시도 중...');
    
    // 최소한의 옵션으로 연결
    const conn = await mongoose.connect(mongoUri, {
      connectTimeoutMS: 5000,
      socketTimeoutMS: 5000,
    });
    
    console.log('MongoDB 연결 성공: 직접 연결 방식');
    return conn;
  } catch (error) {
    console.error('MongoDB 연결 실패 (직접 연결):', error);
    throw error;
  }
}

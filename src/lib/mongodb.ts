import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

// 빌드 시에는 환경변수 체크를 하지 않음
if (!MONGODB_URI && process.env.NODE_ENV !== 'development' && typeof window === 'undefined') {
  console.warn('MONGODB_URI 환경변수가 설정되지 않았습니다. 런타임에서 확인합니다.');
}

// Global MongoDB connection cache type
declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// Global MongoDB connection cache
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectMongoDB() {
  // 런타임에 환경변수 체크
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.error('❌ MONGODB_URI 환경변수가 설정되지 않았습니다.');
    console.error('환경변수 목록:', Object.keys(process.env).filter(key => key.includes('MONGO')));
    throw new Error('MONGODB_URI 환경변수를 설정해주세요');
  }

  if (cached.conn) {
    console.log('♻️ 기존 MongoDB 연결 재사용');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('🔄 새로운 MongoDB 연결 시도...');
    
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // 5초 타임아웃 (Netlify 서버리스 함수 제한 시간 고려)
      socketTimeoutMS: 8000, // 8초 소켓 타임아웃 (Netlify 10초 제한보다 짧게)
      maxPoolSize: 5, // 서버리스 환경에 맞게 연결 풀 크기 축소
      retryWrites: true,
      connectTimeoutMS: 5000, // 연결 타임아웃 추가
      keepAlive: true, // 연결 유지
      autoIndex: false, // 서버리스 환경에서는 인덱싱 비활성화
    };

    cached.promise = mongoose.connect(mongoUri, opts).then((mongooseInstance) => {
      console.log('✅ MongoDB 연결 성공');
      console.log('📊 연결 상태:', mongooseInstance.connection.readyState);
      return mongooseInstance;
    }).catch((error) => {
      console.error('❌ MongoDB 연결 실패:', error.message);
      console.error('🔍 연결 문자열 확인:', mongoUri ? '설정됨' : '누락됨');
      cached.promise = null;
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    console.error('💥 MongoDB 연결 캐시 실패:', e);
    cached.promise = null;
    throw e;
  }
}

export default connectMongoDB;

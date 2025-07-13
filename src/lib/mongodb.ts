import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

// 빌드 시에는 환경변수 체크를 하지 않음
if (!MONGODB_URI && process.env.NODE_ENV !== 'development' && typeof window === 'undefined') {
  console.warn('MONGODB_URI 환경변수가 설정되지 않았습니다. 런타임에서 확인합니다.');
}

// Global MongoDB connection cache type
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

// Global MongoDB connection cache
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
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
    console.log('🔗 연결 URI 형식 확인 (보안을 위해 값은 표시하지 않음)');
    
    // 서버리스 환경에 최적화된 연결 옵션
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // 10초로 증가
      socketTimeoutMS: 45000, // 45초로 증가
      ssl: true, // SSL/TLS 연결 강제
    };

    cached.promise = mongoose.connect(mongoUri, opts).then((mongoose) => {
      console.log('✅ 새로운 MongoDB 연결 성공!');
      console.log('📊 연결 상태:', mongoose.connection.readyState);
      return mongoose;
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

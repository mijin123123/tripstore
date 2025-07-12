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
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI 환경변수를 설정해주세요');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB 연결 성공');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectMongoDB;

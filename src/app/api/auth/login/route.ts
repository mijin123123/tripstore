import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// Node.js Runtime 명시 (JWT 호환성을 위해)
export const runtime = 'nodejs';

// User 모델 정의 (임시)
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  name: { type: String },
  created_at: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    console.log('📝 로그인 요청:', email);

    // 입력 데이터 검증
    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '올바른 이메일 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    // 런타임 환경 변수 확인
    const mongoUri = process.env.MONGODB_URI;
    const jwtSecret = process.env.JWT_SECRET;

    if (!mongoUri) {
      console.error('❌ MONGODB_URI 환경 변수가 설정되지 않았습니다.');
      return NextResponse.json(
        { error: '데이터베이스 연결 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    if (!jwtSecret) {
      console.error('❌ JWT_SECRET 환경 변수가 설정되지 않았습니다.');
      return NextResponse.json(
        { error: '서버 설정 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    // MongoDB 연결 시도
    try {
      console.log('🔄 MongoDB 연결 시도 중...');
      await connectMongoDB();
      console.log('✅ MongoDB 연결 성공');
    } catch (dbError) {
      console.error('❌ MongoDB 연결 실패:', dbError);
      return NextResponse.json(
        { error: '데이터베이스 연결 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
        { status: 500 }
      );
    }

    // 사용자 조회
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { error: '존재하지 않는 사용자입니다.' },
        { status: 401 }
      );
    }

    // 비밀번호 확인
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: '비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 성공 응답
    return NextResponse.json({
      message: '로그인에 성공했습니다.',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    console.error('로그인 처리 중 오류:', error);
    
    if (error instanceof mongoose.Error) {
      return NextResponse.json(
        { error: '데이터베이스 연결 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

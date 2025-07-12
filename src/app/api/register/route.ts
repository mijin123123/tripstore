import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// Node.js Runtime 명시 (MongoDB 연결을 위해)
export const runtime = 'nodejs';

// User 모델 정의 (로그인과 동일)
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  name: { type: String },
  created_at: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export async function POST(request: NextRequest) {
  console.log('=== 회원가입 API 시작 ===');
  
  try {
    console.log('📥 요청 본문 파싱 시도...');
    const { name, email, password } = await request.json();
    console.log('✅ 요청 데이터:', { name, email, password: '***' });

    // 입력 데이터 검증
    if (!name || !email || !password) {
      console.log('❌ 필수 필드 누락');
      return NextResponse.json(
        { error: '모든 필드를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ 이메일 형식 오류:', email);
      return NextResponse.json(
        { error: '올바른 이메일 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    // 비밀번호 길이 검증
    if (password.length < 6) {
      console.log('❌ 비밀번호 길이 부족');
      return NextResponse.json(
        { error: '비밀번호는 최소 6자 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    // 환경 변수 확인
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI 환경 변수가 설정되지 않았습니다.');
      return NextResponse.json(
        { error: '데이터베이스 연결 설정이 없습니다.' },
        { status: 500 }
      );
    }

    console.log('🔗 MongoDB 연결 시도...');
    await connectMongoDB();
    console.log('✅ MongoDB 연결 성공');

    // 이메일 중복 확인
    console.log('🔍 이메일 중복 확인:', email);
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      console.log('❌ 이미 존재하는 이메일:', email);
      return NextResponse.json(
        { error: '이미 사용 중인 이메일입니다.' },
        { status: 409 }
      );
    }

    // 비밀번호 해시화
    console.log('🔐 비밀번호 해시화...');
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('✅ 비밀번호 해시화 완료');

    // 사용자 생성
    console.log('👤 새 사용자 생성...');
    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'user'
    });

    console.log('✅ 사용자 생성 성공:', newUser._id);

    // 성공 응답 (비밀번호 제외)
    return NextResponse.json({
      message: '회원가입이 완료되었습니다.',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        created_at: newUser.created_at
      }
    }, { status: 201 });

  } catch (error) {
    console.error('💥 회원가입 오류:', error);
    
    // MongoDB 중복 키 오류 처리
    if (error instanceof mongoose.Error && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        { error: '이미 사용 중인 이메일입니다.' },
        { status: 409 }
      );
    }

    // Mongoose 유효성 검사 오류
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { error: '입력 데이터가 올바르지 않습니다.', details: error.message },
        { status: 400 }
      );
    }

    // MongoDB 연결 오류
    if (error instanceof mongoose.Error) {
      return NextResponse.json(
        { error: '데이터베이스 연결 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    // 기타 오류
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

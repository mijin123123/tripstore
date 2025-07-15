import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Node.js Runtime 명시 (JWT 호환성을 위해)
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  console.log('🔄 로그인 API 호출됨');
  
  try {
    const { email, password } = await request.json();
    
    console.log('📝 로그인 요청:', email);
    console.log('🌍 환경:', process.env.NODE_ENV);

    // 입력 데이터 검증
    if (!email || !password) {
      console.log('❌ 입력 데이터 누락');
      return NextResponse.json(
        { error: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ 이메일 형식 오류');
      return NextResponse.json(
        { error: '올바른 이메일 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    // 런타임 환경 변수 확인
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error('❌ JWT_SECRET 환경 변수가 설정되지 않았습니다.');
      return NextResponse.json(
        { error: '서버 설정 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    // Supabase에서 사용자 조회
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !user) {
      console.log('❌ 사용자를 찾을 수 없음:', error?.message);
      return NextResponse.json(
        { error: '존재하지 않는 사용자입니다.' },
        { status: 401 }
      );
    }

    // 비밀번호 확인
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      console.log('❌ 비밀번호 불일치');
      return NextResponse.json(
        { error: '비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }

    console.log('✅ 로그인 성공:', user.email);

    // JWT 토큰 생성
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role 
      },
      jwtSecret,
      { expiresIn: '7d' }
    );

    // 성공 응답
    return NextResponse.json({
      message: '로그인에 성공했습니다.',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    console.error('❌ 로그인 처리 중 오류:', error);
    
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

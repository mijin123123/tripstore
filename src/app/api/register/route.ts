import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Node.js Runtime 명시 (JWT 호환성을 위해)
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  console.log('🔄 회원가입 API 호출됨');
  
  try {
    const { email, password, name } = await request.json();
    
    console.log('📝 회원가입 요청:', email, name);

    // 입력 데이터 검증
    if (!email || !password || !name) {
      console.log('❌ 입력 데이터 누락');
      return NextResponse.json(
        { error: '이메일, 비밀번호, 이름을 모두 입력해주세요.' },
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

    // 비밀번호 길이 검증
    if (password.length < 6) {
      console.log('❌ 비밀번호 길이 부족');
      return NextResponse.json(
        { error: '비밀번호는 최소 6자 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    // 기존 사용자 확인
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      console.log('❌ 이미 존재하는 이메일');
      return NextResponse.json(
        { error: '이미 사용 중인 이메일입니다.' },
        { status: 409 }
      );
    }

    // 비밀번호 해시
    const hashedPassword = await bcrypt.hash(password, 12);

    // 새 사용자 생성
    const { data: newUser, error: insertError } = await supabaseAdmin
      .from('users')
      .insert([
        {
          email,
          password_hash: hashedPassword,
          name,
          role: 'user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('❌ 사용자 생성 실패:', insertError);
      return NextResponse.json(
        { error: '회원가입 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    console.log('✅ 회원가입 성공:', newUser.email);

    // JWT 토큰 생성
    const jwtSecret = process.env.JWT_SECRET;
    const token = jwt.sign(
      { 
        id: newUser.id, 
        email: newUser.email, 
        role: newUser.role 
      },
      jwtSecret!,
      { expiresIn: '1d' }
    );

    return NextResponse.json({
      success: true,
      message: '회원가입이 완료되었습니다.',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('💥 회원가입 처리 중 예외 발생:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

import { NextRequest } from 'next/server';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * 관리자 로그인 API
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return Response.json(
        { success: false, error: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }
    
    // 사용자 조회
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return Response.json(
        { success: false, error: '사용자를 찾을 수 없습니다.' },
        { status: 401 }
      );
    }
    
    // 비밀번호 검증
    const isValid = await compare(password, user.password_hash);
    if (!isValid) {
      return Response.json(
        { success: false, error: '비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }
    
    // 관리자 권한 확인
    if (user.role !== 'admin') {
      return Response.json(
        { success: false, error: '관리자 권한이 없습니다.' },
        { status: 403 }
      );
    }
    
    // JWT 토큰 생성
    const token = sign(
      { id: user.id, email: user.email, role: user.role }, 
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );
    
    return Response.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return Response.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

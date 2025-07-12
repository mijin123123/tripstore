import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';

/**
 * 관리자 로그인 API 핸들러
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    // 필수 필드 확인
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }
    
    // 인증 시도
    const result = await authenticateUser(email, password);
    
    // 인증 실패
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message || '인증에 실패했습니다.' },
        { status: 401 }
      );
    }
    
    // 관리자 권한 확인
    if (result.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '관리자 권한이 없습니다.' },
        { status: 403 }
      );
    }
    
    // 정상적인 관리자 로그인
    return NextResponse.json({
      success: true,
      token: result.token,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role
      }
    });
  } catch (error) {
    console.error('로그인 처리 중 오류 발생:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

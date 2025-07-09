import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminCredentialsServer } from '@/lib/admin-auth-server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // 입력값 검증
    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 관리자 계정 인증
    const isValidAdmin = verifyAdminCredentialsServer(email, password);
    
    if (!isValidAdmin) {
      console.log('관리자 로그인 실패:', email);
      return NextResponse.json(
        { error: '관리자 권한이 없습니다.' },
        { status: 401 }
      );
    }

    console.log('관리자 로그인 성공:', email);

    // 관리자 세션 생성
    const adminSession = {
      email: email,
      role: 'admin',
      loginTime: new Date().toISOString()
    };

    // 쿠키에 세션 정보 저장 (보안 강화)
    const response = NextResponse.json(
      { 
        message: '관리자 로그인 성공',
        user: adminSession
      },
      { status: 200 }
    );

    // HTTP-only 쿠키로 관리자 세션 저장
    response.cookies.set('admin-session', JSON.stringify(adminSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24시간
      path: '/admin'
    });

    return response;

  } catch (error) {
    console.error('관리자 로그인 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

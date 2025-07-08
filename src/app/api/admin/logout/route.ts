import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('=== 관리자 로그아웃 API 시작 ===');
    
    // 응답 생성
    const response = NextResponse.json({
      success: true,
      message: '관리자 로그아웃 성공'
    });
    
    // admin_auth 쿠키 삭제 (만료 시간을 과거로 설정)
    response.cookies.set({
      name: 'admin_auth',
      value: '',
      path: '/',
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    
    console.log('🍪 admin_auth 쿠키 삭제 완료');
    return response;
    
  } catch (error) {
    console.error('❌ 관리자 로그아웃 API 오류:', error);
    return NextResponse.json(
      { 
        error: '로그아웃 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}

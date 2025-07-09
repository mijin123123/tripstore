import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('관리자 로그아웃 요청');

    // 쿠키에서 관리자 세션 제거
    const response = NextResponse.json(
      { message: '로그아웃 성공' },
      { status: 200 }
    );

    // 관리자 세션 쿠키 삭제
    response.cookies.delete('admin-session');

    return response;

  } catch (error) {
    console.error('관리자 로그아웃 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

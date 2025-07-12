import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 관리자 경로 보호 (단순 쿠키 체크만 수행)
  if (request.nextUrl.pathname.startsWith('/admin')) {
    try {
      // JWT 검증 대신 단순히 토큰 존재 여부만 확인
      const token = request.cookies.get('auth-token')?.value || 
                   request.headers.get('authorization')?.replace('Bearer ', '');

      if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      // JWT 검증은 API 라우트에서 수행하도록 변경
      return response;

    } catch (error) {
      console.error('인증 확인 실패:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

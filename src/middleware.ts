import { NextResponse, type NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 관리자 경로 보호
  if (request.nextUrl.pathname.startsWith('/admin')) {
    try {
      // JWT 토큰 확인
      const token = request.cookies.get('auth-token')?.value || 
                   request.headers.get('authorization')?.replace('Bearer ', '');

      if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET 환경 변수가 설정되지 않았습니다.');
        return NextResponse.redirect(new URL('/login', request.url));
      }

      // JWT 토큰 검증
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
      
      // 관리자 권한 확인
      if (decoded.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }

      // 인증 성공 시 계속 진행
      return response;

    } catch (error) {
      console.error('JWT 토큰 검증 실패:', error);
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

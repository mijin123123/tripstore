import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // /simple-login을 /login으로 리다이렉트
  if (request.nextUrl.pathname === '/simple-login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 관리자 페이지 인증 확인
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // 로그인 페이지는 인증 확인을 건너뛰기
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    // admin_auth 쿠키를 확인하여 인증 여부 검사
    const adminAuth = request.cookies.get('admin_auth');

    if (!adminAuth || adminAuth.value !== 'true') {
      // 인증되지 않은 경우, 로그인 페이지로 리디렉션
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // 현재 URL과 경로를 로깅
  console.log('미들웨어 실행:', request.nextUrl.pathname);

  // /simple-login을 /login으로 리다이렉트
  if (request.nextUrl.pathname === '/simple-login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 관리자 로그인 페이지는 항상 허용
  if (request.nextUrl.pathname === '/admin/login') {
    console.log('관리자 로그인 페이지 접근 허용');
    return NextResponse.next();
  }

  // 관리자 페이지에 대한 접근 처리
  if (request.nextUrl.pathname.startsWith('/admin')) {
    console.log('관리자 페이지 접근 감지, 인증 확인 중');
    
    // admin_auth 쿠키를 확인하여 인증 여부 검사
    const adminAuth = request.cookies.get('admin_auth');

    if (!adminAuth || adminAuth.value !== 'true') {
      // 인증되지 않은 경우, 로그인 페이지로 리디렉션
      console.log('인증되지 않음, 로그인 페이지로 리디렉션');
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    console.log('인증 확인됨, 접근 허용');
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

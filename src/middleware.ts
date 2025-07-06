import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // /simple-login을 /login으로 리다이렉트
  if (request.nextUrl.pathname === '/simple-login') {
    return NextResponse.redirect(new URL('/login', request.url));
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

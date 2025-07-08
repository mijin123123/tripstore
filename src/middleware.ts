import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  console.log(`[미들웨어] ${new Date().toISOString()} - 실행: ${request.nextUrl.pathname}`);
  
  // 정적 파일 및 API는 항상 접근 허용
  if (request.nextUrl.pathname.includes('/_next/') || 
      request.nextUrl.pathname.startsWith('/api/') ||
      request.nextUrl.pathname.match(/\.(css|js|png|jpg|jpeg|svg|ico|json|woff|woff2|ttf)$/)) {
    return NextResponse.next();
  }
  
  // 메인 사이트 처리
  if (request.nextUrl.pathname === '/simple-login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // 관리자 페이지 처리
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // 로그인 페이지는 항상 접근 허용
    if (request.nextUrl.pathname === '/admin/login') {
      // 쿠키 로깅
      console.log('[미들웨어] 관리자 로그인 페이지 접근');
      const cookies = request.cookies.getAll();
      console.log(`[미들웨어] 쿠키 수: ${cookies.length}`);
      
      // 이미 인증된 경우 대시보드로 리다이렉트 (주석 처리: 무한 리다이렉션 방지)
      /*
      const adminAuth = request.cookies.get('admin_auth');
      if (adminAuth?.value === 'true') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      */
      
      return NextResponse.next();
    }
    // 배포 환경 문제 해결을 위해 관리자 페이지도 항상 접근 허용
    console.log('[미들웨어] 관리자 페이지 접근 허용 (긴급 패치):', request.nextUrl.pathname);
    return NextResponse.next();
  }
  
  // 기본적으로 모든 요청 허용
  return NextResponse.next();
}

export const config = {
  matcher: [
    // 관리자 페이지 및 API 경로 지정
    '/admin/:path*',  // 모든 관리자 페이지에 적용 
    '/api/admin/:path*', // 관리자 API에 적용
    '/simple-login', // simple-login 리다이렉트용
  ],
};

import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // 미들웨어 실행 로깅 - 현재 URL 및 시간
  console.log(`[미들웨어] ${new Date().toISOString()} - 실행: ${request.nextUrl.pathname}`);
  
  try {
    // /simple-login을 /login으로 리다이렉트
    if (request.nextUrl.pathname === '/simple-login') {
      console.log('[미들웨어] simple-login → login 리다이렉트');
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // 관리자 API 접근 허용 패턴
    const adminApiPaths = ['/api/admin/login', '/api/admin/logout'];
    if (adminApiPaths.includes(request.nextUrl.pathname)) {
      console.log('[미들웨어] 관리자 API 접근 허용:', request.nextUrl.pathname);
      return NextResponse.next();
    }
    
    // 관리자 페이지 처리 (여기서부터는 /admin으로 시작하는 모든 경로에 적용)
    if (request.nextUrl.pathname.startsWith('/admin')) {
      console.log('[미들웨어] 관리자 경로 감지:', request.nextUrl.pathname);
      
      // 관리자 인증 쿠키 확인
      const adminAuth = request.cookies.get('admin_auth');
      console.log('[미들웨어] admin_auth 쿠키:', adminAuth ? `존재 (${adminAuth.value})` : '없음');
      
      // 관리자 로그인 페이지인 경우
      if (request.nextUrl.pathname === '/admin/login') {
        // 이미 로그인한 상태라면 대시보드로 리다이렉트
        if (adminAuth && adminAuth.value === 'true') {
          console.log('[미들웨어] 이미 로그인됨, 대시보드로 리다이렉트');
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
        
        // 로그인하지 않은 상태면 로그인 페이지 표시
        console.log('[미들웨어] 로그인 페이지 접근 허용');
        return NextResponse.next();
      }
      
      // 로그인 페이지가 아닌 관리자 페이지에 접근하는 경우
      // 인증되지 않았으면 로그인 페이지로 리다이렉트
      if (!adminAuth || adminAuth.value !== 'true') {
        console.log('[미들웨어] ⚠️ 인증되지 않은 관리자 페이지 접근 시도:', request.nextUrl.pathname);
        
        // 모든 쿠키 디버깅
        console.log('[미들웨어] 요청 쿠키 목록:');
        const cookies = request.cookies.getAll();
        if (cookies.length === 0) {
          console.log('[미들웨어]   - 쿠키 없음');
        } else {
          cookies.forEach((cookie, idx) => {
            console.log(`[미들웨어]   - [${idx}] ${cookie.name}: ${cookie.value.substring(0, 15)}...`);
          });
        }
        
        // 모든 헤더 디버깅
        console.log('[미들웨어] 요청 헤더:');
        const headers: Record<string, string> = {};
        request.headers.forEach((value, key) => {
          headers[key] = value;
        });
        console.log(headers);
        
        // 로그인 페이지로 리다이렉트
        console.log('[미들웨어] → 로그인 페이지로 리다이렉트');
        
        // 리다이렉트 후 되돌아올 원래 URL을 쿼리 파라미터로 추가
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('from', request.nextUrl.pathname);
        
        return NextResponse.redirect(loginUrl);
      }
      
      console.log('[미들웨어] ✅ 인증된 관리자 접근 허용:', request.nextUrl.pathname);
    }
  } catch (error) {
    console.error('[미들웨어 오류]', error);
    // 오류 발생시에도 계속 진행 (사이트 접근성 유지)
  }

  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
}

export const config = {
  matcher: [
    // 관리자 페이지 및 API 경로 지정
    '/admin/:path*',  // 모든 관리자 페이지에 적용 
    '/api/admin/:path*', // 관리자 API에 적용
    '/simple-login', // simple-login 리다이렉트용
  ],
};

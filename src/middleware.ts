import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname, searchParams, hash } = url;
  
  console.log('미들웨어 실행됨:', { 
    url: request.url, 
    pathname, 
    searchParams: Object.fromEntries(searchParams.entries()),
    hash 
  });
  
  // 케이스 1: Supabase 비밀번호 재설정 이메일 링크는 ?type=recovery 파라미터를 가지고 있음
  if (searchParams.has('type') && searchParams.get('type') === 'recovery') {
    console.log('비밀번호 복구 링크 감지(타입 파라미터): 재설정 페이지로 리디렉션');
    
    // 모든 쿼리 파라미터 유지하면서 리디렉션
    const redirectUrl = new URL('/reset-password/update', request.url);
    searchParams.forEach((value, key) => {
      redirectUrl.searchParams.set(key, value);
    });
    
    return NextResponse.redirect(redirectUrl);
  }
  
  // 케이스 2: URL의 해시에 access_token이 있는 경우 (Supabase 인증 후 리디렉션)
  if (hash && hash.includes('access_token')) {
    console.log('액세스 토큰 감지됨 - 비밀번호 업데이트 페이지로 리디렉션');
    
    // 해시 파라미터를 쿼리 파라미터로 변환
    const redirectUrl = new URL('/reset-password/update', request.url);
    
    // 해시 내용을 그대로 유지 (Next.js에서 처리하도록)
    redirectUrl.hash = hash;
    
    return NextResponse.redirect(redirectUrl);
  }
  
  // 케이스 3: 특별히 비밀번호 재설정 경로로 바로 접근한 경우
  if (pathname === '/reset-password' && !searchParams.has('type')) {
    // 이미 reset-password 페이지인 경우 그대로 유지
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

// 모든 경로에 대해 미들웨어 적용 (특히 인증 관련 경로)
export const config = {
  matcher: [
    '/',
    '/reset-password',
    '/reset-password/:path*',
  ],
};

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
  if (hash && (hash.includes('access_token') || hash.includes('type=recovery'))) {
    console.log('액세스 토큰 또는 recovery 타입 감지됨 - 비밀번호 업데이트 페이지로 리디렉션');
    
    // 해시 파라미터를 쿼리 파라미터로 변환
    const redirectUrl = new URL('/reset-password/update', request.url);
    
    try {
      // 해시 파라미터 분석
      const hashParams = new URLSearchParams(hash.replace('#', ''));
      console.log('해시 파라미터:', Object.fromEntries(hashParams.entries()));
      
      // 중요 파라미터들을 쿼리로 변환 (해시는 클라이언트에서만 접근 가능하기 때문)
      if (hashParams.has('access_token')) {
        redirectUrl.searchParams.set('access_token', hashParams.get('access_token') || '');
      }
      if (hashParams.has('refresh_token')) {
        redirectUrl.searchParams.set('refresh_token', hashParams.get('refresh_token') || '');
      }
      if (hashParams.has('type')) {
        redirectUrl.searchParams.set('type', hashParams.get('type') || '');
      }
    } catch (e) {
      console.error('해시 파라미터 분석 오류', e);
    }
    
    // 해시도 유지 (클라이언트에서 처리할 수 있도록)
    redirectUrl.hash = hash;
    
    return NextResponse.redirect(redirectUrl);
  }
  
  // 케이스 3: 특별히 비밀번호 재설정 경로로 바로 접근한 경우
  if (pathname === '/reset-password' && !pathname.includes('/update')) {
    console.log('비밀번호 재설정 페이지 접근: update 경로로 리디렉션');
    return NextResponse.redirect(new URL('/reset-password/update', request.url));
  }
  
  // 케이스 4: 메인 페이지에 토큰 정보가 있는 경우
  if (pathname === '/' && (hash.includes('access_token') || searchParams.has('access_token'))) {
    console.log('메인 페이지에 토큰 정보 감지: 업데이트 페이지로 리디렉션');
    const redirectUrl = new URL('/reset-password/update', request.url);
    
    // 쿼리 파라미터 복사
    searchParams.forEach((value, key) => {
      redirectUrl.searchParams.set(key, value);
    });
    
    // 해시 유지
    redirectUrl.hash = hash;
    
    return NextResponse.redirect(redirectUrl);
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

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname, searchParams } = url;
  
  // Supabase 비밀번호 재설정 이메일 링크는 ?type=recovery 파라미터를 가지고 있음
  if (pathname === '/' && searchParams.get('type') === 'recovery') {
    console.log('비밀번호 복구 링크 감지: 재설정 페이지로 리디렉션');
    
    // 모든 쿼리 파라미터 유지하면서 리디렉션
    const redirectUrl = new URL('/reset-password/update', request.url);
    searchParams.forEach((value, key) => {
      redirectUrl.searchParams.set(key, value);
    });
    
    return NextResponse.redirect(redirectUrl);
  }
  
  return NextResponse.next();
}

// 모든 경로에 대해 미들웨어 적용
export const config = {
  matcher: [
    /*
     * "/" 경로와 쿼리 파라미터 매칭:
     * - ?type=recovery 가 포함된 URL을 감지
     */
    '/:path*',
  ],
};

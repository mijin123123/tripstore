import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/neon';
import { admins } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    console.log('=== 관리자 로그인 API 시작 ===');
    
    const body = await request.json();
    console.log('요청 본문:', body);
    
    const { email, password } = body;

    if (!email || !password) {
      console.log('이메일 또는 비밀번호 누락');
      return NextResponse.json(
        { error: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    console.log('관리자 로그인 시도 - 이메일:', email);
    
    // DB에서 관리자 계정 조회
    console.log('DB에서 관리자 계정 조회 중...');
    const admin = await db.select().from(admins).where(eq(admins.email, email)).limit(1);
    
    console.log('관리자 계정 조회 결과:', admin.length > 0 ? '계정 발견' : '계정 없음');
    
    // 관리자 계정이 없는 경우
    if (!admin.length) {
      console.log('❌ 관리자 계정이 존재하지 않음');
      return NextResponse.json(
        { error: '관리자 이메일 또는 비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }
    
    const adminUser = admin[0];
    
    // 비밀번호가 저장되어 있지 않은 경우 (migration 중 또는 레거시 계정)
    if (!adminUser.password) {
      console.log('⚠️ 관리자 계정에 비밀번호가 설정되어 있지 않음, 하드코딩된 비밀번호 확인');
      
      // 임시 하드코딩 비밀번호 확인 (마이그레이션 기간 동안만 사용)
      if (email === 'sonchanmin89@gmail.com' && password === 'aszx1212') {
        console.log('✅ 하드코딩된 비밀번호로 로그인 성공');
        
        // 응답 생성
        const response = NextResponse.json({ 
          success: true,
          message: '관리자 로그인 성공 (임시 비밀번호)'
        });
        
        // 쿠키 설정 - Netlify 배포 환경에서의 문제 해결을 위해 간소화
        response.cookies.set({
          name: 'admin_auth',
          value: 'true',
          path: '/',
          maxAge: 60 * 60 * 24, // 24시간
          httpOnly: false, // 클라이언트 측에서 접근 가능하도록 설정
          secure: false, // HTTP/HTTPS 모두 작동하도록 설정
          sameSite: 'lax',
        });
        
        // 응답 헤더에 Set-Cookie 추가 (중복 설정)
        response.headers.append(
          'Set-Cookie',
          `admin_auth=true; Path=/; Max-Age=${60 * 60 * 24}; SameSite=Lax`
        );
        
        console.log('🍪 admin_auth 쿠키 설정 완료');
        return response;
      }
      
      console.log('❌ 임시 비밀번호 확인 실패');
      return NextResponse.json(
        { error: '관리자 이메일 또는 비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }
    
    // 저장된 비밀번호와 비교
    console.log('💡 비밀번호 확인 중...');
    const isPasswordValid = await bcrypt.compare(password, adminUser.password);
    
    if (isPasswordValid) {
      console.log('✅ 관리자 로그인 성공 (비밀번호 일치)');
      
      // 응답 생성
      const response = NextResponse.json({ 
        success: true,
        message: '관리자 로그인 성공'
      });
      
      // 쿠키 설정 - 강화된 보안 (Netlify 배포 환경 고려)
      response.cookies.set({
        name: 'admin_auth',
        value: 'true',
        path: '/',
        maxAge: 60 * 60 * 24, // 24시간
        httpOnly: true,
        secure: false, // 배포 환경에서도 문제없이 작동하도록 false로 설정
        sameSite: 'lax',
      });
      
      console.log('🍪 admin_auth 쿠키 설정 완료');
      return response;
    }

    console.log('❌ 관리자 로그인 실패 - 잘못된 자격증명');
    return NextResponse.json(
      { error: '관리자 이메일 또는 비밀번호가 일치하지 않습니다.' },
      { status: 401 }
    );

  } catch (error) {
    console.error('❌ 관리자 로그인 API 오류:', error);
    return NextResponse.json(
      { 
        error: '서버 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}

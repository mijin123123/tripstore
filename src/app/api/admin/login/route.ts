import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';

// Node.js Runtime 명시 (JWT 호환성을 위해)
export const runtime = 'nodejs';

/**
 * 관리자 로그인 API 핸들러
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    console.log('📝 관리자 로그인 시도:', email);
    
    // 필수 필드 확인
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }
    
    // 환경 변수 확인
    if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
      console.error('❌ 필수 환경 변수가 설정되지 않았습니다');
      console.error('MONGODB_URI 설정됨:', !!process.env.MONGODB_URI);
      console.error('JWT_SECRET 설정됨:', !!process.env.JWT_SECRET);
      
      return NextResponse.json(
        { success: false, error: '서버 설정 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
    
    // 인증 시도
    const result = await authenticateUser(email, password);
    
    // 인증 실패
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message || '인증에 실패했습니다.' },
        { status: 401 }
      );
    }
    
    // 관리자 권한 확인
    if (result.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '관리자 권한이 없습니다.' },
        { status: 403 }
      );
    }
    
    // 정상적인 관리자 로그인
    return NextResponse.json({
      success: true,
      token: result.token,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role
      }
    });
  } catch (error) {
    console.error('로그인 처리 중 오류 발생:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

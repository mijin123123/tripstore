import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('=== 로그인 API 시작 ===');
    
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

    console.log('로그인 시도 - 이메일:', email);

    // 임시 관리자 계정 (데이터베이스 연결 없이)
    if (email === 'sonchanmin89@gmail.com' && password === 'admin123') {
      console.log('✅ 관리자 로그인 성공');
      return NextResponse.json({
        success: true,
        user: {
          id: 'admin-001',
          email: 'sonchanmin89@gmail.com',
          fullName: '관리자',
          createdAt: new Date().toISOString(),
          isAdmin: true
        }
      });
    }

    // 임시 일반 사용자 계정들
    const testUsers = [
      { id: 'user-001', email: 'test@example.com', password: 'test123', fullName: '테스트 사용자' },
      { id: 'user-002', email: 'user@test.com', password: 'user123', fullName: '사용자' }
    ];

    const foundUser = testUsers.find(user => user.email === email && user.password === password);
    
    if (foundUser) {
      console.log('✅ 일반 사용자 로그인 성공');
      return NextResponse.json({
        success: true,
        user: {
          id: foundUser.id,
          email: foundUser.email,
          fullName: foundUser.fullName,
          createdAt: new Date().toISOString(),
          isAdmin: false
        }
      });
    }

    console.log('❌ 로그인 실패 - 잘못된 자격증명');
    return NextResponse.json(
      { error: '이메일 또는 비밀번호가 일치하지 않습니다.' },
      { status: 401 }
    );

  } catch (error) {
    console.error('❌ 로그인 API 오류:', error);
    return NextResponse.json(
      { 
        error: '서버 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';

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

    // 관리자 계정 확인
    if (email === 'sonchanmin89@gmail.com' && password === 'admin123') {
      console.log('✅ 관리자 로그인 성공');
      return NextResponse.json({ success: true });
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

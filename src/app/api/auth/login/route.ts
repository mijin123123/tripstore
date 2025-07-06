import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/neon';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 사용자 계정 조회
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json(
        { error: '등록되지 않은 이메일입니다.' },
        { status: 401 }
      );
    }

    // 임시로 비밀번호 확인 없이 로그인 성공 처리
    // 실제 환경에서는 사용자 테이블에 password 필드를 추가하고 bcrypt로 비교해야 함
    console.log('사용자 로그인 시도:', email);

    // 로그인 성공
    return NextResponse.json({
      success: true,
      user: {
        id: user[0].id,
        email: user[0].email,
        fullName: user[0].fullName,
        createdAt: user[0].createdAt
      }
    });

  } catch (error) {
    console.error('사용자 로그인 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

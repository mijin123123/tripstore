import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/neon';
import { users, admins } from '@/lib/schema';
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

    // 먼저 일반 사용자 테이블에서 조회
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (user.length > 0) {
      // 일반 사용자로 로그인 성공
      return NextResponse.json({
        success: true,
        user: {
          id: user[0].id,
          email: user[0].email,
          fullName: user[0].fullName,
          createdAt: user[0].createdAt,
          isAdmin: false
        }
      });
    }

    // 일반 사용자에 없으면 관리자 테이블에서 조회
    const admin = await db
      .select()
      .from(admins)
      .where(eq(admins.email, email))
      .limit(1);

    if (admin.length > 0) {
      // 관리자 비밀번호 확인 (실제 환경에서는 bcrypt 비교 필요)
      // 임시로 관리자는 비밀번호 체크 없이 로그인 허용
      return NextResponse.json({
        success: true,
        user: {
          id: admin[0].email, // 관리자는 이메일을 ID로 사용
          email: admin[0].email,
          fullName: '관리자',
          createdAt: admin[0].createdAt,
          isAdmin: true
        }
      });
    }

    // 둘 다 없으면 오류
    return NextResponse.json(
      { error: '등록되지 않은 이메일입니다.' },
      { status: 401 }
    );

  } catch (error) {
    console.error('사용자 로그인 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

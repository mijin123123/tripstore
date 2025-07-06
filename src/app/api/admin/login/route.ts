import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/neon';
import { admins } from '@/lib/schema';
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

    // 관리자 계정 조회
    const admin = await db
      .select()
      .from(admins)
      .where(eq(admins.email, email))
      .limit(1);

    if (admin.length === 0) {
      return NextResponse.json(
        { error: '관리자 계정이 존재하지 않습니다.' },
        { status: 401 }
      );
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, admin[0].password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: '비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // 로그인 성공
    return NextResponse.json({
      success: true,
      admin: {
        email: admin[0].email,
        createdAt: admin[0].createdAt
      }
    });

  } catch (error) {
    console.error('관리자 로그인 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

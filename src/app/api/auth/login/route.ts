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

    console.log('로그인 시도:', email);

    // 임시로 하드코딩된 관리자 로그인
    if (email === 'sonchanmin89@gmail.com' && password === 'admin123') {
      console.log('관리자 로그인 성공 (하드코딩)');
      return NextResponse.json({
        success: true,
        user: {
          id: 'admin',
          email: 'sonchanmin89@gmail.com',
          fullName: '관리자',
          createdAt: new Date().toISOString(),
          isAdmin: true
        }
      });
    }

    // 데이터베이스 연결 테스트
    try {
      console.log('데이터베이스 연결 테스트...');
      const adminResult = await db
        .select()
        .from(admins)
        .where(eq(admins.email, email))
        .limit(1);

      console.log('데이터베이스 조회 결과:', adminResult);

      if (adminResult.length > 0) {
        const admin = adminResult[0];
        console.log('관리자 계정 찾음:', admin);
        
        // 비밀번호 확인
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        
        if (!isPasswordValid) {
          console.log('비밀번호 불일치');
          return NextResponse.json(
            { error: '비밀번호가 일치하지 않습니다.' },
            { status: 401 }
          );
        }

        console.log('관리자 로그인 성공');
        return NextResponse.json({
          success: true,
          user: {
            id: admin.email,
            email: admin.email,
            fullName: '관리자',
            createdAt: admin.createdAt,
            isAdmin: true
          }
        });
      }
    } catch (dbError) {
      console.error('데이터베이스 오류:', dbError);
      
      // 데이터베이스 오류 시 하드코딩된 로그인 사용
      if (email === 'sonchanmin89@gmail.com' && password === 'admin123') {
        console.log('데이터베이스 오류로 하드코딩 로그인 사용');
        return NextResponse.json({
          success: true,
          user: {
            id: 'admin',
            email: 'sonchanmin89@gmail.com',
            fullName: '관리자',
            createdAt: new Date().toISOString(),
            isAdmin: true
          }
        });
      }
    }

    return NextResponse.json(
      { error: '등록되지 않은 이메일이거나 비밀번호가 일치하지 않습니다.' },
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

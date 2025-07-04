import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { email, newPassword } = await request.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: '이메일과 새 비밀번호가 필요합니다.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: '비밀번호는 최소 6자 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // users 테이블에서 해당 이메일 사용자 확인
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single();

    if (userError) {
      return NextResponse.json(
        { error: '해당 이메일의 사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 간단한 해시 함수 사용 (실제 운영환경에서는 bcrypt 등을 사용해야 함)
    const hashedPassword = Buffer.from(newPassword).toString('base64');

    // users 테이블에 새 비밀번호 업데이트 (해시된 형태로 저장)
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        password_hash: hashedPassword,
        updated_at: new Date().toISOString()
      })
      .eq('email', email);

    if (updateError) {
      console.error('비밀번호 업데이트 오류:', updateError);
      return NextResponse.json(
        { error: '비밀번호 변경 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: `${email}의 비밀번호가 성공적으로 변경되었습니다.` },
      { status: 200 }
    );

  } catch (error) {
    console.error('비밀번호 재설정 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

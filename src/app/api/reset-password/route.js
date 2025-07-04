import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { email, newPassword } = await request.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: '?�메?�과 ??비�?번호가 ?�요?�니??' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: '비�?번호??최소 6???�상?�어???�니??' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // ?�당 ?�메?�의 ?�용??찾기
    const { data: users, error: getUserError } = await supabase.auth.admin.listUsers();
    
    if (getUserError) {
      console.error('?�용??조회 ?�류:', getUserError);
      return NextResponse.json(
        { error: '?�용??조회 �??�류가 발생?�습?�다.' },
        { status: 500 }
      );
    }

    const user = users.users.find(u => u.email === email);
    
    if (!user) {
      return NextResponse.json(
        { error: '?�당 ?�메?�의 ?�용?��? 찾을 ???�습?�다.' },
        { status: 404 }
      );
    }

    // 관리자 권한?�로 비�?번호 변�?
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (updateError) {
      console.error('비�?번호 변�??�류:', updateError);
      return NextResponse.json(
        { error: '비�?번호 변�?�??�류가 발생?�습?�다.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: '비�?번호가 ?�공?�으�?변경되?�습?�다.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('비�?번호 ?�설??API ?�류:', error);
    return NextResponse.json(
      { error: '?�버 ?�류가 발생?�습?�다.' },
      { status: 500 }
    );
  }
}

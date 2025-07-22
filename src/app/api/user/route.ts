import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const { userId, userData } = await request.json();
    
    if (!userId || !userData) {
      return NextResponse.json(
        { error: '사용자 ID와 데이터가 필요합니다.' },
        { status: 400 }
      );
    }
    
    // 서버 사이드 Supabase 클라이언트 생성 (서비스 역할 사용)
    const supabase = createServerClient();
    
    console.log('서버에서 사용자 생성 시도:', userId, userData);
    
    // users 테이블에 사용자 추가
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: userId,
        ...userData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();
    
    if (error) {
      console.error('사용자 생성 오류:', error);
      return NextResponse.json(
        { error: `사용자 생성 실패: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, user: data[0] });
  } catch (error: any) {
    console.error('서버 오류:', error);
    return NextResponse.json(
      { error: `서버 오류: ${error.message}` },
      { status: 500 }
    );
  }
}

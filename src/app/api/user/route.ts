import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    // 요청 본문을 로그로 기록 (디버깅용)
    const requestText = await request.text();
    console.log('API 요청 본문:', requestText);
    
    // 텍스트로 가져온 본문을 다시 JSON으로 파싱
    let requestData;
    try {
      requestData = JSON.parse(requestText);
    } catch (parseError) {
      console.error('JSON 파싱 오류:', parseError);
      return NextResponse.json(
        { error: 'JSON 파싱 오류: ' + (parseError as Error).message },
        { status: 400 }
      );
    }
    
    const { userId, userData } = requestData;
    
    // 필수 필드 확인
    if (!userId) {
      console.error('userId 필드 없음');
      return NextResponse.json(
        { error: 'userId 필드가 필요합니다.' },
        { status: 400 }
      );
    }
    
    if (!userData) {
      console.error('userData 필드 없음');
      return NextResponse.json(
        { error: 'userData 필드가 필요합니다.' },
        { status: 400 }
      );
    }
    
    // 서비스 키 확인
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ihhnvmzizaiokrfkatwt.supabase.co';
    const serviceKey = process.env.SUPABASE_SERVICE_KEY;
    
    if (!serviceKey) {
      console.error('SUPABASE_SERVICE_KEY가 정의되지 않았습니다!');
      return NextResponse.json(
        { error: '서버 구성 오류: 서비스 키가 없습니다.' },
        { status: 500 }
      );
    }
    
    console.log('서비스 키 존재 확인:', !!serviceKey, '길이:', serviceKey.length);
    
    // 서비스 롤을 사용하는 Admin Supabase 클라이언트 생성
    // 이 방법은 RLS 우회가 가능하여 데이터 추가 권한이 확실함
    const supabaseAdmin = createClient(
      supabaseUrl,
      serviceKey
    );
    
    console.log('서버에서 사용자 생성 시도:', userId, userData);
    
    // users 테이블에 사용자 추가 (서비스 롤 사용)
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        id: userId,
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        is_admin: userData.is_admin || false,
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

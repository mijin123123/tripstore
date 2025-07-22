import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { createClient } from '@supabase/supabase-js';

// 하드코딩된 백업 값 (환경 변수가 로드되지 않을 경우를 위한)
const FALLBACK_SUPABASE_URL = 'https://ihhnvmzizaiokrfkatwt.supabase.co';
const FALLBACK_SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloaG52bXppemFpb2tyZmthdHd0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzA4ODU5OSwiZXhwIjoyMDY4NjY0NTk5fQ.ub6g81u9-PJKMZp6EKyRyUtFlEiwwXEHqQWSkKUj9WE';

export async function POST(request: Request) {
  try {
    console.log('사용자 API 요청 시작');
    
    // 요청 본문을 로그로 기록 (디버깅용)
    let requestData;
    try {
      const requestText = await request.text();
      console.log('API 요청 본문:', requestText);
      requestData = JSON.parse(requestText);
    } catch (parseError) {
      console.error('JSON 파싱 오류:', parseError);
      return NextResponse.json(
        { error: 'JSON 파싱 오류: ' + (parseError as Error).message },
        { status: 400 }
      );
    }
    
    const { userId, userData } = requestData;
    console.log('요청 데이터:', { userId, userData });
    
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
    
    // 서비스 키 확인 (환경 변수가 없는 경우 폴백 사용)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
    let serviceKey = process.env.SUPABASE_SERVICE_KEY;
    
    // 서비스 키가 없으면 폴백 사용
    if (!serviceKey) {
      console.warn('환경 변수에서 SUPABASE_SERVICE_KEY를 찾을 수 없습니다. 폴백 키를 사용합니다.');
      serviceKey = FALLBACK_SUPABASE_SERVICE_KEY;
    }
    
    console.log('Supabase URL:', supabaseUrl);
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

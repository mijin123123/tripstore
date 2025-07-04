import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { checkAdminPermissionServer } from '@/lib/admin-auth-server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const supabase = createClient();
    
    // 패키지 목록 가져오기
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('패키지 목록 조회 오류:', error);
      return new NextResponse(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('패키지 목록 조회 중 예외 발생:', error);
    return new NextResponse(
      JSON.stringify({ error: '패키지 목록 조회 중 오류가 발생했습니다.' }),
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // 관리자 권한 확인
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: '로그인이 필요합니다.' }),
        { status: 401 }
      );
    }
    
    const isAdmin = await checkAdminPermissionServer(session.user.email);
    
    if (!isAdmin) {
      return new NextResponse(
        JSON.stringify({ error: '관리자 권한이 없습니다.' }),
        { status: 403 }
      );
    }
    
    // 요청 데이터 파싱
    const packageData = await request.json();
    
    // UUID 생성
    const uuid = crypto.randomUUID();
    packageData.id = uuid;
    
    // Supabase에 데이터 삽입
    const { data, error } = await supabase
      .from('packages')
      .insert(packageData)
      .select()
      .single();
    
    if (error) {
      console.error('패키지 생성 오류:', error);
      return new NextResponse(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('패키지 생성 중 예외 발생:', error);
    return new NextResponse(
      JSON.stringify({ error: '패키지 생성 중 오류가 발생했습니다.' }),
      { status: 500 }
    );
  }
}

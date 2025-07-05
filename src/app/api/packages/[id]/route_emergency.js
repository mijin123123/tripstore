import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    console.log('🔵 긴급 패키지 수정 - ID:', id);
    
    // 요청 데이터 파싱
    const packageData = await request.json();
    console.log('📦 수정할 데이터:', packageData);
    
    // id는 변경하지 않음
    delete packageData.id;
    
    // Supabase 클라이언트 생성
    const supabase = createClient();
    
    // 관리자 이메일 하드코딩 (긴급 수정용)
    const ADMIN_EMAIL = 'sonchanmin89@gmail.com';
    
    // 세션 확인 (선택사항)
    const { data: { session } } = await supabase.auth.getSession();
    console.log('세션 이메일:', session?.user?.email);
    
    // 관리자 이메일이 아니면 거부
    if (!session || session.user.email !== ADMIN_EMAIL) {
      return new NextResponse(
        JSON.stringify({ error: '관리자만 수정할 수 있습니다.' }),
        { status: 403 }
      );
    }
    
    // 직접 업데이트 (권한 검사 우회)
    console.log('업데이트 시작...');
    
    // 먼저 존재하는지 확인
    const { data: existing } = await supabase
      .from('packages')
      .select('id')
      .eq('id', id);
    
    console.log('기존 패키지:', existing);
    
    if (!existing || existing.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: '패키지를 찾을 수 없습니다.' }),
        { status: 404 }
      );
    }
    
    // 업데이트 실행
    const { data, error } = await supabase
      .from('packages')
      .update(packageData)
      .eq('id', id)
      .select();
    
    console.log('업데이트 결과:', { data, error });
    
    if (error) {
      console.error('업데이트 오류:', error);
      return new NextResponse(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }
    
    // 성공 응답
    if (data && data.length > 0) {
      console.log('✅ 업데이트 성공');
      return NextResponse.json(data[0]);
    }
    
    // 업데이트 후 재조회
    const { data: updated } = await supabase
      .from('packages')
      .select('*')
      .eq('id', id)
      .single();
    
    console.log('재조회 결과:', updated);
    return NextResponse.json(updated);
    
  } catch (error) {
    console.error('💥 예외 발생:', error);
    return new NextResponse(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('조회 오류:', error);
      return new NextResponse(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('조회 예외:', error);
    return new NextResponse(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const supabase = createClient();
    
    // 관리자 확인
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || session.user.email !== 'sonchanmin89@gmail.com') {
      return new NextResponse(
        JSON.stringify({ error: '관리자만 삭제할 수 있습니다.' }),
        { status: 403 }
      );
    }
    
    const { error } = await supabase
      .from('packages')
      .delete()
      .eq('id', id);
    
    if (error) {
      return new NextResponse(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { checkAdminPermission } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    
    // 관리자 권한 확인
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: '로그인이 필요합니다.' }),
        { status: 401 }
      );
    }
    
    const isAdmin = await checkAdminPermission(session.user.email);
    
    if (!isAdmin) {
      return new NextResponse(
        JSON.stringify({ error: '관리자 권한이 없습니다.' }),
        { status: 403 }
      );
    }
    
    // 요청 데이터 파싱
    const noticeData = await request.json();
    
    // id는 변경하지 않음
    delete noticeData.id;
    
    // Supabase에서 데이터 업데이트
    const { data, error } = await supabase
      .from('notices')
      .update(noticeData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('공지사항 업데이트 오류:', error);
      return new NextResponse(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('공지사항 업데이트 중 예외 발생:', error);
    return new NextResponse(
      JSON.stringify({ error: '공지사항 업데이트 중 오류가 발생했습니다.' }),
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // 관리자 권한 확인
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: '로그인이 필요합니다.' }),
        { status: 401 }
      );
    }
    
    const isAdmin = await checkAdminPermission(session.user.email);
    
    if (!isAdmin) {
      return new NextResponse(
        JSON.stringify({ error: '관리자 권한이 없습니다.' }),
        { status: 403 }
      );
    }
    
    // Supabase에서 데이터 삭제
    const { error } = await supabase
      .from('notices')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('공지사항 삭제 오류:', error);
      return new NextResponse(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('공지사항 삭제 중 예외 발생:', error);
    return new NextResponse(
      JSON.stringify({ error: '공지사항 삭제 중 오류가 발생했습니다.' }),
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const supabase = createClient();
    
    // Supabase에서 특정 공지사항 조회
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('공지사항 조회 오류:', error);
      return new NextResponse(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('공지사항 조회 중 예외 발생:', error);
    return new NextResponse(
      JSON.stringify({ error: '공지사항 조회 중 오류가 발생했습니다.' }),
      { status: 500 }
    );
  }
}

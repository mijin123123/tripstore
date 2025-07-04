import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { checkAdminPermissionServer } from '@/lib/admin-auth-server';

export const dynamic = 'force-dynamic';

// 예약 조회 API (단일 예약 조회)
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
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
    
    const { data, error } = await supabase
      .from('reservations')
      .select('*, packages(title, destination, images)')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('예약 조회 오류:', error);
      return new NextResponse(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }
    
    if (!data) {
      return new NextResponse(
        JSON.stringify({ error: '예약을 찾을 수 없습니다.' }),
        { status: 404 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('예약 조회 중 예외 발생:', error);
    return new NextResponse(
      JSON.stringify({ error: '예약 조회 중 오류가 발생했습니다.' }),
      { status: 500 }
    );
  }
}

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
    const reservationData = await request.json();
    
    // id는 변경하지 않음
    delete reservationData.id;
    
    // Supabase에서 데이터 업데이트
    const { data, error } = await supabase
      .from('reservations')
      .update(reservationData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('예약 업데이트 오류:', error);
      return new NextResponse(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('예약 업데이트 중 예외 발생:', error);
    return new NextResponse(
      JSON.stringify({ error: '예약 업데이트 중 오류가 발생했습니다.' }),
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
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
    
    // 요청 데이터 파싱 (상태 변경 등 부분 업데이트용)
    const updateData = await request.json();
    
    // Supabase에서 데이터 업데이트
    const { data, error } = await supabase
      .from('reservations')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('예약 상태 업데이트 오류:', error);
      return new NextResponse(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('예약 상태 업데이트 중 예외 발생:', error);
    return new NextResponse(
      JSON.stringify({ error: '예약 상태 업데이트 중 오류가 발생했습니다.' }),
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
      .from('reservations')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('예약 삭제 오류:', error);
      return new NextResponse(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('예약 삭제 중 예외 발생:', error);
    return new NextResponse(
      JSON.stringify({ error: '예약 삭제 중 오류가 발생했습니다.' }),
      { status: 500 }
    );
  }
}

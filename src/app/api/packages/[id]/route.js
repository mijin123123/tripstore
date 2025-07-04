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
    const packageData = await request.json();
    
    // id는 변경하지 않음
    delete packageData.id;
    
    // Supabase에서 데이터 업데이트
    const { data, error } = await supabase
      .from('packages')
      .update(packageData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('패키지 업데이트 오류:', error);
      return new NextResponse(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('패키지 업데이트 중 예외 발생:', error);
    return new NextResponse(
      JSON.stringify({ error: '패키지 업데이트 중 오류가 발생했습니다.' }),
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
    
    // 먼저 이 패키지와 관련된 예약이 있는지 확인
    const { data: reservations, error: reservationError } = await supabase
      .from('reservations')
      .select('id')
      .eq('package_id', id);
    
    if (reservationError) {
      console.error('예약 확인 오류:', reservationError);
      return new NextResponse(
        JSON.stringify({ error: reservationError.message }),
        { status: 500 }
      );
    }
    
    if (reservations && reservations.length > 0) {
      return new NextResponse(
        JSON.stringify({ error: '이 패키지에 연결된 예약이 있어 삭제할 수 없습니다.' }),
        { status: 400 }
      );
    }
    
    // Supabase에서 데이터 삭제
    const { error } = await supabase
      .from('packages')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('패키지 삭제 오류:', error);
      return new NextResponse(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('패키지 삭제 중 예외 발생:', error);
    return new NextResponse(
      JSON.stringify({ error: '패키지 삭제 중 오류가 발생했습니다.' }),
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const supabase = createClient();
    
    // Supabase에서 패키지 데이터 조회
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('패키지 조회 오류:', error);
      return new NextResponse(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }
    
    if (!data) {
      return new NextResponse(
        JSON.stringify({ error: '패키지를 찾을 수 없습니다.' }),
        { status: 404 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('패키지 조회 중 예외 발생:', error);
    return new NextResponse(
      JSON.stringify({ error: '패키지 조회 중 오류가 발생했습니다.' }),
      { status: 500 }
    );
  }
}

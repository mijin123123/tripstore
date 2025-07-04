import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { checkAdminPermissionServer } from '@/lib/admin-auth-server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const supabase = createClient();
    
    // 공�??�항 목록 가?�오�?
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('공�??�항 목록 조회 ?�류:', error);
      return new NextResponse(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('공�??�항 목록 조회 �??�외 발생:', error);
    return new NextResponse(
      JSON.stringify({ error: '공�??�항 목록 조회 �??�류가 발생?�습?�다.' }),
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // 관리자 권한 ?�인
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: '로그?�이 ?�요?�니??' }),
        { status: 401 }
      );
    }
    
    const isAdmin = await checkAdminPermissionServer(session.user.email);
    
    if (!isAdmin) {
      return new NextResponse(
        JSON.stringify({ error: '관리자 권한???�습?�다.' }),
        { status: 403 }
      );
    }
    
    // ?�청 ?�이???�싱
    const noticeData = await request.json();
    
    // UUID ?�성
    const uuid = crypto.randomUUID();
    noticeData.id = uuid;
    
    // Supabase???�이???�입
    const { data, error } = await supabase
      .from('notices')
      .insert(noticeData)
      .select()
      .single();
    
    if (error) {
      console.error('공�??�항 ?�성 ?�류:', error);
      return new NextResponse(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('공�??�항 ?�성 �??�외 발생:', error);
    return new NextResponse(
      JSON.stringify({ error: '공�??�항 ?�성 �??�류가 발생?�습?�다.' }),
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = createClient();
    
    // Supabase?�서 공�??�항 조회
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('공�??�항 조회 ?�류:', error);
      return new NextResponse(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('공�??�항 조회 �??�외 발생:', error);
    return new NextResponse(
      JSON.stringify({ error: '공�??�항 조회 �??�류가 발생?�습?�다.' }),
      { status: 500 }
    );
  }
}

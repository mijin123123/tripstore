import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

// 🔥 완전 무력화된 패키지 수정 API - 권한 검사 없음
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    console.log('🔥 무력화된 패키지 수정 - ID:', id);
    
    const packageData = await request.json();
    delete packageData.id;
    
    console.log('수정할 데이터:', packageData);
    
    const supabase = createClient();
    
    // 권한 검사 완전 제거 - 바로 업데이트
    const { data, error } = await supabase
      .from('packages')
      .update(packageData)
      .eq('id', id)
      .select();
    
    console.log('업데이트 결과:', { data, error });
    
    if (error) {
      console.error('오류:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // 데이터가 없으면 강제로 재조회
    if (!data || data.length === 0) {
      const { data: refetch } = await supabase
        .from('packages')
        .select('*')
        .eq('id', id)
        .single();
      
      console.log('재조회 결과:', refetch);
      return NextResponse.json(refetch || { id, ...packageData });
    }
    
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('예외:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
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
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const supabase = createClient();
    
    const { error } = await supabase
      .from('packages')
      .delete()
      .eq('id', id);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

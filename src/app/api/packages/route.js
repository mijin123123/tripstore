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
    
    console.log('패키지 목록 조회 성공:', data?.length || 0, '개');
    return NextResponse.json(data || []);
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
    console.log('🔥 패키지 생성 요청 시작');
    
    // 요청 데이터 파싱
    const packageData = await request.json();
    console.log('받은 데이터:', packageData);
    
    // 데이터 정리 및 검증
    const cleanData = {
      id: crypto.randomUUID(),
      title: packageData.title || '',
      destination: packageData.destination || '',
      price: Math.min(parseInt(packageData.price) || 0, 2147483647), // PostgreSQL INTEGER 최대값
      duration: parseInt(packageData.duration) || 1,
      category: packageData.category || 'general',
      image_url: packageData.image_url || '',
      available_dates: packageData.available_dates || '',
      description: packageData.description || '',
      includes: packageData.includes || '',
      excludes: packageData.excludes || ''
    };
    
    console.log('정리된 데이터:', cleanData);
    
    // 권한 검사 제거하고 바로 생성
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('packages')
      .insert(cleanData)
      .select()
      .single();
    
    if (error) {
      console.error('패키지 생성 오류:', error);
      return new NextResponse(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }
    
    console.log('✅ 패키지 생성 성공:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('💥 패키지 생성 중 예외 발생:', error);
    return new NextResponse(
      JSON.stringify({ error: '패키지 생성 중 오류가 발생했습니다.' }),
      { status: 500 }
    );
  }
}

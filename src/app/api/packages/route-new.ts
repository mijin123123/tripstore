import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { mockPackages } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('API: 패키지 목록 조회 요청 받음');
    
    // 서버사이드에서 직접 Supabase 클라이언트 생성
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('Supabase 환경변수가 없어 Mock 데이터를 사용합니다.');
      return NextResponse.json(mockPackages);
    }
    
    // Supabase에서 데이터 조회 시도
    try {
      console.log('Supabase에서 패키지 데이터 조회 시도...');
      
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const { data: packages, error } = await supabase
        .from('packages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Supabase 오류:', error);
        throw error;
      }
      
      if (packages && packages.length > 0) {
        console.log(`API: ${packages.length}개의 패키지 조회 성공 (Supabase)`);
        return NextResponse.json(packages);
      } else {
        console.log('Supabase에서 데이터가 없어 Mock 데이터를 사용합니다.');
        return NextResponse.json(mockPackages);
      }
    } catch (supabaseError) {
      console.error('Supabase 연결 실패, Mock 데이터로 대체:', supabaseError);
      console.log('Mock 데이터 개수:', mockPackages.length);
      return NextResponse.json(mockPackages);
    }
    
  } catch (error) {
    console.error('API 오류:', error);
    // 에러가 발생해도 Mock 데이터를 반환하여 사이트가 동작하도록 함
    console.log('최종 fallback: Mock 데이터 사용');
    return NextResponse.json(mockPackages);
  }
}

export async function POST(request: Request) {
  try {
    const packageData = await request.json();
    
    // 서버사이드에서 직접 Supabase 클라이언트 생성
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data, error } = await supabase
      .from('packages')
      .insert([packageData])
      .select()
      .single();
    
    if (error) {
      console.error('패키지 생성 오류:', error);
      return NextResponse.json(
        { error: 'Failed to create package' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('POST 요청 오류:', error);
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}

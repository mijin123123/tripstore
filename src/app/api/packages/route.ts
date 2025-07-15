import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Edge runtime에서 nodejs로 변경
export const runtime = 'nodejs';

// 패키지 목록 조회 API
export async function GET(request: NextRequest) {
  try {
    console.log('API: 패키지 목록 조회 요청 받음');
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    let query = supabase.from('packages').select('*', { count: 'exact' });
    
    // 카테고리 필터
    if (category) {
      query = query.eq('category', category);
    }
    
    // 검색 필터
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%`);
    }
    
    // 페이지네이션
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    query = query.order('created_at', { ascending: false }).range(from, to);
    
    const { data: packages, error, count } = await query;
    
    if (error) {
      console.error('패키지 조회 오류:', error);
      return NextResponse.json(
        { error: '패키지 조회 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
    
    const totalPages = count ? Math.ceil(count / limit) : 0;
    
    console.log(`패키지 목록 조회 성공: ${packages?.length || 0}개`);
    return NextResponse.json({
      packages: packages || [],
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count || 0,
        itemsPerPage: limit
      }
    });
    
  } catch (error) {
    console.error('패키지 목록 조회 API 오류:', error);
    return NextResponse.json(
      { error: '패키지 목록 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 새 패키지 생성 API
export async function POST(request: NextRequest) {
  try {
    console.log('API: 새 패키지 생성 요청 받음');
    
    const packageData = await request.json();
    
    // 필수 필드 검증
    if (!packageData.title || !packageData.price) {
      return NextResponse.json(
        { error: '제목과 가격은 필수 입력 항목입니다.' },
        { status: 400 }
      );
    }
    
    // 패키지 생성
    const { data: newPackage, error } = await supabase
      .from('packages')
      .insert([packageData])
      .select()
      .single();
    
    if (error) {
      console.error('패키지 생성 오류:', error);
      return NextResponse.json(
        { error: '패키지 생성 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
    
    console.log(`새 패키지 생성 성공: ${newPackage.title}`);
    return NextResponse.json(newPackage, { status: 201 });
    
  } catch (error) {
    console.error('패키지 생성 API 오류:', error);
    return NextResponse.json(
      { error: '패키지 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

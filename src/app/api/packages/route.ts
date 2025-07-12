import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { mockPackages } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

// Supabase 연결 재시도 함수 (더 강화된 버전)
async function connectToSupabase(retries = 5) { // 재시도 횟수 증가
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase 환경변수가 설정되지 않았습니다.');
  }

  console.log('🔗 Supabase 연결 정보:');
  console.log('URL:', supabaseUrl);
  console.log('KEY 존재:', !!supabaseKey);

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'cache-control': 'no-cache'
      }
    }
  });

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🚀 Supabase 연결 시도 ${attempt}/${retries}...`);
      
      // 연결 테스트를 위한 간단한 쿼리 먼저 실행
      const { error: pingError } = await supabase
        .from('packages')
        .select('count', { count: 'exact', head: true });
        
      if (pingError && attempt < retries) {
        console.warn(`⚠️ 시도 ${attempt} 핑 실패:`, pingError);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        continue;
      }
      
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error(`❌ 시도 ${attempt} 실패:`, error);
        if (attempt === retries) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // 지수백오프
        continue;
      }

      console.log(`✅ Supabase 연결 성공! ${data?.length || 0}개 패키지 조회`);
      console.log(`📊 전체 패키지: ${data?.length}개 (DB에서 직접 조회)`);
      return data || [];
    } catch (err) {
      console.error(`💥 시도 ${attempt} 오류:`, err);
      if (attempt === retries) throw err;
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}

export async function GET() {
  try {
    console.log('🌟 === API: 패키지 목록 조회 요청 받음 ===');
    console.log('🔧 환경변수 상태:');
    console.log('- NEXT_PUBLIC_SUPABASE_URL:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    
    // Supabase 우선 연결 시도 (재시도 포함)
    try {
      const packages = await connectToSupabase(5); // 5번 재시도
      
      if (packages && packages.length > 0) {
        console.log(`🎉 SUCCESS: ${packages.length}개의 패키지 반환 (Supabase DB)`);
        console.log(`📈 API 응답 크기: ${JSON.stringify(packages).length} bytes`);
        
        // 패키지 데이터 샘플 로깅
        console.log('📦 첫 번째 패키지 샘플:', {
          id: packages[0]?.id,
          title: packages[0]?.title,
          category: packages[0]?.category,
          price: packages[0]?.price
        });
        
        return NextResponse.json(packages, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Content-Type': 'application/json'
          }
        });
      } else {
        console.log('⚠️ Supabase에서 데이터가 없음 - Mock 데이터로 fallback');
        console.log(`📦 Mock 데이터 개수: ${mockPackages.length}개`);
        return NextResponse.json(mockPackages, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (supabaseError) {
      console.error('❌ Supabase 연결 최종 실패:', supabaseError);
      console.log(`📦 Fallback: Mock 데이터 ${mockPackages.length}개 반환`);
      console.log('📦 Mock 데이터 샘플:', {
        id: mockPackages[0]?.id,
        title: mockPackages[0]?.title,
        total: mockPackages.length
      });
      
      return NextResponse.json(mockPackages, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Content-Type': 'application/json'
        }
      });
    }
    
  } catch (error) {
    console.error('💥 API 전체 오류:', error);
    // 에러가 발생해도 Mock 데이터를 반환하여 사이트가 동작하도록 함
    console.log('🆘 최종 fallback: Mock 데이터 사용');
    console.log(`📦 최종 Mock 데이터 개수: ${mockPackages.length}개`);
    return NextResponse.json(mockPackages, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    });
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

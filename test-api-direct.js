const { createClient } = require('@supabase/supabase-js');

// 환경 변수 직접 설정
const supabaseUrl = 'https://qgegpackzjjyceraqrny.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnZWdwYWNrempqeWNlcmFxcm55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNjUwMDMsImV4cCI6MjA2NzY0MTAwM30.MFLBWRg0i-rh2yfUdl51wsnvGGqBLOWUjsIks73vtO0';

async function testSupabaseConnection() {
  console.log('=== Supabase 직접 연결 테스트 ===');
  
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false
    },
    db: {
      schema: 'public'
    }
  });

  try {
    console.log('Supabase 연결 시도...');
    
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase 오류:', error);
      return;
    }

    console.log(`✅ 성공! ${data?.length || 0}개 패키지 조회됨`);
    
    if (data && data.length > 0) {
      console.log('\n=== 처음 3개 패키지 샘플 ===');
      data.slice(0, 3).forEach((pkg, idx) => {
        console.log(`${idx + 1}. ${pkg.title} (${pkg.category})`);
        console.log(`   가격: ${pkg.price?.toLocaleString() || 'N/A'}원`);
        console.log(`   생성일: ${pkg.created_at}`);
        console.log('');
      });
      
      console.log(`\n전체 패키지 수: ${data.length}개`);
      
      // 카테고리별 분포 확인
      const categories = {};
      data.forEach(pkg => {
        categories[pkg.category] = (categories[pkg.category] || 0) + 1;
      });
      
      console.log('\n=== 카테고리별 분포 ===');
      Object.entries(categories).forEach(([category, count]) => {
        console.log(`${category}: ${count}개`);
      });
    } else {
      console.log('❌ 패키지 데이터가 없습니다.');
    }
    
  } catch (err) {
    console.error('❌ 연결 실패:', err);
  }
}

testSupabaseConnection();

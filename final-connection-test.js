const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

console.log('=== 최종 Supabase 연결 테스트 ===\n');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function finalTest() {
  try {
    console.log('1. 연결 정보:');
    console.log('   URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('   비밀번호 변경됨:', process.env.DATABASE_URL?.includes('dkdlfltm1640') ? '✅' : '❌');
    
    console.log('\n2. packages 테이블 전체 데이터 조회:');
    const { data: packages, error } = await supabase
      .from('packages')
      .select('*')
      .order('id');
    
    if (error) {
      console.error('❌ 오류:', error.message);
      return;
    }
    
    console.log(`✅ 총 ${packages.length}개의 패키지 발견:`);
    packages.forEach((pkg, index) => {
      console.log(`   ${index + 1}. ${pkg.title} (${pkg.destination}) - ${pkg.price?.toLocaleString()}원`);
    });
    
    console.log('\n3. API 형태로 데이터 변환 테스트:');
    const featured = packages.slice(0, 3).map(pkg => ({
      id: pkg.id,
      name: pkg.title,
      description: pkg.description,
      price: pkg.price?.toLocaleString() || "0",
      rating: "4.5",
      image: pkg.image_url
    }));
    
    console.log('추천 패키지:', featured.map(p => p.name));
    
    console.log('\n🎉 모든 테스트 통과! 데이터베이스 연결이 정상적으로 작동합니다.');
    
  } catch (err) {
    console.error('❌ 테스트 실패:', err.message);
  }
}

finalTest();

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkPackages() {
  try {
    // 먼저 테이블 구조 확인
    const { data: tableInfo, error: tableError } = await supabase
      .from('packages')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.error('❌ 테이블 조회 실패:', tableError);
      return;
    }
    
    console.log('🔍 첫 번째 레코드 구조:', tableInfo[0] ? Object.keys(tableInfo[0]) : '레코드 없음');
    
    // 전체 레코드 수 확인
    const { count, error: countError } = await supabase
      .from('packages')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ 개수 조회 실패:', countError);
      return;
    }
    
    console.log('✅ 전체 패키지 개수:', count);
    
    // 실제 데이터 조회 (올바른 컬럼명 사용)
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .order('id')
      .limit(10);
    
    if (error) {
      console.error('❌ 패키지 조회 실패:', error);
      return;
    }
    
    console.log('');
    console.log('🌍 샘플 패키지 (처음 5개):');
    data.slice(0, 5).forEach((pkg, index) => {
      console.log(`   ${index + 1}. ${JSON.stringify(pkg, null, 2)}`);
    });
    
  } catch (err) {
    console.error('❌ 오류 발생:', err);
  }
}

checkPackages();

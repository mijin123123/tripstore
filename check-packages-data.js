// 패키지 데이터 확인
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPackages() {
  try {
    console.log('=== 패키지 데이터 확인 ===');
    
    // 패키지 수 확인
    const { count, error: countError } = await supabase
      .from('packages')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('패키지 수 확인 오류:', countError);
      return;
    }
    
    console.log(`총 패키지 수: ${count}`);
    
    // 실제 패키지 데이터 확인
    const { data: packages, error } = await supabase
      .from('packages')
      .select('*')
      .limit(3);
    
    if (error) {
      console.error('패키지 데이터 조회 오류:', error);
      return;
    }
    
    if (packages && packages.length > 0) {
      console.log('\n샘플 패키지 데이터:');
      packages.forEach((pkg, index) => {
        console.log(`${index + 1}. ${pkg.title} - ${pkg.price}원`);
        console.log(`   위치: ${pkg.location}`);
        console.log(`   기간: ${pkg.duration}`);
        console.log(`   특가: ${pkg.isonsale ? '예' : '아니오'}`);
        console.log('');
      });
    } else {
      console.log('패키지 데이터가 없습니다. 샘플 데이터를 추가해야 합니다.');
    }
    
  } catch (err) {
    console.error('패키지 확인 중 오류:', err);
  }
}

checkPackages();

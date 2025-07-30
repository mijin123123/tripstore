// 패키지 목록 확인 스크립트
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase 클라이언트 생성
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('환경 변수가 설정되지 않았습니다.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPackages() {
  try {
    console.log('패키지 데이터 조회 중...');
    
    // 모든 패키지 조회
    const { data: allPackages, error: allError } = await supabase
      .from('packages')
      .select('*');
      
    if (allError) {
      console.error('패키지 조회 중 오류 발생:', allError);
      return;
    }
    
    console.log(`총 패키지 수: ${allPackages.length}`);
    
    // 지역별 패키지 수 집계
    const regions = {};
    const types = {};
    
    allPackages.forEach(pkg => {
      // 지역별 집계
      if (pkg.region) {
        regions[pkg.region] = (regions[pkg.region] || 0) + 1;
      }
      
      // 타입별 집계
      if (pkg.type) {
        types[pkg.type] = (types[pkg.type] || 0) + 1;
      }
    });
    
    console.log('\n=== 지역별 패키지 수 ===');
    Object.entries(regions).forEach(([region, count]) => {
      console.log(`${region}: ${count}개`);
    });
    
    console.log('\n=== 타입별 패키지 수 ===');
    Object.entries(types).forEach(([type, count]) => {
      console.log(`${type}: ${count}개`);
    });
    
    // 동남아 패키지 확인
    const southeastAsiaPackages = allPackages.filter(pkg => 
      pkg.type === 'overseas' && 
      (pkg.region === 'southeast-asia' || pkg.region_ko === '동남아')
    );
    
    console.log('\n=== 동남아 패키지 ===');
    console.log(`동남아 패키지 수: ${southeastAsiaPackages.length}개`);
    southeastAsiaPackages.forEach(pkg => {
      console.log(`- ${pkg.title || pkg.name} (ID: ${pkg.id})`);
    });
    
  } catch (err) {
    console.error('스크립트 실행 중 예외 발생:', err);
  }
}

checkPackages();

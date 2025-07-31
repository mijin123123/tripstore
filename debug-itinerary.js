const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function debugItinerary() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase 환경변수가 설정되지 않았습니다.');
    return;
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // 일본 패키지들의 일정 데이터 확인
    const { data, error } = await supabase
      .from('packages')
      .select('id, title, itinerary, region')
      .eq('region', 'japan')
      .limit(5);
    
    if (error) {
      console.error('데이터 조회 오류:', error);
      return;
    }
    
    console.log('일본 패키지 일정 데이터:');
    data.forEach((pkg, index) => {
      console.log(`\n${index + 1}. 패키지: ${pkg.title} (ID: ${pkg.id})`);
      console.log('일정 타입:', typeof pkg.itinerary);
      console.log('일정 길이:', pkg.itinerary ? pkg.itinerary.length : 'null');
      
      if (pkg.itinerary) {
        console.log('일정 내용 (첫 200자):', pkg.itinerary.substring(0, 200));
        
        // 마크다운 이미지 패턴 검색
        const imageMatches = pkg.itinerary.match(/!\[.*?\]\(.*?\)/g);
        if (imageMatches) {
          console.log('발견된 이미지 개수:', imageMatches.length);
          imageMatches.forEach((match, i) => {
            console.log(`  이미지 ${i + 1}: ${match.substring(0, 100)}...`);
          });
        } else {
          console.log('이미지 없음');
        }
      } else {
        console.log('일정 데이터 없음');
      }
    });
  } catch (error) {
    console.error('스크립트 실행 오류:', error);
  }
}

debugItinerary();

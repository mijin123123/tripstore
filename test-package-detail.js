const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testSpecificPackage() {
  try {
    // 첫 번째 패키지 ID 가져오기
    const { data: packages, error: listError } = await supabase
      .from('packages')
      .select('id, title')
      .limit(1);
    
    if (listError || !packages || packages.length === 0) {
      console.error('패키지 목록 조회 실패:', listError);
      return;
    }
    
    const packageId = packages[0].id;
    console.log('테스트할 패키지 ID:', packageId);
    console.log('패키지 제목:', packages[0].title);
    
    // 해당 패키지의 상세 정보 조회
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('id', packageId)
      .single();
    
    if (error) {
      console.error('패키지 상세 조회 실패:', error);
      return;
    }
    
    console.log('\n=== 패키지 상세 정보 ===');
    console.log('ID:', data.id);
    console.log('제목:', data.title);
    console.log('타입:', data.type);
    console.log('지역:', data.region);
    console.log('메인 이미지:', data.image ? data.image.substring(0, 100) + '...' : '없음');
    console.log('추가 이미지 개수:', data.images ? data.images.length : 0);
    
    if (data.images && data.images.length > 0) {
      console.log('\n=== 추가 이미지 목록 ===');
      data.images.forEach((img, i) => {
        console.log(`${i + 1}:`, img);
      });
    }
    
    // API 형태로 매핑 확인
    const mappedData = {
      ...data,
      title: data.title || data.name,
      regionKo: data.region_ko || data.region,
      images: Array.isArray(data.images) ? data.images : [],
      highlights: Array.isArray(data.highlights) ? data.highlights : [],
    };
    
    console.log('\n=== 매핑된 데이터 ===');
    console.log('매핑된 제목:', mappedData.title);
    console.log('매핑된 지역:', mappedData.regionKo);
    console.log('매핑된 메인 이미지:', mappedData.image ? mappedData.image.substring(0, 100) + '...' : '없음');
    console.log('매핑된 추가 이미지 개수:', mappedData.images.length);
    
  } catch (err) {
    console.error('Exception:', err);
  }
}

testSpecificPackage();

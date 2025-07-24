const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function checkPackageImages() {
  try {
    const { data, error } = await supabase
      .from('packages')
      .select('images')
      .eq('id', 'OVE-EU-514125');
      
    if (error) {
      console.error('오류:', error);
      return;
    }
    
    if (data && data.length > 0) {
      const pkg = data[0];
      console.log('images 배열 상세 정보:');
      console.log('타입:', typeof pkg.images);
      console.log('Array인가?', Array.isArray(pkg.images));
      console.log('길이:', pkg.images ? pkg.images.length : 0);
      console.log('Raw 데이터:', JSON.stringify(pkg.images, null, 2).substring(0, 500) + '...');
      
      if (pkg.images && Array.isArray(pkg.images)) {
        pkg.images.forEach((img, index) => {
          console.log(`--- 이미지 ${index + 1} ---`);
          console.log('타입:', typeof img);
          console.log('길이:', img ? img.length : 0);
          if (img) {
            if (img.startsWith('data:image/')) {
              console.log('Base64 이미지');
            } else if (img.startsWith('http')) {
              console.log('URL 이미지:', img);
            } else {
              console.log('기타 형태:', img.substring(0, 50) + '...');
            }
          }
        });
      }
    } else {
      console.log('패키지를 찾을 수 없습니다.');
    }
  } catch (err) {
    console.error('실행 중 오류:', err);
  }
}

checkPackageImages();

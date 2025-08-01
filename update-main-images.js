const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function updateMainImages() {
  try {
    console.log('메인 이미지 업데이트 시작...');
    
    // 플레이스홀더 이미지를 사용하는 패키지들 찾기
    const { data: packages, error } = await supabase
      .from('packages')
      .select('id, title, image, images')
      .like('image', '%placehold.co%');
    
    if (error) {
      console.error('패키지 조회 실패:', error);
      return;
    }
    
    console.log(`플레이스홀더 이미지를 사용하는 패키지: ${packages.length}개`);
    
    for (const pkg of packages) {
      if (pkg.images && pkg.images.length > 0 && pkg.images[0]) {
        console.log(`\n패키지 "${pkg.title}" 메인 이미지 업데이트중...`);
        console.log(`기존 메인 이미지: ${pkg.image.substring(0, 50)}...`);
        console.log(`새 메인 이미지: ${pkg.images[0].substring(0, 50)}...`);
        
        const { error: updateError } = await supabase
          .from('packages')
          .update({ image: pkg.images[0] })
          .eq('id', pkg.id);
        
        if (updateError) {
          console.error(`패키지 ${pkg.id} 업데이트 실패:`, updateError);
        } else {
          console.log('✅ 업데이트 완료');
        }
      } else {
        console.log(`\n패키지 "${pkg.title}": 업로드된 이미지가 없어 건너뜀`);
      }
    }
    
    console.log('\n메인 이미지 업데이트 완료!');
  } catch (err) {
    console.error('Exception:', err);
  }
}

updateMainImages();

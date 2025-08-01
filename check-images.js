const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkPackageImages() {
  try {
    const { data, error } = await supabase
      .from('packages')
      .select('id, title, image, images')
      .limit(5);
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    console.log('=== 패키지 이미지 정보 ===');
    data.forEach((pkg, index) => {
      console.log(`${index + 1}. ${pkg.title}`);
      console.log(`   ID: ${pkg.id}`);
      console.log(`   메인 이미지: ${pkg.image ? pkg.image.substring(0, 100) + '...' : '없음'}`);
      console.log(`   추가 이미지: ${pkg.images ? `배열 길이 ${pkg.images.length}` : '없음'}`);
      if (pkg.images && pkg.images.length > 0) {
        pkg.images.forEach((img, i) => {
          console.log(`     ${i + 1}: ${typeof img === 'string' ? img.substring(0, 100) + '...' : img}`);
        });
      }
      console.log('');
    });
  } catch (err) {
    console.error('Exception:', err);
  }
}

checkPackageImages();

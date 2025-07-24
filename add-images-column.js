const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

let supabaseUrl, supabaseKey;
try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const lines = envContent.split('\n');
  supabaseUrl = lines.find(line => line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')).split('=')[1];
  supabaseKey = lines.find(line => line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')).split('=')[1];
} catch (error) {
  console.error('환경 변수 파일을 읽을 수 없습니다:', error);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addImagesColumn() {
  try {
    console.log('packages 테이블에 images 컬럼 추가 중...');
    
    // 1. images 컬럼 추가
    const { error: alterError } = await supabase.rpc('exec_sql', { 
      sql: 'ALTER TABLE packages ADD COLUMN IF NOT EXISTS images JSONB;' 
    });
    
    if (alterError) {
      console.error('컬럼 추가 오류:', alterError);
      return;
    }
    
    console.log('images 컬럼 추가 완료');
    
    // 2. 기존 데이터 업데이트
    console.log('기존 데이터 업데이트 중...');
    
    const { error: updateError } = await supabase.rpc('exec_sql', { 
      sql: `UPDATE packages 
            SET images = CASE 
              WHEN image IS NOT NULL AND image != '' THEN jsonb_build_array(image)
              ELSE '[]'::jsonb
            END
            WHERE images IS NULL;` 
    });
    
    if (updateError) {
      console.error('데이터 업데이트 오류:', updateError);
      return;
    }
    
    console.log('기존 데이터 업데이트 완료');
    
    // 3. 결과 확인
    const { data, error } = await supabase
      .from('packages')
      .select('id, title, image, images')
      .eq('id', 'OVE-EU-514125')
      .single();
    
    if (error) {
      console.error('조회 오류:', error);
      return;
    }
    
    console.log('업데이트 결과:');
    console.log('ID:', data.id);
    console.log('Title:', data.title);
    console.log('Image length:', data.image ? data.image.length : 'null');
    console.log('Images:', data.images);
    
  } catch (err) {
    console.error('예외 발생:', err);
  }
}

addImagesColumn();

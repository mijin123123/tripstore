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

async function checkPackageStructure() {
  try {
    console.log('패키지 OVE-EU-514125의 데이터 조회 중...');
    
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('id', 'OVE-EU-514125')
      .single();
    
    if (error) {
      console.error('오류:', error);
      return;
    }
    
    if (data) {
      console.log('\n=== 패키지 데이터 구조 ===');
      console.log('ID:', data.id);
      console.log('제목:', data.title);
      
      // 이미지 관련 필드들 확인
      console.log('\n=== 이미지 관련 필드 ===');
      console.log('image (메인 이미지):');
      console.log('  - 타입:', typeof data.image);
      console.log('  - 값:', data.image ? `${data.image.substring(0, 100)}...` : 'null');
      console.log('  - 길이:', data.image ? data.image.length : 0);
      
      console.log('images (추가 이미지 배열):');
      console.log('  - 타입:', typeof data.images);
      console.log('  - 값:', data.images);
      console.log('  - 배열인가?:', Array.isArray(data.images));
      
      // 모든 필드 나열
      console.log('\n=== 모든 필드 목록 ===');
      Object.keys(data).sort().forEach(key => {
        console.log(`${key}: ${typeof data[key]}`);
      });
      
    } else {
      console.log('패키지를 찾을 수 없습니다.');
    }
  } catch (err) {
    console.error('예외 발생:', err);
  }
}

checkPackageStructure();

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

async function checkPackageData() {
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
      console.log('패키지 데이터:');
      console.log('ID:', data.id);
      console.log('제목:', data.title);
      console.log('메인 이미지 길이:', data.image ? data.image.length : 'null');
      console.log('메인 이미지 시작:', data.image ? data.image.substring(0, 50) + '...' : 'null');
      
      // 모든 컬럼 출력
      console.log('\n모든 컬럼:');
      Object.keys(data).forEach(key => {
        if (key.includes('image') || key === 'images') {
          console.log(key + ':', typeof data[key], data[key] ? (typeof data[key] === 'string' ? data[key].substring(0, 50) + '...' : data[key]) : 'null');
        } else {
          console.log(key + ':', typeof data[key], data[key]);
        }
      });
    } else {
      console.log('패키지를 찾을 수 없습니다.');
    }
  } catch (err) {
    console.error('예외 발생:', err);
  }
}

checkPackageData();

const { createClient } = require('@supabase/supabase-js');

// 환경 변수 직접 설정
const supabaseUrl = 'https://qgegpackzjjyceraqrny.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnZWdwYWNrempqeWNlcmFxcm55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNjUwMDMsImV4cCI6MjA2NzY0MTAwM30.MFLBWRg0i-rh2yfUdl51wsnvGGqBLOWUjsIks73vtO0';

async function generateMockDataFromSupabase() {
  console.log('=== Supabase에서 Mock 데이터 생성 ===');
  
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase 오류:', error);
      return;
    }

    console.log(`✅ ${data?.length || 0}개 패키지 조회됨`);
    
    if (data && data.length > 0) {
      const mockData = `// Mock 데이터베이스 - 실제 데이터베이스 연결이 안 될 때 임시로 사용 (해외여행 패키지)
export const mockPackages = ${JSON.stringify(data, null, 2)};`;
      
      console.log('\n=== 생성된 Mock 데이터 (처음 100자) ===');
      console.log(mockData.substring(0, 100) + '...');
      
      // 파일로 저장
      const fs = require('fs');
      fs.writeFileSync('src/lib/mock-data-new.ts', mockData);
      console.log('\n✅ src/lib/mock-data-new.ts 파일로 저장됨');
    }
    
  } catch (err) {
    console.error('❌ 연결 실패:', err);
  }
}

generateMockDataFromSupabase();

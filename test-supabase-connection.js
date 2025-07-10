const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

console.log('환경 변수 확인:');
console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testConnection() {
  try {
    console.log('\n1. Supabase 연결 테스트...');
    
    // 모든 컬럼을 가져와서 테이블 구조 확인
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ packages 테이블 접근 실패:', error.message);
      
      // 테이블이 없을 수 있으니 다른 테이블들 확인
      console.log('\n다른 테이블들 확인...');
      const tables = ['users', 'reservations', 'auth.users'];
      for (const table of tables) {
        try {
          const { data: testData, error: testError } = await supabase
            .from(table)
            .select('*')
            .limit(1);
          if (!testError) {
            console.log(`✅ ${table} 테이블 존재, 데이터:`, testData);
          } else {
            console.log(`❌ ${table} 테이블 오류:`, testError.message);
          }
        } catch (e) {
          console.log(`❌ ${table} 테이블 접근 불가:`, e.message);
        }
      }
    } else {
      console.log('✅ packages 테이블 연결 성공!');
      console.log('컬럼 구조:', Object.keys(data[0] || {}));
      console.log('첫 번째 데이터:', data[0]);
    }
    
  } catch (err) {
    console.error('❌ 전체 연결 테스트 실패:', err.message);
  }
}

testConnection();

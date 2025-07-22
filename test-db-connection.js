// 데이터베이스 연결 테스트 스크립트
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('환경 변수가 설정되지 않았습니다. NEXT_PUBLIC_SUPABASE_URL와 NEXT_PUBLIC_SUPABASE_ANON_KEY를 확인해주세요.');
  process.exit(1);
}

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey.substring(0, 10) + '...');

async function testConnection() {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 데이터베이스 연결 테스트
    console.log('데이터베이스 연결 테스트 중...');
    const { data, error } = await supabase.from('users').select('*', { count: 'exact' });
    
    if (error) {
      throw error;
    }
    
    console.log('데이터베이스 연결 성공!');
    console.log('users 테이블 레코드 수:', data.length);
    
    // 사용자 목록 조회
    console.log('\n사용자 목록 조회 중...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(5);
    
    if (usersError) {
      throw usersError;
    }
    
    console.log(`사용자 목록 (최대 5명):`);
    console.table(users);
    
    return { success: true };
  } catch (error) {
    console.error('데이터베이스 연결 오류:', error);
    return { success: false, error };
  }
}

testConnection()
  .then(result => {
    if (result.success) {
      console.log('\n테스트 완료: 데이터베이스가 정상적으로 연결되었습니다.');
    } else {
      console.error('\n테스트 실패: 데이터베이스 연결에 문제가 있습니다.');
    }
  })
  .catch(err => {
    console.error('테스트 실행 중 오류 발생:', err);
  });

// 회원 데이터 조회 스크립트
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// 환경 변수에서 Supabase 정보 가져오기
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 서비스 키는 환경 변수에 있거나 직접 입력해야 합니다
// ⚠️ 주의: 서비스 키는 민감한 정보이므로 코드에 직접 입력하지 마세요
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

async function checkUsers() {
  console.log('Supabase URL:', supabaseUrl);
  console.log('Anon Key 확인:', supabaseAnonKey ? '설정됨' : '설정되지 않음');
  
  // 서비스 키가 있으면 서비스 롤로, 없으면 익명 키로 접속
  const supabase = createClient(
    supabaseUrl, 
    supabaseServiceKey || supabaseAnonKey
  );
  
  try {
    console.log('사용자 데이터를 조회합니다...');
    
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    console.log(`총 ${users.length}명의 사용자가 있습니다:`);
    
    users.forEach((user, index) => {
      console.log(`\n사용자 #${index + 1}:`);
      console.log(`ID: ${user.id}`);
      console.log(`이름: ${user.name}`);
      console.log(`이메일: ${user.email}`);
      console.log(`전화번호: ${user.phone}`);
      console.log(`관리자 여부: ${user.is_admin ? 'O' : 'X'}`);
      console.log(`가입일: ${new Date(user.created_at).toLocaleString()}`);
      console.log('-----------------------------------');
    });
    
  } catch (error) {
    console.error('오류 발생:', error);
  }
}

// 실행
checkUsers();

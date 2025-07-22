// 서비스 키로 사용자 생성 테스트
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('환경 변수가 설정되지 않았습니다.');
  process.exit(1);
}

async function testCreateUserWithServiceRole() {
  try {
    // 서비스 롤을 사용하는 Admin Supabase 클라이언트 생성
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);
    
    // 임의의 UUID 생성
    const userId = uuidv4();
    
    // 사용자 데이터 준비
    const userData = {
      id: userId,  // UUID 형식
      email: `test-${Date.now()}@example.com`,
      name: '테스트 사용자',
      phone: '01012345678',
      is_admin: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('사용자 생성 테스트:', userData);
    
    // users 테이블에 사용자 추가
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert(userData)
      .select();
    
    if (error) {
      console.error('사용자 생성 오류:', error);
      return { success: false, error };
    }
    
    console.log('사용자 생성 성공:', data);
    
    // 생성된 사용자 조회 테스트
    const { data: fetchedUser, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (fetchError) {
      console.error('사용자 조회 오류:', fetchError);
      return { success: false, error: fetchError };
    }
    
    console.log('사용자 조회 성공:', fetchedUser);
    
    return { success: true, user: fetchedUser };
  } catch (error) {
    console.error('테스트 오류:', error);
    return { success: false, error };
  }
}

// npm install uuid가 필요할 수 있음
testCreateUserWithServiceRole()
  .then(result => {
    if (result.success) {
      console.log('테스트 성공!');
    } else {
      console.error('테스트 실패!');
    }
  });

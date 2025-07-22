// 인증 상태 변경 테스트 스크립트
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('환경 변수가 설정되지 않았습니다.');
  process.exit(1);
}

async function testAuth() {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('로그인 테스트 중...');
    
    // 테스트 이메일과 비밀번호를 사용하여 로그인 (실제 값으로 변경 필요)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',  // 테스트용 이메일
      password: 'password123'     // 테스트용 비밀번호
    });
    
    if (error) {
      console.error('로그인 실패:', error.message);
      return { success: false, error };
    }
    
    console.log('로그인 성공!');
    console.log('사용자 ID:', data.user.id);
    
    // 사용자 메타데이터 조회
    console.log('사용자 메타데이터:', data.user.user_metadata);
    
    // users 테이블에서 사용자 정보 조회
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    if (userError) {
      console.error('사용자 정보 조회 실패:', userError.message);
    } else {
      console.log('데이터베이스 사용자 정보:', userData);
    }
    
    return { success: true, user: data.user };
  } catch (error) {
    console.error('테스트 오류:', error);
    return { success: false, error };
  }
}

testAuth()
  .then(result => {
    if (result.success) {
      console.log('인증 테스트 성공!');
    } else {
      console.error('인증 테스트 실패!');
    }
  });

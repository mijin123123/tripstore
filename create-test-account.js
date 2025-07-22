// 테스트 계정 생성 스크립트
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !serviceKey) {
  console.error('환경 변수가 설정되지 않았습니다.');
  process.exit(1);
}

// 테스트용 계정 정보
const testEmail = `test-${Date.now()}@example.com`;
const testPassword = 'Test123!';
const testName = '테스트유저';
const testPhone = '01012345678';

async function createTestAccount() {
  try {
    // 1. 일반 클라이언트로 회원가입
    console.log('테스트 계정 생성 시작:', testEmail);
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          name: testName,
          phone: testPhone
        }
      }
    });
    
    if (error) {
      console.error('회원가입 실패:', error);
      return;
    }
    
    console.log('Auth 회원가입 성공!');
    console.log('사용자 ID:', data.user.id);
    
    // 2. 서비스 키를 사용하여 users 테이블에 데이터 직접 추가
    console.log('서비스 키를 사용하여 users 테이블에 데이터 추가 중...');
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);
    
    const userData = {
      id: data.user.id,
      email: testEmail,
      name: testName,
      phone: testPhone,
      is_admin: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data: dbData, error: dbError } = await supabaseAdmin
      .from('users')
      .insert(userData)
      .select();
      
    if (dbError) {
      console.error('users 테이블 데이터 추가 실패:', dbError);
    } else {
      console.log('users 테이블 데이터 추가 성공:', dbData);
    }
    
    // 3. 로그인 테스트
    console.log('생성된 계정으로 로그인 테스트 중...');
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });
    
    if (signInError) {
      console.error('로그인 테스트 실패:', signInError);
    } else {
      console.log('로그인 테스트 성공!');
    }
    
    // 성공 정보 출력
    console.log('\n===== 테스트 계정 정보 =====');
    console.log('이메일:', testEmail);
    console.log('비밀번호:', testPassword);
    console.log('이름:', testName);
    console.log('사용자 ID:', data.user.id);
    console.log('===========================');
    
  } catch (err) {
    console.error('계정 생성 중 오류 발생:', err);
  }
}

createTestAccount();

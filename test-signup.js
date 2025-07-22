// 회원가입 테스트 스크립트
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('환경 변수가 설정되지 않았습니다.');
  process.exit(1);
}

// 테스트용 이메일과 비밀번호 (실제 테스트에서 변경 필요)
const testEmail = `test-${Date.now()}@example.com`;
const testPassword = 'Password123!';
const testName = '테스트 사용자';
const testPhone = '01012345678';

async function testSignup() {
  try {
    // 일반 클라이언트 생성 (사용자용)
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log(`회원가입 테스트 시작: ${testEmail}`);
    
    // 1. 회원가입 (Auth)
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
      return { success: false, error };
    }
    
    console.log('Supabase Auth 회원가입 성공!');
    console.log('사용자 ID:', data.user.id);
    
    // 2. 서비스 롤을 사용해 users 테이블에 데이터 추가
    if (!serviceKey) {
      console.error('SUPABASE_SERVICE_KEY가 설정되지 않았습니다.');
      return { success: false, error: 'Service key not found' };
    }
    
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);
    
    const userData = {
      email: testEmail,
      name: testName,
      phone: testPhone,
      is_admin: false
    };
    
    // 3초 대기 (Auth 시스템 처리 시간 확보)
    console.log('Auth 처리 대기 중...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // users 테이블에 사용자 추가 (서비스 롤 사용)
    const { data: dbData, error: dbError } = await supabaseAdmin
      .from('users')
      .insert({
        id: data.user.id,
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        is_admin: userData.is_admin,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();
    
    if (dbError) {
      console.error('사용자 데이터 저장 오류:', dbError);
      return { success: false, error: dbError };
    }
    
    console.log('users 테이블에 사용자 데이터 저장 성공:', dbData);
    
    // 3. 사용자 로그인 테스트
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });
    
    if (signInError) {
      console.error('로그인 테스트 실패:', signInError);
      return { success: false, error: signInError };
    }
    
    console.log('로그인 테스트 성공!');
    
    // 4. users 테이블 조회 테스트
    const { data: userData2, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    if (userError) {
      console.error('사용자 정보 조회 실패:', userError);
      return { success: false, error: userError };
    }
    
    console.log('사용자 정보 조회 성공:', userData2);
    
    return { success: true, user: data.user, userData: userData2 };
  } catch (error) {
    console.error('테스트 오류:', error);
    return { success: false, error };
  }
}

testSignup()
  .then(result => {
    if (result.success) {
      console.log('회원가입 테스트 성공!');
      console.log('생성된 테스트 계정:', result.user.email);
    } else {
      console.error('회원가입 테스트 실패!');
    }
    process.exit(0);
  });

// 웹사이트 회원가입 문제 해결을 위한 단계별 테스트 스크립트
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey || !serviceKey) {
  console.error('환경 변수가 설정되지 않았습니다.');
  process.exit(1);
}

// 테스트 결과 저장용 객체
const results = {
  environmentCheck: false,
  authSignupTest: false,
  serviceRoleTest: false,
  loginTest: false,
};

// 1단계: 환경 변수와 Supabase 연결 확인
async function checkEnvironment() {
  console.log('======== 1단계: 환경 변수 및 연결 확인 ========');
  
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl);
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY 존재:', !!supabaseKey);
  console.log('SUPABASE_SERVICE_KEY 존재:', !!serviceKey);
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.from('regions').select('id, name').limit(1);
    
    if (error) {
      console.error('Supabase 연결 오류:', error);
      return false;
    }
    
    console.log('Supabase 연결 성공!');
    results.environmentCheck = true;
    return true;
  } catch (err) {
    console.error('연결 테스트 중 오류 발생:', err);
    return false;
  }
}

// 2단계: Auth 회원가입 테스트
async function testAuthSignup() {
  console.log('\n======== 2단계: Auth 회원가입 테스트 ========');
  
  const testEmail = `test-auth-${Date.now()}@example.com`;
  const testPassword = 'TestAuth123!';
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log(`테스트 이메일(${testEmail})로 Auth 회원가입 시도...`);
    
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          name: '테스트 사용자',
          phone: '01012345678'
        }
      }
    });
    
    if (error) {
      console.error('Auth 회원가입 오류:', error);
      return { success: false };
    }
    
    console.log('Auth 회원가입 성공!');
    console.log('사용자 ID:', data.user.id);
    
    results.authSignupTest = true;
    return { 
      success: true, 
      userId: data.user.id,
      email: testEmail,
      password: testPassword 
    };
  } catch (err) {
    console.error('Auth 회원가입 테스트 중 오류 발생:', err);
    return { success: false };
  }
}

// 3단계: 서비스 역할로 users 테이블에 데이터 추가 테스트
async function testServiceRole(userId, email) {
  console.log('\n======== 3단계: 서비스 역할 테스트 ========');
  
  if (!userId || !email) {
    console.error('사용자 ID와 이메일이 필요합니다.');
    return false;
  }
  
  try {
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);
    
    console.log(`사용자 ID(${userId})로 users 테이블에 데이터 추가 시도...`);
    
    const userData = {
      id: userId,
      email: email,
      name: '테스트 사용자',
      phone: '01012345678',
      is_admin: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert(userData)
      .select();
      
    if (error) {
      console.error('users 테이블 데이터 추가 오류:', error);
      return false;
    }
    
    console.log('users 테이블 데이터 추가 성공:', data);
    results.serviceRoleTest = true;
    return true;
  } catch (err) {
    console.error('서비스 역할 테스트 중 오류 발생:', err);
    return false;
  }
}

// 4단계: 로그인 테스트
async function testLogin(email, password) {
  console.log('\n======== 4단계: 로그인 테스트 ========');
  
  if (!email || !password) {
    console.error('이메일과 비밀번호가 필요합니다.');
    return false;
  }
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log(`이메일(${email})로 로그인 시도...`);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });
    
    if (error) {
      console.error('로그인 오류:', error);
      return false;
    }
    
    console.log('로그인 성공!');
    console.log('사용자 ID:', data.user.id);
    
    // users 테이블에서 데이터 확인
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();
      
    if (userError) {
      console.error('users 테이블 데이터 조회 오류:', userError);
    } else {
      console.log('users 테이블 데이터 조회 성공:', userData);
    }
    
    results.loginTest = true;
    return true;
  } catch (err) {
    console.error('로그인 테스트 중 오류 발생:', err);
    return false;
  }
}

// 종합 결과 출력
function printSummary() {
  console.log('\n======== 테스트 결과 요약 ========');
  console.log('1. 환경 변수 및 연결 확인:', results.environmentCheck ? '성공 ✅' : '실패 ❌');
  console.log('2. Auth 회원가입 테스트:', results.authSignupTest ? '성공 ✅' : '실패 ❌');
  console.log('3. 서비스 역할 테스트:', results.serviceRoleTest ? '성공 ✅' : '실패 ❌');
  console.log('4. 로그인 테스트:', results.loginTest ? '성공 ✅' : '실패 ❌');
  
  console.log('\n문제 진단:');
  if (!results.environmentCheck) {
    console.log('- 환경 변수 또는 Supabase 연결에 문제가 있습니다.');
  }
  
  if (results.environmentCheck && !results.authSignupTest) {
    console.log('- Supabase Auth 회원가입에 문제가 있습니다.');
  }
  
  if (results.authSignupTest && !results.serviceRoleTest) {
    console.log('- 서비스 역할을 사용한 users 테이블 접근에 문제가 있습니다.');
    console.log('  • SUPABASE_SERVICE_KEY가 올바른지 확인하세요.');
    console.log('  • RLS 정책이 올바르게 설정되어 있는지 확인하세요.');
  }
  
  if (results.serviceRoleTest && !results.loginTest) {
    console.log('- 로그인 처리에 문제가 있습니다.');
  }
  
  if (results.environmentCheck && results.authSignupTest && results.serviceRoleTest && results.loginTest) {
    console.log('- 모든 테스트가 성공적으로 완료되었습니다! 웹 클라이언트 측 문제를 확인하세요:');
    console.log('  • 브라우저 콘솔 오류를 확인하세요.');
    console.log('  • Next.js 애플리케이션에서 환경 변수가 올바르게 로드되고 있는지 확인하세요.');
    console.log('  • 클라이언트와 서버 간의 쿠키 전송 문제가 있을 수 있습니다.');
  }
}

// 테스트 실행
async function runTests() {
  const envCheck = await checkEnvironment();
  
  if (!envCheck) {
    console.error('환경 변수 또는 연결 문제로 테스트를 중단합니다.');
    printSummary();
    return;
  }
  
  const authResult = await testAuthSignup();
  
  if (!authResult.success) {
    console.error('Auth 회원가입 실패로 테스트를 중단합니다.');
    printSummary();
    return;
  }
  
  const serviceResult = await testServiceRole(authResult.userId, authResult.email);
  
  if (!serviceResult) {
    console.error('서비스 역할 테스트 실패로 테스트를 중단합니다.');
    printSummary();
    return;
  }
  
  await testLogin(authResult.email, authResult.password);
  
  printSummary();
}

// 테스트 실행
runTests();

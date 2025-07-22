// Supabase 인증 디버깅 스크립트
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// 환경 변수 확인
console.log('환경 변수 상태:');
console.log('NEXT_PUBLIC_SUPABASE_URL 존재:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY 존재:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
console.log('SUPABASE_SERVICE_KEY 존재:', !!process.env.SUPABASE_SERVICE_KEY);

// 변수 값 확인 (앞부분만 표시)
if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.log('URL 값:', process.env.NEXT_PUBLIC_SUPABASE_URL);
}

if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.log('ANON KEY 값 앞 10자:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 10) + '...');
}

if (process.env.SUPABASE_SERVICE_KEY) {
  console.log('SERVICE KEY 값 앞 10자:', process.env.SUPABASE_SERVICE_KEY.substring(0, 10) + '...');
}

// Supabase 연결 테스트
async function testSupabaseConnection() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('필수 환경 변수가 없습니다.');
    return;
  }
  
  try {
    console.log('Supabase 연결 테스트 시도...');
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // 공개 데이터 읽기 시도
    const { data, error } = await supabase
      .from('regions')  // regions 테이블은 공개적으로 읽을 수 있다고 가정
      .select('id, name')
      .limit(1);
      
    if (error) {
      console.error('Supabase 읽기 오류:', error);
    } else {
      console.log('Supabase 연결 성공! 데이터:', data);
    }
    
    // Auth 상태 확인
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.error('Auth 세션 확인 오류:', authError);
    } else {
      console.log('Auth 세션 상태:', authData.session ? '로그인됨' : '로그인되지 않음');
    }
    
  } catch (err) {
    console.error('Supabase 연결 중 예외 발생:', err);
  }
}

// 로그인 테스트 - 테스트용 계정 입력
async function testLogin(email, password) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('필수 환경 변수가 없습니다.');
    return;
  }
  
  try {
    console.log(`${email}로 로그인 시도...`);
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('로그인 오류:', error.message);
      return;
    }
    
    console.log('로그인 성공!');
    console.log('사용자 ID:', data.user.id);
    console.log('사용자 이메일:', data.user.email);
    
    // users 테이블에서 추가 정보 확인
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();
      
    if (userError) {
      console.error('사용자 정보 조회 실패:', userError);
    } else {
      console.log('사용자 데이터베이스 정보:', userData);
    }
    
  } catch (err) {
    console.error('로그인 중 예외 발생:', err);
  }
}

// Supabase URL 및 키 유효성 체크
function checkValidSupabaseCredentials() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !url.includes('supabase.co')) {
    console.error('NEXT_PUBLIC_SUPABASE_URL이 올바르지 않습니다!');
  }
  
  if (!key || key.length < 30) {
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY가 올바르지 않습니다!');
  }
}

// 테스트 실행
checkValidSupabaseCredentials();
testSupabaseConnection();

// 명령줄 인자로 이메일과 비밀번호를 받아 로그인 테스트
const args = process.argv.slice(2);
if (args.length >= 2) {
  const email = args[0];
  const password = args[1];
  testLogin(email, password);
} else {
  console.log('로그인 테스트를 하려면: node debug-auth.js 이메일 비밀번호');
}

// 회원가입 프로세스 디버깅 도구
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey || !serviceKey) {
  console.error('환경 변수가 설정되지 않았습니다.');
  process.exit(1);
}

// 테스트용 이메일과 비밀번호 (실제로 사용할 값)
const testEmail = 'bobjoaa@gmail.com'; // 스크린샷에 표시된 이메일
const testPassword = 'aszx1212'; // 스크린샷에 표시된 비밀번호를 추정
const testName = '김민형'; // 스크린샷에 표시된 이름
const testPhone = '010-1234-1234'; // 스크린샷에 표시된 전화번호

async function simulateSignupProcess() {
  console.log('회원가입 프로세스 시뮬레이션 시작...');
  
  try {
    // 1. Supabase 클라이언트 생성
    console.log('Supabase 클라이언트 생성 중...');
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 2. 회원가입 시도
    console.log(`${testEmail}로 회원가입 시도 중...`);
    
    // 먼저 사용자가 이미 존재하는지 확인
    const { data: existingUser } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });
    
    if (existingUser && existingUser.user) {
      console.log('이미 존재하는 사용자입니다. ID:', existingUser.user.id);
      // 로그인이 성공했으므로 추가 테스트 진행
      await testExistingUser(supabase, existingUser.user.id);
      return;
    }
    
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          name: testName,
          phone: testPhone.replace(/-/g, ''),
          marketing_agree: true
        }
      }
    });
    
    if (error) {
      console.error('회원가입 오류:', error);
      if (error.message === 'User already registered') {
        console.log('이미 등록된 이메일입니다. 서버 API를 통한 사용자 저장 테스트 진행...');
        
        // 이미 등록된 사용자의 ID 가져오기 시도
        const { data: authData } = await supabase.auth.signInWithPassword({
          email: testEmail,
          password: testPassword
        });
        
        if (authData && authData.user) {
          await testExistingUser(supabase, authData.user.id);
        } else {
          console.error('사용자 정보를 찾을 수 없습니다.');
        }
      }
      return;
    }
    
    console.log('회원가입 성공:', data);
    console.log('사용자 ID:', data.user.id);
    
    // 3. 사용자 데이터 저장 테스트
    await testUserDataSave(data.user.id);
    
  } catch (err) {
    console.error('회원가입 시뮬레이션 오류:', err);
  }
}

async function testExistingUser(supabase, userId) {
  console.log(`사용자 ID ${userId}에 대한 정보 확인 중...`);
  
  // users 테이블에서 사용자 정보 확인
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (userError) {
    console.error('users 테이블에서 사용자 정보를 찾을 수 없습니다:', userError);
    console.log('서비스 키를 사용하여 users 테이블에 사용자 데이터 추가 시도...');
    await testUserDataSave(userId);
  } else {
    console.log('users 테이블에서 사용자 정보를 찾았습니다:', userData);
  }
}

async function testUserDataSave(userId) {
  console.log(`사용자 ID ${userId}에 대한 데이터 저장 테스트 중...`);
  
  try {
    // 서비스 키를 사용한 Supabase 클라이언트 생성
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);
    
    const userData = {
      id: userId,
      email: testEmail,
      name: testName,
      phone: testPhone.replace(/-/g, ''),
      is_admin: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // 먼저 이미 있는지 확인
    const { data: existingData, error: existingError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (existingData) {
      console.log('사용자가 이미 users 테이블에 있습니다:', existingData);
      return;
    }
    
    // users 테이블에 데이터 추가
    console.log('users 테이블에 데이터 추가 중...', userData);
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert(userData)
      .select();
      
    if (error) {
      console.error('users 테이블에 데이터 추가 실패:', error);
    } else {
      console.log('users 테이블에 데이터 추가 성공:', data);
    }
    
  } catch (err) {
    console.error('사용자 데이터 저장 테스트 오류:', err);
  }
}

// 회원가입 프로세스 시뮬레이션 실행
simulateSignupProcess().then(() => {
  console.log('회원가입 프로세스 시뮬레이션 완료');
});

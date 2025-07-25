'use strict';

// Supabase 클라이언트 설정
const { createClient } = require('@supabase/supabase-js');

// .env.local 파일에서 환경 변수 로드
require('dotenv').config({ path: '.env.local' });

// Supabase URL과 Anon Key 가져오기
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// 설정 확인 및 출력
console.log('Supabase URL:', supabaseUrl?.substring(0, 15) + '...');
console.log('Supabase Anon Key 있음:', !!supabaseAnonKey);
console.log('Supabase Service Key 있음:', !!supabaseServiceKey);

// Supabase 클라이언트 생성
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// 서비스 역할 클라이언트 생성
const adminSupabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// 테스트 함수
async function runTests() {
  console.log('\n--------- 인증 테스트 시작 ---------\n');

  try {
    // 1. 현재 사용자 확인
    console.log('1. Auth 시스템에 등록된 모든 사용자 조회 중...');
    const { data: authUsers, error: authError } = await adminSupabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Auth 사용자 조회 실패:', authError.message);
    } else {
      console.log(`총 ${authUsers.users.length}명의 사용자가 Auth 시스템에 등록되어 있습니다.`);
      console.log('첫 번째 사용자 정보:', JSON.stringify(authUsers.users[0], null, 2));
    }

    // 2. 데이터베이스 사용자 테이블 확인
    console.log('\n2. 데이터베이스의 users 테이블 조회 중...');
    const { data: dbUsers, error: dbError } = await adminSupabase
      .from('users')
      .select('*');
    
    if (dbError) {
      console.error('사용자 테이블 조회 실패:', dbError.message);
    } else {
      console.log(`총 ${dbUsers.length}명의 사용자가 데이터베이스에 등록되어 있습니다.`);
      if (dbUsers.length > 0) {
        console.log('첫 번째 사용자 정보:', JSON.stringify(dbUsers[0], null, 2));
      }
    }

    // 3. 테스트 로그인 시도
    if (authUsers?.users.length > 0) {
      const testEmail = 'admin@tripstore.com';
      console.log(`\n3. 테스트 로그인 시도 (${testEmail})...`);
      
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: 'Admin123!'
      });
      
      if (signInError) {
        console.error('로그인 실패:', signInError.message);
      } else {
        console.log('로그인 성공!');
        console.log('세션 정보:', JSON.stringify(signInData.session, null, 2));
        console.log('사용자 ID:', signInData.user.id);
      }
    }

  } catch (error) {
    console.error('테스트 중 오류 발생:', error);
  }

  console.log('\n--------- 인증 테스트 종료 ---------');
}

// 테스트 실행
runTests();

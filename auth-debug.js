/**
 * TripStore 인증 디버그 도구
 * 
 * 이 스크립트는 인증 관련 문제를 해결하는 데 도움이 됩니다.
 */

'use strict';

// 환경 변수 로드
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// 수파베이스 연결 정보
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ihhnvmzizaiokrfkatwt.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 수파베이스 클라이언트 생성
const adminClient = createClient(supabaseUrl, supabaseKey);
const anonClient = createClient(supabaseUrl, supabaseAnonKey);

// 유틸리티 함수
async function listUsers() {
  console.log('=== 인증 시스템의 모든 사용자 조회 중 ===');
  
  try {
    const { data: users, error } = await adminClient.auth.admin.listUsers();
    
    if (error) {
      console.error('사용자 목록 조회 실패:', error);
      return;
    }
    
    console.log(`총 ${users.users.length}명의 사용자가 있습니다.`);
    
    users.users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (ID: ${user.id})`);
      console.log(`   - 생성: ${new Date(user.created_at).toLocaleString()}`);
      console.log(`   - 최근 로그인: ${user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : '없음'}`);
      console.log(`   - 확인됨: ${user.confirmed_at ? '예' : '아니오'}`);
      console.log('');
    });
  } catch (error) {
    console.error('오류 발생:', error);
  }
}

// 특정 사용자 상세 정보 확인
async function getUserDetails(email) {
  console.log(`=== 사용자 상세 정보 확인: ${email} ===`);
  
  try {
    // 사용자 정보 조회 (Auth)
    const { data: { users }, error: authError } = await adminClient.auth.admin.listUsers({
      filters: {
        email: email
      }
    });
    
    if (authError) {
      console.error('인증 정보 조회 실패:', authError);
      return;
    }
    
    if (!users || users.length === 0) {
      console.log('해당 이메일을 가진 사용자를 찾을 수 없습니다.');
      return;
    }
    
    const user = users[0];
    console.log('인증 정보:');
    console.log(`- ID: ${user.id}`);
    console.log(`- 이메일: ${user.email}`);
    console.log(`- 생성일: ${new Date(user.created_at).toLocaleString()}`);
    console.log(`- 최근 로그인: ${user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : '없음'}`);
    console.log(`- 이메일 확인: ${user.email_confirmed_at ? '예' : '아니오'}`);
    
    // 사용자 정보 조회 (DB)
    const { data: dbUser, error: dbError } = await adminClient
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (dbError) {
      console.error('데이터베이스 정보 조회 실패:', dbError);
      console.log('데이터베이스에 해당 사용자 정보가 없습니다.');
    } else {
      console.log('\n데이터베이스 정보:');
      console.log(`- 이름: ${dbUser.name || '없음'}`);
      console.log(`- 역할: ${dbUser.role || '없음'}`);
      console.log(`- 전화번호: ${dbUser.phone || '없음'}`);
      console.log(`- 생성일: ${dbUser.created_at ? new Date(dbUser.created_at).toLocaleString() : '없음'}`);
    }
  } catch (error) {
    console.error('오류 발생:', error);
  }
}

// 테스트 로그인
async function testLogin(email, password) {
  console.log(`=== 테스트 로그인: ${email} ===`);
  
  try {
    const { data, error } = await anonClient.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('로그인 실패:', error.message);
      return;
    }
    
    console.log('로그인 성공!');
    console.log(`- 사용자 ID: ${data.user.id}`);
    console.log(`- 이메일: ${data.user.email}`);
    console.log(`- 세션 만료: ${new Date(data.session.expires_at * 1000).toLocaleString()}`);
    
    // 사용자 권한 확인
    const { data: userData, error: userError } = await anonClient
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single();
    
    if (userError) {
      console.error('사용자 정보 조회 실패:', userError);
    } else {
      console.log(`- 권한: ${userData.role || '없음'}`);
    }
    
    // 로그아웃
    await anonClient.auth.signOut();
    console.log('로그아웃 완료');
  } catch (error) {
    console.error('오류 발생:', error);
  }
}

// 관리자 계정 확인
async function checkAdmin(email) {
  console.log(`=== 관리자 권한 확인: ${email} ===`);
  
  try {
    // 사용자 정보 조회 (Auth)
    const { data: { users }, error: authError } = await adminClient.auth.admin.listUsers({
      filters: {
        email: email
      }
    });
    
    if (authError) {
      console.error('인증 정보 조회 실패:', authError);
      return;
    }
    
    if (!users || users.length === 0) {
      console.log('해당 이메일을 가진 사용자를 찾을 수 없습니다.');
      return;
    }
    
    const user = users[0];
    
    // 사용자 권한 확인
    const { data: userData, error: userError } = await adminClient
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (userError) {
      console.error('사용자 권한 조회 실패:', userError);
      return;
    }
    
    if (userData.role === 'admin') {
      console.log(`✅ ${email}은(는) 관리자 권한이 있습니다.`);
    } else {
      console.log(`❌ ${email}은(는) 관리자 권한이 없습니다. 현재 역할: ${userData.role || '없음'}`);
    }
  } catch (error) {
    console.error('오류 발생:', error);
  }
}

// 사용자 권한 설정
async function setUserRole(email, role) {
  console.log(`=== 사용자 역할 설정: ${email} -> ${role} ===`);
  
  if (role !== 'admin' && role !== 'user') {
    console.error('올바르지 않은 역할입니다. "admin" 또는 "user"만 가능합니다.');
    return;
  }
  
  try {
    // 사용자 정보 조회 (Auth)
    const { data: { users }, error: authError } = await adminClient.auth.admin.listUsers({
      filters: {
        email: email
      }
    });
    
    if (authError) {
      console.error('인증 정보 조회 실패:', authError);
      return;
    }
    
    if (!users || users.length === 0) {
      console.log('해당 이메일을 가진 사용자를 찾을 수 없습니다.');
      return;
    }
    
    const user = users[0];
    
    // 사용자 권한 설정
    const { data, error } = await adminClient
      .from('users')
      .update({ role })
      .eq('id', user.id);
    
    if (error) {
      console.error('사용자 권한 설정 실패:', error);
      return;
    }
    
    console.log(`✅ ${email}의 역할이 "${role}"로 변경되었습니다.`);
  } catch (error) {
    console.error('오류 발생:', error);
  }
}

// 실행
async function run() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (!command) {
    console.log('사용법:');
    console.log('  node auth-debug.js list - 모든 사용자 목록');
    console.log('  node auth-debug.js user <email> - 특정 사용자 정보');
    console.log('  node auth-debug.js login <email> <password> - 테스트 로그인');
    console.log('  node auth-debug.js check-admin <email> - 관리자 권한 확인');
    console.log('  node auth-debug.js set-role <email> <admin|user> - 사용자 권한 설정');
    return;
  }
  
  switch (command) {
    case 'list':
      await listUsers();
      break;
      
    case 'user':
      const email = args[1];
      if (!email) {
        console.error('이메일을 입력하세요.');
        break;
      }
      await getUserDetails(email);
      break;
      
    case 'login':
      const loginEmail = args[1];
      const password = args[2];
      if (!loginEmail || !password) {
        console.error('이메일과 비밀번호를 모두 입력하세요.');
        break;
      }
      await testLogin(loginEmail, password);
      break;
      
    case 'check-admin':
      const checkEmail = args[1];
      if (!checkEmail) {
        console.error('이메일을 입력하세요.');
        break;
      }
      await checkAdmin(checkEmail);
      break;
      
    case 'set-role':
      const setEmail = args[1];
      const role = args[2];
      if (!setEmail || !role) {
        console.error('이메일과 역할(admin 또는 user)을 모두 입력하세요.');
        break;
      }
      await setUserRole(setEmail, role);
      break;
      
    default:
      console.error('알 수 없는 명령어입니다.');
  }
}

// 실행
run().then(() => process.exit(0)).catch(err => {
  console.error('실행 중 오류 발생:', err);
  process.exit(1);
});

// 관리자 계정 생성 스크립트
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Supabase 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('환경 변수가 설정되지 않았습니다.');
  console.error('NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 .env 파일에 설정해주세요.');
  process.exit(1);
}

// Supabase 클라이언트 생성
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 관리자 이메일과 비밀번호 설정
const adminEmail = 'admin@tripstore.com';
const adminPassword = 'Admin123!';

async function createAdmin() {
  try {
    console.log('관리자 계정 생성 중...');
    
    // 1. 사용자 가입
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword
    });

    if (authError) {
      console.error('사용자 계정 생성 오류:', authError.message);
      
      // 이미 계정이 있을 수 있으므로 로그인 시도
      console.log('계정이 이미 존재할 수 있습니다. 로그인 시도 중...');
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPassword
      });
      
      if (signInError) {
        console.error('로그인 오류:', signInError.message);
        return;
      }
      
      console.log('로그인 성공:', signInData.user.id);
      
      // 관리자 권한 부여
      await updateAdminStatus(signInData.user.id);
      return;
    }

    console.log('사용자가 생성되었습니다:', authData.user.id);
    
    // 2. 관리자 권한 부여
    await updateAdminStatus(authData.user.id);
    
  } catch (error) {
    console.error('관리자 생성 중 오류 발생:', error.message);
  }
}

async function updateAdminStatus(userId) {
  try {
    // users 테이블에 사용자 존재 여부 확인
    const { data: existingUser, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (selectError && selectError.code !== 'PGRST116') { // PGRST116: 결과가 없음
      console.error('사용자 조회 오류:', selectError.message);
    }
    
    if (existingUser) {
      // 기존 사용자의 관리자 권한 업데이트
      const { error: updateError } = await supabase
        .from('users')
        .update({ is_admin: true, name: '관리자' })
        .eq('id', userId);
        
      if (updateError) {
        console.error('관리자 권한 부여 오류:', updateError.message);
        return;
      }
      
      console.log('관리자 권한이 부여되었습니다.');
    } else {
      // 새 사용자 추가
      const { error: insertError } = await supabase
        .from('users')
        .insert([{ 
          id: userId, 
          email: adminEmail, 
          is_admin: true, 
          name: '관리자' 
        }]);
        
      if (insertError) {
        console.error('사용자 추가 오류:', insertError.message);
        return;
      }
      
      console.log('관리자 사용자가 생성되었습니다.');
    }
    
    console.log('관리자 계정 설정이 완료되었습니다.');
    console.log(`이메일: ${adminEmail}`);
    console.log('이메일 확인 후 로그인하여 관리자 페이지에 접속하세요.');
    
  } catch (error) {
    console.error('관리자 상태 업데이트 중 오류:', error.message);
  }
}

createAdmin();

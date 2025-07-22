// Auth 사용자를 users 테이블에 동기화하는 스크립트
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('환경 변수가 설정되지 않았습니다.');
  process.exit(1);
}

async function syncAuthUsersToUsersTable() {
  console.log('Auth 사용자를 users 테이블에 동기화 시작...');
  
  try {
    // 서비스 키로 Supabase 클라이언트 생성
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);
    
    // 1. Auth 사용자 목록 가져오기
    console.log('Auth 사용자 목록 가져오기...');
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      throw new Error(`Auth 사용자 목록 가져오기 실패: ${authError.message}`);
    }
    
    console.log(`총 ${authUsers.users.length}명의 Auth 사용자를 찾았습니다.`);
    
    // 2. 각 Auth 사용자에 대해 users 테이블에 존재하는지 확인
    for (const user of authUsers.users) {
      console.log(`사용자 처리 중: ${user.email} (ID: ${user.id})`);
      
      // users 테이블에서 해당 사용자 검색
      const { data: existingUser, error: userError } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (userError) {
        console.error(`사용자 조회 중 오류 발생: ${userError.message}`);
        continue;
      }
      
      // 사용자가 users 테이블에 없으면 추가
      if (!existingUser) {
        console.log(`사용자 ${user.email}를 users 테이블에 추가 중...`);
        
        // 기본 사용자 데이터 준비
        const userData = {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.email.split('@')[0], // 이름이 없으면 이메일 아이디 부분 사용
          phone: user.user_metadata?.phone || null,
          is_admin: false, // 기본적으로 일반 사용자로 설정
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // users 테이블에 사용자 추가
        const { data, error } = await supabaseAdmin
          .from('users')
          .insert(userData)
          .select();
          
        if (error) {
          console.error(`사용자 추가 중 오류 발생: ${error.message}`);
        } else {
          console.log(`사용자 ${user.email} 추가 완료!`);
        }
      } else {
        console.log(`사용자 ${user.email}는 이미 users 테이블에 존재합니다.`);
      }
    }
    
    console.log('동기화가 완료되었습니다.');
    
  } catch (error) {
    console.error('동기화 중 오류 발생:', error);
  }
}

// 동기화 실행
syncAuthUsersToUsersTable();

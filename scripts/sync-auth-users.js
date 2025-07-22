// 이 스크립트는 Supabase의 Authentication 사용자 목록과 실제 데이터베이스의 users 테이블을 동기화합니다.
// 이미 Authentication에 등록된 사용자가 users 테이블에 누락된 경우 추가합니다.
// 실행: node scripts/sync-auth-users.js

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// 백업용 기본값
const FALLBACK_SUPABASE_URL = 'https://ihhnvmzizaiokrfkatwt.supabase.co';
const FALLBACK_SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloaG52bXppemFpb2tyZmthdHd0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzA4ODU5OSwiZXhwIjoyMDY4NjY0NTk5fQ.ub6g81u9-PJKMZp6EKyRyUtFlEiwwXEHqQWSkKUj9WE';

// 환경 변수 또는 백업 값으로 Supabase 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || FALLBACK_SUPABASE_SERVICE_KEY;

if (!supabaseServiceKey) {
  console.error('SUPABASE_SERVICE_KEY 환경 변수가 설정되지 않았습니다.');
  process.exit(1);
}

// 서비스 롤로 Supabase 클라이언트 생성 (관리자 권한)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function syncUsers() {
  try {
    console.log('Auth 사용자와 데이터베이스 사용자 동기화 시작...');
    
    // 1. Auth에서 모든 사용자 목록 가져오기
    console.log('Auth 사용자 목록 가져오는 중...');
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      console.error('Auth 사용자 목록 가져오기 오류:', authError);
      return;
    }
    
    console.log(`Auth에서 총 ${authUsers.users.length}명의 사용자를 찾았습니다.`);
    
    // 2. users 테이블에서 모든 사용자 목록 가져오기
    console.log('데이터베이스 사용자 목록 가져오는 중...');
    const { data: dbUsers, error: dbError } = await supabaseAdmin
      .from('users')
      .select('id, email');
    
    if (dbError) {
      console.error('데이터베이스 사용자 목록 가져오기 오류:', dbError);
      return;
    }
    
    console.log(`데이터베이스에서 총 ${dbUsers.length}명의 사용자를 찾았습니다.`);
    
    // 3. 데이터베이스에 없는 Auth 사용자 찾기
    const dbUserIds = new Set(dbUsers.map(user => user.id));
    const missingUsers = authUsers.users.filter(user => !dbUserIds.has(user.id));
    
    console.log(`데이터베이스에 없는 Auth 사용자 수: ${missingUsers.length}`);
    
    // 4. 누락된 사용자를 데이터베이스에 추가
    if (missingUsers.length > 0) {
      console.log('누락된 사용자를 데이터베이스에 추가하는 중...');
      
      for (const user of missingUsers) {
        console.log(`사용자 추가 중: ${user.email} (ID: ${user.id})`);
        
        const userData = {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.email.split('@')[0], // 이름이 없으면 이메일에서 추출
          phone: user.user_metadata?.phone || null,
          is_admin: false,
          created_at: user.created_at,
          updated_at: new Date().toISOString()
        };
        
        const { data, error } = await supabaseAdmin
          .from('users')
          .insert(userData)
          .select();
        
        if (error) {
          console.error(`사용자 ${user.email} 추가 실패:`, error);
        } else {
          console.log(`사용자 ${user.email} 추가 성공!`);
        }
      }
      
      console.log('사용자 동기화 완료!');
    } else {
      console.log('모든 Auth 사용자가 이미 데이터베이스에 있습니다. 동기화가 필요 없습니다.');
    }
  } catch (error) {
    console.error('동기화 중 오류 발생:', error);
  }
}

// 스크립트 실행
syncUsers()
  .catch(console.error)
  .finally(() => {
    console.log('스크립트 실행 완료');
  });

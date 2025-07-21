import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 생성 (서비스 롤 사용)
const supabaseAdmin = createClient(
  'https://ihhnvmzizaiokrfkatwt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloaG52bXppemFpb2tyZmthdHd0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzA4ODU5OSwiZXhwIjoyMDY4NjY0NTk5fQ.ub6g81u9-PJKMZp6EKyRyUtFlEiwwXEHqQWSkKUj9WE'
);

async function main() {
  try {
    // 1. 사용자 생성
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: 'admin@tripstore.com',
      password: 'Admin123!',
      email_confirm: true
    });

    if (userError) {
      throw userError;
    }

    console.log('사용자 생성 성공:', userData);

    // 2. 사용자 테이블에 관리자 정보 추가
    const { error: profileError } = await supabaseAdmin
      .from('users')
      .insert({
        id: userData.user.id,
        email: userData.user.email,
        name: '관리자',
        role: 'admin',
        is_admin: true
      });

    if (profileError) {
      throw profileError;
    }

    console.log('관리자 계정이 성공적으로 생성되었습니다.');
    console.log('이메일: admin@tripstore.com');
    console.log('비밀번호: Admin123!');

  } catch (error) {
    console.error('오류 발생:', error);
  }
}

main();

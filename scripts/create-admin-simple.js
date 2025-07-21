import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 생성 (서비스 롤 사용)
const supabaseAdmin = createClient(
  'https://ihhnvmzizaiokrfkatwt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloaG52bXppemFpb2tyZmthdHd0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzA4ODU5OSwiZXhwIjoyMDY4NjY0NTk5fQ.ub6g81u9-PJKMZp6EKyRyUtFlEiwwXEHqQWSkKUj9WE'
);

async function main() {
  try {
    // 1. 기존 admin@tripstore.com 계정이 있으면 삭제
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
    const adminUser = existingUser.users.find(user => user.email === 'admin@tripstore.com');
    
    if (adminUser) {
      console.log('기존 admin@tripstore.com 계정을 삭제합니다...');
      await supabaseAdmin.auth.admin.deleteUser(adminUser.id);
    }
    
    // 2. 사용자 생성
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: 'admin@tripstore.com',
      password: 'Admin123!',
      email_confirm: true,
      user_metadata: { is_admin: true }
    });

    if (userError) {
      throw userError;
    }

    console.log('사용자 생성 성공:', userData.user);
    
    console.log('관리자 계정이 성공적으로 생성되었습니다.');
    console.log('이메일: admin@tripstore.com');
    console.log('비밀번호: Admin123!');

  } catch (error) {
    console.error('오류 발생:', error);
  }
}

main();

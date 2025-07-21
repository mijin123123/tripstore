import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 생성 (서비스 롤 사용)
const supabaseAdmin = createClient(
  'https://ihhnvmzizaiokrfkatwt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloaG52bXppemFpb2tyZmthdHd0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzA4ODU5OSwiZXhwIjoyMDY4NjY0NTk5fQ.ub6g81u9-PJKMZp6EKyRyUtFlEiwwXEHqQWSkKUj9WE'
);

async function main() {
  try {
    // 1. users 테이블이 없으면 생성
    const { error: createTableError } = await supabaseAdmin.rpc('exec_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY REFERENCES auth.users(id),
          email TEXT NOT NULL,
          name TEXT,
          is_admin BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
        );
      `
    });

    if (createTableError) {
      // 테이블이 이미 존재할 수 있으므로 무시하고 계속 진행
      console.log('테이블 생성 시도 중 오류:', createTableError);
      
      // SQL 함수 직접 실행
      const { error: sqlError } = await supabaseAdmin
        .from('_sqlf')
        .rpc('exec', {
          query: `
            CREATE TABLE IF NOT EXISTS users (
              id UUID PRIMARY KEY REFERENCES auth.users(id),
              email TEXT NOT NULL,
              name TEXT,
              is_admin BOOLEAN DEFAULT false,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
            );
          `
        });
      
      if (sqlError) {
        console.log('SQL 함수 실행 오류:', sqlError);
      }
    }

    // 2. 사용자 생성
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: 'admin@tripstore.com',
      password: 'Admin123!',
      email_confirm: true
    });

    if (userError) {
      if (userError.message.includes('already exists')) {
        console.log('사용자가 이미 존재합니다. 계속 진행합니다.');
        
        // 기존 사용자 정보 가져오기
        const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
        const adminUser = existingUser.users.find(user => user.email === 'admin@tripstore.com');
        
        if (adminUser) {
          console.log('기존 사용자를 사용합니다:', adminUser.id);
          
          // users 테이블에 사용자 추가 또는 업데이트 (UPSERT)
          const { error: upsertError } = await supabaseAdmin
            .from('users')
            .upsert({
              id: adminUser.id,
              email: adminUser.email,
              name: '관리자',
              is_admin: true
            }, { onConflict: 'id' });
          
          if (upsertError) {
            console.log('사용자 정보 업데이트 오류:', upsertError);
          } else {
            console.log('관리자 권한이 부여되었습니다.');
          }
        }
      } else {
        throw userError;
      }
    } else {
      console.log('사용자 생성 성공:', userData);

      // 3. 사용자 테이블에 관리자 정보 추가
      const { error: profileError } = await supabaseAdmin
        .from('users')
        .insert({
          id: userData.user.id,
          email: userData.user.email,
          name: '관리자',
          is_admin: true
        });

      if (profileError) {
        throw profileError;
      }
    }

    console.log('관리자 계정이 성공적으로 설정되었습니다.');
    console.log('이메일: admin@tripstore.com');
    console.log('비밀번호: Admin123!');

  } catch (error) {
    console.error('오류 발생:', error);
  }
}

main();

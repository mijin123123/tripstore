const { createClient } = require('@supabase/supabase-js');

// .env 파일에서 환경 변수 로드
require('dotenv').config();

// Supabase 설정 (서비스 키 사용)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ihhnvmzizaiokrfkatwt.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloaG52bXppemFpb2tyZmthdHd0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzA4ODU5OSwiZXhwIjoyMDY4NjY0NTk5fQ.ub6g81u9-PJKMZp6EKyRyUtFlEiwwXEHqQWSkKUj9WE';

console.log('Supabase URL:', supabaseUrl);
console.log('서비스 키 존재:', !!supabaseServiceKey);

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setAdminRole() {
  try {
    console.log('현재 로그인된 사용자들 조회 중...');
    
    // 모든 사용자 조회
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('사용자 목록 조회 오류:', listError);
      return;
    }
    
    console.log('찾은 사용자:', users.length, '명');
    
    // 각 사용자 정보 출력
    users.forEach((user, index) => {
      console.log(`${index + 1}. 이메일: ${user.email}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   메타데이터:`, user.app_metadata);
      console.log('   ---');
    });
    
    // admin@tripstore.com 사용자를 찾아서 관리자로 설정
    const adminUser = users.find(user => 
      user.email === 'admin@tripstore.com' || 
      user.email?.includes('admin')
    );
    
    if (adminUser) {
      console.log(`관리자 권한 설정 중: ${adminUser.email}`);
      
      const { data, error } = await supabase.auth.admin.updateUserById(
        adminUser.id,
        {
          app_metadata: {
            ...adminUser.app_metadata,
            role: 'admin'
          }
        }
      );
      
      if (error) {
        console.error('관리자 권한 설정 오류:', error);
      } else {
        console.log('✅ 관리자 권한 설정 성공!');
        console.log('업데이트된 사용자:', data.user.email);
        console.log('새 메타데이터:', data.user.app_metadata);
      }
    } else {
      console.log('❌ admin@tripstore.com 사용자를 찾을 수 없습니다.');
      console.log('현재 사용자 중 첫 번째 사용자를 관리자로 설정합니다...');
      
      if (users.length > 0) {
        const firstUser = users[0];
        console.log(`관리자 권한 설정 중: ${firstUser.email}`);
        
        const { data, error } = await supabase.auth.admin.updateUserById(
          firstUser.id,
          {
            app_metadata: {
              ...firstUser.app_metadata,
              role: 'admin'
            }
          }
        );
        
        if (error) {
          console.error('관리자 권한 설정 오류:', error);
        } else {
          console.log('✅ 관리자 권한 설정 성공!');
          console.log('업데이트된 사용자:', data.user.email);
          console.log('새 메타데이터:', data.user.app_metadata);
        }
      }
    }
    
  } catch (error) {
    console.error('스크립트 실행 오류:', error);
  }
}

setAdminRole();

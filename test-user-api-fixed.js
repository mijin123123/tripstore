// 사용자 API 테스트 스크립트 - 수정된 버전
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey || !serviceKey) {
  console.error('환경 변수가 설정되지 않았습니다.');
  process.exit(1);
}

const testDirectUserCreation = async () => {
  try {
    // 서비스 롤을 사용하는 Admin Supabase 클라이언트 생성
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);
    
    const testUserId = 'test-user-id-' + Date.now();
    const userData = {
      email: `test-${Date.now()}@example.com`,
      name: '테스트 사용자',
      phone: '01012345678',
      // marketing_agree 필드는 users 테이블에 없으므로 제거
      is_admin: false
    };
    
    console.log('서비스 키를 사용한 직접 사용자 생성 테스트:', testUserId, userData);
    
    // users 테이블에 사용자 직접 추가 (서비스 롤 사용)
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        id: testUserId,
        ...userData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();
    
    if (error) {
      console.error('사용자 생성 오류:', error);
      return { success: false, error };
    }
    
    console.log('사용자 생성 성공:', data);
    return { success: true, user: data[0] };
  } catch (error) {
    console.error('서버 오류:', error);
    return { success: false, error };
  }
};

// 서비스 키 확인
console.log('SUPABASE_SERVICE_KEY 존재 여부:', !!serviceKey);
console.log('서비스 키 앞 10자:', serviceKey ? serviceKey.substring(0, 10) + '...' : '없음');

// 직접 생성 테스트 실행
testDirectUserCreation()
  .then(result => {
    console.log('테스트 결과:', result.success ? '성공' : '실패');
    if (!result.success) {
      console.error('실패 이유:', result.error);
    }
  });

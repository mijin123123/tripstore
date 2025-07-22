// 이 스크립트는 Supabase의 환경 변수와 연결을 테스트하고 확인합니다.
// 실행: node scripts/test-supabase-connection.js

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// 백업용 기본값
const FALLBACK_SUPABASE_URL = 'https://ihhnvmzizaiokrfkatwt.supabase.co';
const FALLBACK_SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloaG52bXppemFpb2tyZmthdHd0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzA4ODU5OSwiZXhwIjoyMDY4NjY0NTk5fQ.ub6g81u9-PJKMZp6EKyRyUtFlEiwwXEHqQWSkKUj9WE';

// 환경 변수 또는 백업 값으로 Supabase 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || FALLBACK_SUPABASE_SERVICE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

console.log('환경 설정:');
console.log('- NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL || '(설정 없음, 폴백 사용)');
console.log('- SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? '(설정됨)' : '(설정 없음, 폴백 사용)');
console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '(설정됨)' : '(설정 없음)');

console.log('\n사용 중인 값:');
console.log('- URL:', supabaseUrl);
console.log('- 서비스 키:', supabaseServiceKey ? '(설정됨)' : '(설정 없음)');
console.log('- 익명 키:', supabaseAnonKey ? '(설정됨)' : '(설정 없음)');

async function testConnection() {
  console.log('\n서비스 키를 사용한 Supabase 연결 테스트 중...');
  
  try {
    // 서비스 롤로 Supabase 클라이언트 생성
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // 테이블 목록 가져오기 테스트
    const { data, error } = await supabaseAdmin.from('users').select('count').limit(1);
    
    if (error) {
      console.error('오류 발생:', error);
    } else {
      console.log('성공! 데이터베이스에 연결했습니다.');
      console.log('테이블 쿼리 결과:', data);
    }
    
    // Auth 테스트
    console.log('\nAuth API 테스트 중...');
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1
    });
    
    if (authError) {
      console.error('Auth API 오류:', authError);
    } else {
      console.log('Auth API 성공!');
      console.log(`Auth 사용자 수: ${authData.users.length}`);
      
      if (authData.users.length > 0) {
        const user = authData.users[0];
        console.log('샘플 사용자:', {
          id: user.id,
          email: user.email,
          created_at: user.created_at
        });
      }
    }
    
    // 익명 키 테스트 (익명 키가 있는 경우)
    if (supabaseAnonKey) {
      console.log('\n익명 키를 사용한 Supabase 연결 테스트 중...');
      const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
      
      // 공개 데이터 테스트
      const { data: anonData, error: anonError } = await supabaseAnon
        .from('users')
        .select('count')
        .limit(1);
      
      if (anonError) {
        console.error('익명 키 테스트 오류:', anonError);
      } else {
        console.log('익명 키 테스트 성공!');
        console.log('테이블 쿼리 결과:', anonData);
      }
    }
  } catch (e) {
    console.error('테스트 중 예외 발생:', e);
  }
}

testConnection();

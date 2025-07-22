// 데이터베이스 연결 테스트 스크립트
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function testConnection() {
  try {
    // 환경 변수에서 Supabase URL과 API 키 가져오기
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('환경 변수가 설정되지 않았습니다.');
      console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '설정됨' : '설정되지 않음');
      console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '설정됨' : '설정되지 않음');
      return;
    }
    
    console.log('Supabase 클라이언트 생성 중...');
    console.log('URL:', supabaseUrl);
    
    // Supabase 클라이언트 생성
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // 데이터베이스 연결 테스트
    console.log('데이터베이스 연결 테스트 중...');
    const { data, error } = await supabase.from('users').select('count(*)');
    
    if (error) {
      console.error('데이터베이스 연결 실패:', error);
    } else {
      console.log('데이터베이스 연결 성공!');
      console.log('사용자 수:', data[0]?.count);
      
      // 최근 등록된 사용자 확인
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (usersError) {
        console.error('사용자 목록 조회 실패:', usersError);
      } else {
        console.log('최근 등록된 사용자:');
        console.table(users.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.created_at
        })));
      }
    }
  } catch (error) {
    console.error('예외 발생:', error);
  }
}

testConnection();

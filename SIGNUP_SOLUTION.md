// 회원가입 프로세스 수정 가이드

/*
문제 분석:
1. 회원가입 시 사용자는 Supabase Authentication 시스템에 등록됨
2. 그러나 실제 데이터베이스의 users 테이블에는 정보가 저장되지 않음
3. users 테이블의 id는 auth.users의 id와 연결된 외래 키(foreign key)

해결 방법:
1. 회원가입 과정:
   - Supabase Auth에 사용자 등록
   - 생성된 Auth 사용자 ID를 사용하여 users 테이블에 추가 정보 저장
   - 서비스 키(service key)를 사용하여 RLS 정책 우회

2. API 엔드포인트 수정:
   - userData 객체에서 marketing_agree 필드 제거
   - 필요한 필드만 명시적으로 지정하여 데이터베이스에 삽입

3. 회원가입 페이지 수정:
   - API로 전달하는 userData 객체 구조 수정
   - 디버깅 로그 추가하여 문제 발견 용이

4. 테스트 절차:
   - 회원가입 테스트 스크립트로 전체 과정 검증
   - 서비스 키를 사용하여 직접 users 테이블에 데이터 추가 테스트
*/

// 수정된 API 엔드포인트 코드
async function apiHandler(request) {
  try {
    const { userId, userData } = await request.json();
    
    if (!userId || !userData) {
      return { error: '사용자 ID와 데이터가 필요합니다.' };
    }
    
    // 서비스 롤을 사용하는 Admin Supabase 클라이언트 생성
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_KEY || ''
    );
    
    console.log('서버에서 사용자 생성 시도:', userId, userData);
    
    // users 테이블에 사용자 추가 (서비스 롤 사용)
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        id: userId,
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        is_admin: userData.is_admin || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();
    
    if (error) {
      console.error('사용자 생성 오류:', error);
      return { error: `사용자 생성 실패: ${error.message}` };
    }
    
    return { success: true, user: data[0] };
  } catch (error) {
    console.error('서버 오류:', error);
    return { error: `서버 오류: ${error.message}` };
  }
}

// 회원가입 페이지에서의 API 호출 코드
async function handleSignup() {
  // Supabase Auth를 사용한 회원가입
  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        name: formData.name,
        phone: formData.phone
      }
    }
  });
  
  if (error) {
    throw error;
  }
  
  // 회원 정보를 users 테이블에도 저장
  if (data.user) {
    console.log('회원가입 사용자 ID:', data.user.id);
    
    // API를 통해 사용자 생성 (서비스 역할 사용)
    const response = await fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: data.user.id,
        userData: {
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          is_admin: false
        }
      }),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      console.error('사용자 데이터 저장 실패:', result);
      // 추가 처리 또는 에러 표시
    }
  }
}

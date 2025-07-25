// 관리자 권한 확인 함수
export async function checkAdminRole(supabase, userId) {
  if (!userId) return false;
  
  try {
    // 먼저 사용자 메타데이터에서 역할 확인
    const { data: userData } = await supabase.auth.getUser();
    
    if (userData?.user?.app_metadata?.role === 'admin' || 
        userData?.user?.user_metadata?.role === 'admin') {
      return true;
    }
    
    // 데이터베이스에서 역할 확인
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error('관리자 권한 확인 오류:', error);
      return false;
    }
    
    return data?.role === 'admin';
  } catch (error) {
    console.error('관리자 권한 확인 중 예외 발생:', error);
    return false;
  }
}

// 사용자 역할을 관리자로 설정하는 헬퍼 함수 (개발용)
export async function setUserAsAdmin(supabase, userId) {
  if (!userId) return { success: false, error: '사용자 ID가 없습니다.' };
  
  try {
    // 데이터베이스 users 테이블에 role='admin' 설정
    const { error } = await supabase
      .from('users')
      .update({ role: 'admin' })
      .eq('id', userId);
      
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

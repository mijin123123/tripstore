import { createClient } from '@/lib/supabase-server';

// 관리자 권한 확인 함수 (서버 사이드용)
export async function checkAdminPermissionServer(email: string) {
  try {
    // 하드코딩된 관리자 이메일 (개발용)
    const adminEmails = ['sonchanmin89@gmail.com'];
    
    if (adminEmails.includes(email)) {
      return true;
    }
    
    // 데이터베이스에서 확인 (백업용)
    const supabase = createClient();
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) {
      console.error('관리자 권한 확인 중 오류:', error);
      return false;
    }
    
    return !!data; // 데이터가 있으면 관리자임
  } catch (error) {
    console.error('관리자 권한 확인 중 예외 발생:', error);
    return false;
  }
}

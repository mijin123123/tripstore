import { createClient } from '@/lib/supabase-server';

/**
 * 관리자 계정 정보
 */
const ADMIN_CREDENTIALS = {
  email: 'sonchanmin89@gmail.com',
  password: 'aszx1212'
};

/**
 * 이메일과 비밀번호로 관리자 인증을 확인합니다 (서버 사이드)
 * @param email - 이메일
 * @param password - 비밀번호
 * @returns 관리자 인증 성공 여부
 */
export function verifyAdminCredentialsServer(email: string, password: string): boolean {
  return email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password;
}

/**
 * 세션에서 관리자 인증 상태를 확인합니다 (서버 사이드)
 * @param sessionEmail - 세션에 저장된 이메일
 * @returns 관리자 권한 여부
 */
export function isAdminUserServer(sessionEmail: string): boolean {
  return sessionEmail === ADMIN_CREDENTIALS.email;
}

// 관리자 권한 확인 함수 (서버 사이드용) - 기존 호환성 유지
export async function checkAdminPermissionServer(email: string) {
  try {
    // 특정 이메일로만 관리자 권한 제한
    if (email === ADMIN_CREDENTIALS.email) {
      console.log('관리자 인증 성공:', email);
      return true;
    }
    
    console.log('관리자 권한 없음:', email);
    return false;
  } catch (error) {
    console.error('관리자 권한 확인 중 예외 발생:', error);
    return false;
  }
}

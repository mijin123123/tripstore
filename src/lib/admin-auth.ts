"use client";

import { createClient } from '@/lib/supabase';

/**
 * 관리자 계정 정보
 */
const ADMIN_CREDENTIALS = {
  email: 'sonchanmin89@gmail.com',
  password: 'aszx1212'
};

/**
 * 이메일과 비밀번호로 관리자 인증을 확인합니다.
 * @param email - 이메일
 * @param password - 비밀번호
 * @returns 관리자 인증 성공 여부
 */
export function verifyAdminCredentials(email: string, password: string): boolean {
  return email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password;
}

/**
 * 세션에서 관리자 인증 상태를 확인합니다.
 * @param sessionEmail - 세션에 저장된 이메일
 * @returns 관리자 권한 여부
 */
export function isAdminUser(sessionEmail: string): boolean {
  return sessionEmail === ADMIN_CREDENTIALS.email;
}

/**
 * 관리자 세션 데이터를 생성합니다.
 */
export function createAdminSession() {
  return {
    email: ADMIN_CREDENTIALS.email,
    role: 'admin',
    loginTime: new Date().toISOString()
  };
}

// 기존 함수 (호환성 유지)
export async function checkAdminPermission(email: string) {
  // 특정 이메일로만 관리자 권한 제한
  return isAdminUser(email);
}

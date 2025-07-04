"use client";

import { createClient } from '@/lib/supabase';

// 관리자 권한 확인 함수 (클라이언트 컴포넌트용)
export async function checkAdminPermission(email: string) {
  try {
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

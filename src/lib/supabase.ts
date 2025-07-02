import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Supabase URL과 anon key 직접 설정 (문제 해결용)
export const supabaseUrl = 'https://volboiuzarcalgqfcjbb.supabase.co';
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvbGJvaXV6YXJjYWxncWZjamJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MzcwMTEsImV4cCI6MjA2NzAxMzAxMX0.H39DakulqQd52RFaQcu0-sktqqxvvPn2hD0I9qfx8-k';

console.log('Supabase 설정:', { url: supabaseUrl, keyLength: supabaseAnonKey.length });

// 브라우저 환경용 클라이언트
const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

// 서버사이드 렌더링을 위한 클라이언트 생성 함수
export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  });
}

export default supabase;

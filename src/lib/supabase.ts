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
    flowType: 'pkce',
    storageKey: 'supabase.auth.token',
    storage: {
      getItem: (key) => {
        if (typeof window === 'undefined') return null;
        const value = window.localStorage.getItem(key);
        console.log(`Storage GET [${key}]: ${value ? 'Found' : 'Not found'}`);
        return value;
      },
      setItem: (key, value) => {
        if (typeof window === 'undefined') return;
        console.log(`Storage SET [${key}]: Value set`);
        window.localStorage.setItem(key, value);
      },
      removeItem: (key) => {
        if (typeof window === 'undefined') return;
        console.log(`Storage REMOVE [${key}]`);
        window.localStorage.removeItem(key);
      }
    },
    // URL 처리 개선 - Netlify 도메인 직접 사용 
    redirectTo: 'https://mellifluous-druid-c34db0.netlify.app/reset-password/update?type=recovery'
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

// 현재 세션 정보 로그 출력 (디버깅용)
if (typeof window !== 'undefined') {
  supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.error('현재 세션 가져오기 오류:', error);
    } else {
      console.log('현재 세션 상태:', data.session ? '세션 있음' : '세션 없음');
    }
  });
  
  // 인증 상태 변경 감지
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('인증 상태 변경:', event, session ? '세션 있음' : '세션 없음');
  });
}

export default supabase;

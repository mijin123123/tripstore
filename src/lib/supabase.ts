import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database.types';

// 하드코딩된 값 (환경 변수가 로드되지 않을 경우를 위한 백업)
const FALLBACK_SUPABASE_URL = 'https://ihhnvmzizaiokrfkatwt.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloaG52bXppemFpb2tyZmthdHd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwODg1OTksImV4cCI6MjA2ODY2NDU5OX0.wfwap5L5VIh4LUK7MS_Yrbq4ulS9APj2mkcJUufj8No';

// 환경 변수에서 Supabase URL과 익명 키 가져오기
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;

// 브라우저 클라이언트 생성 (클라이언트 컴포넌트에서 사용)
export function createClient() {
  // URL과 ANON KEY가 유효한지 확인
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL 또는 ANON KEY가 없습니다. 폴백 값 사용 중!');
  }
  
  // 클라이언트 싱글톤 패턴 적용 (불필요한 클라이언트 생성 방지)
  if ((globalThis as any).__supabase) {
    return (globalThis as any).__supabase;
  }
  
  // 클라이언트 생성 시도 - 옵션 추가
  try {
    // 최적화된 설정
    const client = createBrowserClient<Database>(
      supabaseUrl, 
      supabaseAnonKey,
      {
        auth: {
          flowType: 'pkce', // 더 안전한 방식으로 변경
          autoRefreshToken: true,
          detectSessionInUrl: true,
          persistSession: true,
          storageKey: 'tripstore-auth-token', // 명시적 저장소 키 설정
          debug: true, // 디버깅 활성화
          storage: {
            getItem: (key) => {
              try {
                const value = localStorage.getItem(key);
                console.log(`Auth 토큰 조회: ${key} (있음: ${!!value})`);
                return value;
              } catch (e) {
                console.error('토큰 조회 오류:', e);
                return null;
              }
            },
            setItem: (key, value) => {
              try {
                console.log(`Auth 토큰 저장: ${key}`);
                localStorage.setItem(key, value);
              } catch (e) {
                console.error('토큰 저장 오류:', e);
              }
            },
            removeItem: (key) => {
              try {
                console.log(`Auth 토큰 삭제: ${key}`);
                localStorage.removeItem(key);
              } catch (e) {
                console.error('토큰 삭제 오류:', e);
              }
            }
          }
        }
      }
    );
    
    // 글로벌 변수에 저장하여 재사용
    (globalThis as any).__supabase = client;
    return client;
    
  } catch (error) {
    console.error('Supabase 클라이언트 생성 오류:', error);
    // 폴백 값으로 재시도 (설정 간소화)
    const fallbackClient = createBrowserClient<Database>(
      FALLBACK_SUPABASE_URL, 
      FALLBACK_SUPABASE_ANON_KEY,
      {
        auth: {
          flowType: 'implicit',
          autoRefreshToken: true,
          detectSessionInUrl: true,
          persistSession: true
        }
      }
    );
    
    // 글로벌 변수에 저장
    (globalThis as any).__supabase = fallbackClient;
    return fallbackClient;
  }
}

// 기본 클라이언트 export (필요시 사용)
// export const supabase = createClient(); // 무한 로그 방지를 위해 주석 처리

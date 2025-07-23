import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/database.types';

// 폴백 값 (환경 변수가 없을 경우 사용)
const FALLBACK_SUPABASE_URL = 'https://ihhnvmzizaiokrfkatwt.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloaG52bXppemFpb2tyZmthdHd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwODg1OTksImV4cCI6MjA2ODY2NDU5OX0.wfwap5L5VIh4LUK7MS_Yrbq4ulS9APj2mkcJUufj8No';

// 서버 컴포넌트에서 사용할 Supabase 클라이언트 생성
export function createServerClient() {
  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;

  try {
    return createSupabaseServerClient<Database>(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name) {
            try {
              return cookieStore.get(name)?.value;
            } catch (e) {
              console.error('Cookie get error:', e);
              return undefined;
            }
          },
          set(name, value, options) {
            try {
              // Netlify 환경에서 쿠키 설정 에러 방지
              if (process.env.NETLIFY) {
                console.log('Netlify 환경에서 쿠키 설정 무시:', name);
                return;
              }
              cookieStore.set({ name, value, ...options });
            } catch (e) {
              console.error('Cookie set error:', e);
            }
          },
          remove(name, options) {
            try {
              // Netlify 환경에서 쿠키 삭제 에러 방지
              if (process.env.NETLIFY) {
                console.log('Netlify 환경에서 쿠키 삭제 무시:', name);
                return;
              }
              cookieStore.set({ name, value: '', ...options, maxAge: 0 });
            } catch (e) {
              console.error('Cookie remove error:', e);
            }
          },
        },
      }
    );
  } catch (e) {
    console.error('Supabase server client creation error:', e);
    // 에러가 발생해도 기본 클라이언트 반환 시도
    return createSupabaseServerClient<Database>(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get: () => undefined,
          set: () => {},
          remove: () => {},
        },
      }
    );
  }
}

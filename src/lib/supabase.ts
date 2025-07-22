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
  console.log('Supabase 클라이언트 생성', supabaseUrl ? '(URL있음)' : '(URL없음)');
  console.log('NEXT_PUBLIC_SUPABASE_URL 값 길이:', supabaseUrl?.length);
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY 값 길이:', supabaseAnonKey?.length);
  
  // URL과 ANON KEY가 유효한지 확인
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL 또는 ANON KEY가 없습니다. 폴백 값 사용 중!');
  }
  
  // 클라이언트 생성 시도
  try {
    return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('Supabase 클라이언트 생성 오류:', error);
    // 폴백 값으로 재시도
    return createBrowserClient<Database>(FALLBACK_SUPABASE_URL, FALLBACK_SUPABASE_ANON_KEY);
  }
}

// 이전 버전과의 호환성을 위한 클라이언트 생성 (하지만 createClient 함수 사용을 권장)
export const supabase = createClient();

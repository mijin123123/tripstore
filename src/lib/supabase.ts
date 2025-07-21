import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database.types';

// 환경 변수에서 Supabase URL과 익명 키 가져오기
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 브라우저 클라이언트 생성 (클라이언트 컴포넌트에서 사용)
export function createClient() {
  console.log('Supabase 클라이언트 생성', supabaseUrl ? '(URL있음)' : '(URL없음)');
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}

// 이전 버전과의 호환성을 위한 클라이언트 생성
export const supabase = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);

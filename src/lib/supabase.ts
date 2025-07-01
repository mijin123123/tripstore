import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Supabase URL과 anon key는 Supabase 프로젝트 설정에서 찾을 수 있습니다.
// 실제 값으로 교체해야 합니다.
// 환경변수로 관리하는 것이 좋습니다.
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 브라우저 환경용 클라이언트
const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

// 서버사이드 렌더링을 위한 클라이언트 생성 함수
export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

export default supabase;

import { createClient } from '@supabase/supabase-js';

// Supabase URL과 anon key는 Supabase 프로젝트 설정에서 찾을 수 있습니다.
// 실제 값으로 교체해야 합니다.
// 환경변수로 관리하는 것이 좋습니다.
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Supabase 클라이언트 초기화
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;

import { createClient } from '@supabase/supabase-js';

/**
 * 관리자 API 호출용 Supabase 클라이언트 (서버 사이드)
 */
export const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL 환경 변수가 설정되지 않았습니다.');
  }
  
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY 환경 변수가 설정되지 않았습니다. Netlify 환경 변수를 확인해주세요.');
  }
  
  return createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};

/**
 * 클라이언트 사이드 관리자 API 호출용 Supabase 클라이언트
 */
export const createBrowserAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

// 호환성을 위해 기본 export 유지
export const supabase = createBrowserAdminClient();

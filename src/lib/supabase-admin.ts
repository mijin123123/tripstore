import { createClient } from '@supabase/supabase-js';

/**
 * 관리자 API 호출용 Supabase 클라이언트 (서버 사이드)
 */
export const createAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
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

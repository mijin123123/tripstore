import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// 환경변수 확인 로깅 (개발 환경에서만)
if (process.env.NODE_ENV === 'development') {
  console.log('Supabase 환경변수 확인:', {
    url: !!supabaseUrl,
    anonKey: !!supabaseAnonKey,
    serviceRoleKey: !!serviceRoleKey,
    urlValue: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'undefined'
  })
}

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = 'Supabase 환경변수가 설정되지 않았습니다.'
  if (process.env.NODE_ENV === 'development') {
    console.error(errorMessage, {
      url: !!supabaseUrl,
      key: !!supabaseAnonKey
    })
  }
  throw new Error(errorMessage)
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
)

// Service role client (서버 사이드에서만 사용)
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  serviceRoleKey || supabaseAnonKey
)

import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// 브라우저 클라이언트 생성
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  
  console.log('supabase-client.ts에서 클라이언트 생성', { url: supabaseUrl ? '설정됨' : '없음' })
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// 서버 클라이언트 생성
export function createServerSupabaseClient() {
  const cookieStore = cookies()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: cookieStore,
  })
}

// 이전 클라이언트와의 호환성을 위한 선언
export const supabase = createClient()

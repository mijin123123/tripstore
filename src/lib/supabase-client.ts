import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database.types'

let clientInstance: ReturnType<typeof createBrowserClient<Database>> | null = null

// 브라우저 클라이언트 생성 (싱글톤 패턴)
export function createClient() {
  // 이미 생성된 클라이언트가 있다면 재사용
  if (clientInstance) {
    return clientInstance
  }
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL 또는 ANON KEY가 설정되지 않았습니다!')
    throw new Error('Supabase 설정이 없습니다')
  }
  
  console.log('supabase-client.ts에서 클라이언트 생성', { url: supabaseUrl ? '설정됨' : '없음' })
  clientInstance = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  return clientInstance
}

// 이전 클라이언트와의 호환성을 위한 함수 (지연 생성)
export const getSupabaseClient = () => createClient()

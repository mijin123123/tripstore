import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database.types'

let clientInstance: ReturnType<typeof createBrowserClient<Database>> | null = null
let isCreating = false

// 브라우저 클라이언트 생성 (싱글톤 패턴 + 중복 생성 방지)
export function createClient() {
  // 이미 생성 중이거나 생성된 클라이언트가 있다면 대기/반환
  if (isCreating) {
    return new Promise<ReturnType<typeof createBrowserClient<Database>>>((resolve) => {
      const checkInterval = setInterval(() => {
        if (clientInstance && !isCreating) {
          clearInterval(checkInterval)
          resolve(clientInstance)
        }
      }, 10)
    })
  }
  
  if (clientInstance) {
    return clientInstance
  }
  
  isCreating = true
  
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase 환경 변수가 설정되지 않았습니다!')
      throw new Error('Supabase 설정이 없습니다')
    }
    
    clientInstance = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
    return clientInstance
  } catch (error) {
    console.error('Supabase 클라이언트 생성 실패:', error)
    throw error
  } finally {
    isCreating = false
  }
}

// 이전 클라이언트와의 호환성을 위한 함수
export const getSupabaseClient = () => createClient()

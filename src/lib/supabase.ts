import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase 환경변수가 설정되지 않았습니다')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
export { createClient }

// 서버사이드용 클라이언트 (RLS 우회 가능)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// 사용자 타입 정의
export interface User {
  id: string
  email: string
  name?: string
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}

// 패키지 타입 정의
export interface Package {
  id: string
  title: string
  description: string
  price: number
  duration: string
  location: string
  image_url?: string
  category: string
  created_at: string
  updated_at: string
}

// 예약 타입 정의
export interface Reservation {
  id: string
  user_id: string
  package_id: string
  start_date: string
  end_date: string
  travelers: number
  total_price: number
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
  updated_at: string
}

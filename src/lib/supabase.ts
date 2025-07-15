import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tmlnroulydvsbpadbpem.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtbG5yb3VseWR2c2JwYWRicGVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDY0NTIsImV4cCI6MjA2Nzk4MjQ1Mn0.062pPf8vv2gS5Qo09AONf8riER0Q_n5u9Mg3WSxgrgk'

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase 환경변수:', { supabaseUrl, supabaseKey })
  throw new Error('Supabase 환경변수가 설정되지 않았습니다')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
export { createClient }

// 서버사이드용 클라이언트 (RLS 우회 가능)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtbG5yb3VseWR2c2JwYWRicGVtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjQwNjQ1MiwiZXhwIjoyMDY3OTgyNDUyfQ.wr6YV9JcJ0__OzWG4VEKLw6fc1DSgPM3VFAHVJvbx78',
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

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 환경 변수 검증
if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase') || supabaseKey.includes('your_supabase')) {
  console.warn('Supabase 환경 변수가 설정되지 않았습니다. 데모 모드로 실행됩니다.')
}

export const supabase = supabaseUrl && supabaseKey && !supabaseUrl.includes('your_supabase') && !supabaseKey.includes('your_supabase')
  ? createClient(supabaseUrl, supabaseKey)
  : null

// 타입 정의
export type Database = {
  public: {
    Tables: {
      packages: {
        Row: {
          id: string
          title: string
          location: string
          price: number
          original_price: number
          duration: string
          description: string
          highlights: string[]
          images: string[]
          rating: number
          reviews: number
          departure_date: string
          available_spots: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          location: string
          price: number
          original_price: number
          duration: string
          description: string
          highlights: string[]
          images: string[]
          rating: number
          reviews: number
          departure_date: string
          available_spots: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          location?: string
          price?: number
          original_price?: number
          duration?: string
          description?: string
          highlights?: string[]
          images?: string[]
          rating?: number
          reviews?: number
          departure_date?: string
          available_spots?: number
          created_at?: string
          updated_at?: string
        }
      }
      reservations: {
        Row: {
          id: string
          package_id: string
          user_email: string
          travelers: number
          departure_date: string
          total_price: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          package_id: string
          user_email: string
          travelers: number
          departure_date: string
          total_price: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          package_id?: string
          user_email?: string
          travelers?: number
          departure_date?: string
          total_price?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

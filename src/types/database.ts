export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          phone: string | null
          password_hash: string | null
          email_verified: boolean
          email_verified_at: string | null
          phone_verified: boolean
          phone_verified_at: string | null
          agree_terms: boolean
          agree_privacy: boolean
          agree_marketing: boolean
          status: 'active' | 'inactive' | 'suspended'
          last_login_at: string | null
          login_count: number
          profile_image_url: string | null
          birth_date: string | null
          gender: 'male' | 'female' | 'other' | null
          address: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          phone?: string | null
          password_hash?: string | null
          email_verified?: boolean
          email_verified_at?: string | null
          phone_verified?: boolean
          phone_verified_at?: string | null
          agree_terms?: boolean
          agree_privacy?: boolean
          agree_marketing?: boolean
          status?: 'active' | 'inactive' | 'suspended'
          last_login_at?: string | null
          login_count?: number
          profile_image_url?: string | null
          birth_date?: string | null
          gender?: 'male' | 'female' | 'other' | null
          address?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          phone?: string | null
          password_hash?: string | null
          email_verified?: boolean
          email_verified_at?: string | null
          phone_verified?: boolean
          phone_verified_at?: string | null
          agree_terms?: boolean
          agree_privacy?: boolean
          agree_marketing?: boolean
          status?: 'active' | 'inactive' | 'suspended'
          last_login_at?: string | null
          login_count?: number
          profile_image_url?: string | null
          birth_date?: string | null
          gender?: 'male' | 'female' | 'other' | null
          address?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          parent_id: string | null
          description: string | null
          image_url: string | null
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          parent_id?: string | null
          description?: string | null
          image_url?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          parent_id?: string | null
          description?: string | null
          image_url?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      packages: {
        Row: {
          id: string
          title: string
          description: string
          destination: string
          category_id: string | null
          category: string | null
          duration: number
          price: number
          departure_date: string
          return_date: string
          max_people: number
          current_bookings: number
          image_url: string | null
          includes: string[]
          excludes: string[]
          itinerary: string
          created_at: string
          updated_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          title: string
          description: string
          destination: string
          category_id?: string | null
          category?: string | null
          duration: number
          price: number
          departure_date: string
          return_date: string
          max_people: number
          current_bookings?: number
          image_url?: string | null
          includes: string[]
          excludes: string[]
          itinerary: string
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          title?: string
          description?: string
          destination?: string
          category_id?: string | null
          category?: string | null
          duration?: number
          price?: number
          departure_date?: string
          return_date?: string
          max_people?: number
          current_bookings?: number
          image_url?: string | null
          includes?: string[]
          excludes?: string[]
          itinerary?: string
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          package_id: string
          traveler_count: number
          total_price: number
          status: 'pending' | 'confirmed' | 'cancelled'
          traveler_details: any[]
          special_requests: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          package_id: string
          traveler_count: number
          total_price: number
          status?: 'pending' | 'confirmed' | 'cancelled'
          traveler_details: any[]
          special_requests?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          package_id?: string
          traveler_count?: number
          total_price?: number
          status?: 'pending' | 'confirmed' | 'cancelled'
          traveler_details?: any[]
          special_requests?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          package_id: string
          rating: number
          comment: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          package_id: string
          rating: number
          comment: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          package_id?: string
          rating?: number
          comment?: string
          created_at?: string
          updated_at?: string
        }
      }
      email_verification_tokens: {
        Row: {
          id: string
          user_id: string
          token: string
          expires_at: string
          created_at: string
          used_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          token: string
          expires_at: string
          created_at?: string
          used_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          token?: string
          expires_at?: string
          created_at?: string
          used_at?: string | null
        }
      }
      password_reset_tokens: {
        Row: {
          id: string
          user_id: string
          token: string
          expires_at: string
          created_at: string
          used_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          token: string
          expires_at: string
          created_at?: string
          used_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          token?: string
          expires_at?: string
          created_at?: string
          used_at?: string | null
        }
      }
      user_sessions: {
        Row: {
          id: string
          user_id: string
          session_token: string
          expires_at: string
          created_at: string
          last_accessed_at: string
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          user_id: string
          session_token: string
          expires_at: string
          created_at?: string
          last_accessed_at?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          session_token?: string
          expires_at?: string
          created_at?: string
          last_accessed_at?: string
          ip_address?: string | null
          user_agent?: string | null
        }
      }
      user_login_history: {
        Row: {
          id: string
          user_id: string
          login_at: string
          ip_address: string | null
          user_agent: string | null
          success: boolean
          failure_reason: string | null
        }
        Insert: {
          id?: string
          user_id: string
          login_at?: string
          ip_address?: string | null
          user_agent?: string | null
          success?: boolean
          failure_reason?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          login_at?: string
          ip_address?: string | null
          user_agent?: string | null
          success?: boolean
          failure_reason?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      booking_status: 'pending' | 'confirmed' | 'cancelled'
    }
  }
}

// 편의를 위한 타입 별칭
export type User = Database['public']['Tables']['users']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Package = Database['public']['Tables']['packages']['Row']
export type Booking = Database['public']['Tables']['bookings']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']

export type InsertUser = Database['public']['Tables']['users']['Insert']
export type InsertCategory = Database['public']['Tables']['categories']['Insert']
export type InsertPackage = Database['public']['Tables']['packages']['Insert']
export type InsertBooking = Database['public']['Tables']['bookings']['Insert']
export type InsertReview = Database['public']['Tables']['reviews']['Insert']

export type UpdateUser = Database['public']['Tables']['users']['Update']
export type UpdateCategory = Database['public']['Tables']['categories']['Update']
export type UpdatePackage = Database['public']['Tables']['packages']['Update']
export type UpdateBooking = Database['public']['Tables']['bookings']['Update']
export type UpdateReview = Database['public']['Tables']['reviews']['Update']

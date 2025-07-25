export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      villa_available_dates: {
        Row: {
          id: number
          villa_id: string
          date: string
          is_available: boolean
          price_modifier: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          villa_id: string
          date: string
          is_available?: boolean
          price_modifier?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          villa_id?: string
          date?: string
          is_available?: boolean
          price_modifier?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "villa_available_dates_villa_id_fkey"
            columns: ["villa_id"]
            isOneToOne: false
            referencedRelation: "villas"
            referencedColumns: ["id"]
          }
        ]
      }
      package_available_dates: {
        Row: {
          id: number
          package_id: string
          date: string
          available_seats: number
          price_modifier: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          package_id: string
          date: string
          available_seats: number
          price_modifier?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          package_id?: string
          date?: string
          available_seats?: number
          price_modifier?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "package_available_dates_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          }
        ]
      }
      promotions: {
        Row: {
          id: number
          title: string
          description: string | null
          discount_percent: number | null
          discount_amount: number | null
          start_date: string
          end_date: string
          promo_code: string | null
          is_active: boolean
          min_purchase: number | null
          max_discount: number | null
          usage_limit: number | null
          usage_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          description?: string | null
          discount_percent?: number | null
          discount_amount?: number | null
          start_date: string
          end_date: string
          promo_code?: string | null
          is_active?: boolean
          min_purchase?: number | null
          max_discount?: number | null
          usage_limit?: number | null
          usage_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          description?: string | null
          discount_percent?: number | null
          discount_amount?: number | null
          start_date?: string
          end_date?: string
          promo_code?: string | null
          is_active?: boolean
          min_purchase?: number | null
          max_discount?: number | null
          usage_limit?: number | null
          usage_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          id: number
          user_id: string
          package_id: string | null
          villa_id: string | null
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          package_id?: string | null
          villa_id?: string | null
          rating: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          package_id?: string | null
          villa_id?: string | null
          rating?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_villa_id_fkey"
            columns: ["villa_id"]
            isOneToOne: false
            referencedRelation: "villas"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          id: number
          name: string
          slug: string
          description: string | null
          image: string | null
          parent_id: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
          description?: string | null
          image?: string | null
          parent_id?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
          description?: string | null
          image?: string | null
          parent_id?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      bookings: {
        Row: {
          booking_date: string
          cost: number
          created_at: string
          end_date: string | null
          id: string
          package_id: string | null
          quantity: number | null
          start_date: string | null
          status: string
          user_id: string
          villa_id: string | null
          payment_status: string | null
          special_requests: string | null
          people_count: number | null
          total_price: number | null
        }
        Insert: {
          booking_date?: string
          cost: number
          created_at?: string
          end_date?: string | null
          id?: string
          package_id?: string | null
          quantity?: number | null
          start_date?: string | null
          status?: string
          user_id: string
          villa_id?: string | null
          payment_status?: string | null
          special_requests?: string | null
          people_count?: number | null
          total_price?: number | null
        }
        Update: {
          booking_date?: string
          cost?: number
          created_at?: string
          end_date?: string | null
          id?: string
          package_id?: string | null
          quantity?: number | null
          start_date?: string | null
          status?: string
          user_id?: string
          villa_id?: string | null
          payment_status?: string | null
          special_requests?: string | null
          people_count?: number | null
          total_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_villa_id_fkey"
            columns: ["villa_id"]
            isOneToOne: false
            referencedRelation: "villas"
            referencedColumns: ["id"]
          }
        ]
      }
      hotels: {
        Row: {
          address: string | null
          amenities: string[] | null
          created_at: string
          description: string | null
          id: string
          image: string
          is_featured: boolean
          location: string
          name: string
          price: string
          rating: number
          region_id: number
          room_types: string[] | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          amenities?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          image: string
          is_featured?: boolean
          location: string
          name: string
          price: string
          rating?: number
          region_id: number
          room_types?: string[] | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          amenities?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          image?: string
          is_featured?: boolean
          location?: string
          name?: string
          price?: string
          rating?: number
          region_id?: number
          room_types?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hotels_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          }
        ]
      }
      packages: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          image: string | null
          is_featured: boolean
          location: string
          name: string
          price: number
          region: string | null
          start_date: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          image?: string | null
          is_featured?: boolean
          location: string
          name: string
          price: number
          region?: string | null
          start_date?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          image?: string | null
          is_featured?: boolean
          location?: string
          name?: string
          price?: number
          region?: string | null
          start_date?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string
          id: string
          payment_date: string
          payment_method: string
          status: string
          user_id: string
          updated_at: string
          transaction_id: string | null
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string
          id?: string
          payment_date?: string
          payment_method?: string
          status?: string
          user_id: string
          updated_at?: string
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string
          id?: string
          payment_date?: string
          payment_method?: string
          status?: string
          user_id?: string
          updated_at?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      regions: {
        Row: {
          id: number
          name: string
          name_ko: string
          slug: string
        }
        Insert: {
          id?: number
          name: string
          name_ko: string
          slug: string
        }
        Update: {
          id?: number
          name?: string
          name_ko?: string
          slug?: string
        }
        Relationships: []
      }
      resorts: {
        Row: {
          amenities: string[] | null
          created_at: string
          description: string | null
          has_beach_access: boolean | null
          has_pool: boolean | null
          id: string
          image: string
          is_featured: boolean
          location: string
          max_people: number | null
          name: string
          price: string
          rating: number
          region_id: number
          updated_at: string
        }
        Insert: {
          amenities?: string[] | null
          created_at?: string
          description?: string | null
          has_beach_access?: boolean | null
          has_pool?: boolean | null
          id?: string
          image: string
          is_featured?: boolean
          location: string
          max_people?: number | null
          name: string
          price: string
          rating?: number
          region_id: number
          updated_at?: string
        }
        Update: {
          amenities?: string[] | null
          created_at?: string
          description?: string | null
          has_beach_access?: boolean | null
          has_pool?: boolean | null
          id?: string
          image?: string
          is_featured?: boolean
          location?: string
          max_people?: number | null
          name?: string
          price?: string
          rating?: number
          region_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "resorts_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          phone: string | null
          role: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name?: string | null
          phone?: string | null
          role?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          phone?: string | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      villas: {
        Row: {
          bath_count: number | null
          bed_count: number | null
          created_at: string
          description: string | null
          features: string[]
          id: string
          image: string
          is_featured: boolean
          location: string
          max_people: number | null
          name: string
          price: string
          rating: number
          region_id: number
          updated_at: string
        }
        Insert: {
          bath_count?: number | null
          bed_count?: number | null
          created_at?: string
          description?: string | null
          features?: string[]
          id?: string
          image: string
          is_featured?: boolean
          location: string
          max_people?: number | null
          name: string
          price: string
          rating?: number
          region_id: number
          updated_at?: string
        }
        Update: {
          bath_count?: number | null
          bed_count?: number | null
          created_at?: string
          description?: string | null
          features?: string[]
          id?: string
          image?: string
          is_featured?: boolean
          location?: string
          max_people?: number | null
          name?: string
          price?: string
          rating?: number
          region_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "villas_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          }
        ]
      }
      hero_images: {
        Row: {
          id: number
          page_type: string
          page_slug: string | null
          title: string
          subtitle: string | null
          image_url: string
          gradient_overlay: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          page_type: string
          page_slug?: string | null
          title: string
          subtitle?: string | null
          image_url: string
          gradient_overlay?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          page_type?: string
          page_slug?: string | null
          title?: string
          subtitle?: string | null
          image_url?: string
          gradient_overlay?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: number
          setting_key: string
          setting_value: string | null
          setting_group: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          setting_key: string
          setting_value?: string | null
          setting_group: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          setting_key?: string
          setting_value?: string | null
          setting_group?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          id: number
          user_id: string
          package_id: string | null
          villa_id: string | null
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          package_id?: string | null
          villa_id?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          package_id?: string | null
          villa_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlists_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlists_villa_id_fkey"
            columns: ["villa_id"]
            isOneToOne: false
            referencedRelation: "villas"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never

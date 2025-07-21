export type Database = {
  public: {
    Tables: {
      packages: {
        Row: {
          id: string;
          type: string;
          region: string;
          regionKo: string;
          title: string;
          price: string;
          duration: string;
          rating: number;
          image: string;
          highlights: string[];
          departure: string;
          description: string;
          itinerary?: {
            day: number;
            title: string;
            description: string;
            accommodation: string;
            meals: {
              breakfast: boolean;
              lunch: boolean;
              dinner: boolean;
            }
          }[];
          included?: string[];
          excluded?: string[];
          notes?: string[];
          features?: string[];
        };
        Insert: Omit<Database['public']['Tables']['packages']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['packages']['Row']>;
      };
      villas: {
        Row: {
          id: string;
          name: string;
          location: string;
          image: string;
          rating: number;
          price: string;
          features: string[];
        };
        Insert: Omit<Database['public']['Tables']['villas']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['villas']['Row']>;
      };
      users: {
        Row: {
          id: string;
          email: string;
          name?: string;
          role?: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['users']['Row']>;
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          package_id?: string;
          villa_id?: string;
          start_date: string;
          end_date: string;
          number_of_people: number;
          total_price: string;
          status: 'pending' | 'confirmed' | 'cancelled';
          created_at?: string;
        };
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['bookings']['Row']>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};

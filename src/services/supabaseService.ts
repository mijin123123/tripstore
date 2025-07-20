import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../utils/config';
import { logger } from '../utils/logger';

class SupabaseService {
  private client: SupabaseClient;

  constructor() {
    if (!config.supabase.url || !config.supabase.anonKey) {
      throw new Error('Supabase URL and anon key are required');
    }

    this.client = createClient(config.supabase.url, config.supabase.anonKey);
    logger.info('Supabase client initialized');
  }

  getClient(): SupabaseClient {
    return this.client;
  }

  // 사용자 관련 메서드
  async signUp(email: string, password: string, userData?: any) {
    try {
      const { data, error } = await this.client.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Error signing up user:', error);
      throw error;
    }
  }

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Error signing in user:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      const { error } = await this.client.auth.signOut();

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      logger.error('Error signing out user:', error);
      throw error;
    }
  }

  async getUser(accessToken: string) {
    try {
      const { data, error } = await this.client.auth.getUser(accessToken);

      if (error) {
        throw error;
      }

      return data.user;
    } catch (error) {
      logger.error('Error getting user:', error);
      throw error;
    }
  }

  // 여행 패키지 관련 메서드
  async getPackages(filters?: any) {
    try {
      let query = this.client.from('travel_packages').select('*');

      if (filters) {
        if (filters.destination) {
          query = query.ilike('destination', `%${filters.destination}%`);
        }
        if (filters.minPrice) {
          query = query.gte('price', filters.minPrice);
        }
        if (filters.maxPrice) {
          query = query.lte('price', filters.maxPrice);
        }
        if (filters.startDate) {
          query = query.gte('start_date', filters.startDate);
        }
        if (filters.endDate) {
          query = query.lte('end_date', filters.endDate);
        }
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Error getting packages:', error);
      throw error;
    }
  }

  async getPackageById(id: string) {
    try {
      const { data, error } = await this.client
        .from('travel_packages')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Error getting package by ID:', error);
      throw error;
    }
  }

  async createPackage(packageData: any) {
    try {
      const { data, error } = await this.client
        .from('travel_packages')
        .insert(packageData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Error creating package:', error);
      throw error;
    }
  }

  async updatePackage(id: string, updateData: any) {
    try {
      const { data, error } = await this.client
        .from('travel_packages')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Error updating package:', error);
      throw error;
    }
  }

  async deletePackage(id: string) {
    try {
      const { error } = await this.client
        .from('travel_packages')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      logger.error('Error deleting package:', error);
      throw error;
    }
  }

  // 예약 관련 메서드
  async createBooking(bookingData: any) {
    try {
      const { data, error } = await this.client
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Error creating booking:', error);
      throw error;
    }
  }

  async getBookingsByUser(userId: string) {
    try {
      const { data, error } = await this.client
        .from('bookings')
        .select(`
          *,
          travel_packages (*)
        `)
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Error getting user bookings:', error);
      throw error;
    }
  }

  async updateBooking(id: string, updateData: any) {
    try {
      const { data, error } = await this.client
        .from('bookings')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Error updating booking:', error);
      throw error;
    }
  }
}

export const supabaseService = new SupabaseService();

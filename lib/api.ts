import { supabase } from './supabase'
import type { Database } from './supabase'

type PackageRow = Database['public']['Tables']['packages']['Row']
type ReservationRow = Database['public']['Tables']['reservations']['Row']
type ReservationInsert = Database['public']['Tables']['reservations']['Insert']

// 데모 데이터 (Supabase 미설정 시 사용)
const demoPackages: PackageRow[] = [
  {
    id: '1',
    title: '일본 도쿄 & 오사카 5일',
    location: '일본',
    price: 1200000,
    original_price: 1500000,
    duration: '4박 5일',
    description: '일본의 전통과 현대가 만나는 도쿄와 오사카를 4박 5일간 완벽하게 체험할 수 있는 패키지입니다.',
    highlights: ['온천 체험', '후지산 투어', '유니버설 스튜디오'],
    images: ['https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80'],
    rating: 4.8,
    reviews: 324,
    departure_date: '2024-03-15',
    available_spots: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    title: '유럽 3국 로맨틱 투어',
    location: '프랑스, 이탈리아, 스위스',
    price: 2800000,
    original_price: 3200000,
    duration: '7박 8일',
    description: '유럽의 낭만을 만끽할 수 있는 프랑스, 이탈리아, 스위스 3국 투어입니다.',
    highlights: ['에펠탑', '로마 콜로세움', '융프라우'],
    images: ['https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80'],
    rating: 4.9,
    reviews: 156,
    departure_date: '2024-03-20',
    available_spots: 12,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    title: '발리 럭셔리 리조트',
    location: '인도네시아',
    price: 1800000,
    original_price: 2200000,
    duration: '5박 6일',
    description: '발리의 아름다운 자연과 럭셔리한 리조트에서 완벽한 휴식을 즐겨보세요.',
    highlights: ['오션뷰 빌라', '스파 패키지', '전용 해변'],
    images: ['https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&q=80'],
    rating: 4.7,
    reviews: 289,
    departure_date: '2024-03-25',
    available_spots: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    title: '뉴욕 & 라스베가스',
    location: '미국',
    price: 2200000,
    original_price: 2600000,
    duration: '6박 7일',
    description: '미국의 대표 도시 뉴욕과 라스베가스에서 특별한 경험을 만들어보세요.',
    highlights: ['브로드웨이 뮤지컬', '그랜드캐니언', '카지노'],
    images: ['https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80'],
    rating: 4.6,
    reviews: 412,
    departure_date: '2024-03-30',
    available_spots: 15,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

// 패키지 관련 API 함수들
export const packageApi = {
  // 모든 패키지 조회
  async getAllPackages(): Promise<PackageRow[]> {
    if (!supabase) {
      console.log('데모 모드: 샘플 데이터를 사용합니다.')
      return demoPackages
    }

    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching packages:', error)
      return demoPackages
    }
    
    return data || demoPackages
  },

  // 인기 패키지 조회 (평점순)
  async getPopularPackages(limit: number = 6): Promise<PackageRow[]> {
    if (!supabase) {
      console.log('데모 모드: 샘플 데이터를 사용합니다.')
      return demoPackages.slice(0, limit)
    }

    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .order('rating', { ascending: false })
      .limit(limit)
    
    if (error) {
      console.error('Error fetching popular packages:', error)
      return demoPackages.slice(0, limit)
    }
    
    return data || demoPackages.slice(0, limit)
  },

  // 특정 패키지 조회
  async getPackageById(id: string): Promise<PackageRow | null> {
    if (!supabase) {
      const found = demoPackages.find(pkg => pkg.id === id)
      return found || null
    }

    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching package:', error)
      const found = demoPackages.find(pkg => pkg.id === id)
      return found || null
    }
    
    return data
  },

  // 패키지 검색
  async searchPackages(searchTerm: string): Promise<PackageRow[]> {
    if (!supabase) {
      const filtered = demoPackages.filter(pkg => 
        pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
      return filtered
    }

    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .or(`title.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error searching packages:', error)
      const filtered = demoPackages.filter(pkg => 
        pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
      return filtered
    }
    
    return data || []
  },

  // 가격 범위로 필터링
  async getPackagesByPriceRange(minPrice: number, maxPrice: number): Promise<PackageRow[]> {
    if (!supabase) {
      return demoPackages.filter(pkg => pkg.price >= minPrice && pkg.price <= maxPrice)
    }

    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .gte('price', minPrice)
      .lte('price', maxPrice)
      .order('price', { ascending: true })
    
    if (error) {
      console.error('Error fetching packages by price range:', error)
      return demoPackages.filter(pkg => pkg.price >= minPrice && pkg.price <= maxPrice)
    }
    
    return data || []
  }
}

// 예약 관련 API 함수들
export const reservationApi = {
  // 예약 생성
  async createReservation(reservation: ReservationInsert): Promise<ReservationRow> {
    if (!supabase) {
      console.log('데모 모드: 실제 예약이 생성되지 않습니다.')
      return {
        id: Math.random().toString(),
        package_id: reservation.package_id,
        user_email: reservation.user_email,
        travelers: reservation.travelers,
        departure_date: reservation.departure_date,
        total_price: reservation.total_price,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }

    const { data, error } = await supabase
      .from('reservations')
      .insert(reservation)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating reservation:', error)
      throw error
    }
    
    return data
  },

  // 사용자 예약 조회
  async getUserReservations(userEmail: string): Promise<ReservationRow[]> {
    if (!supabase) {
      console.log('데모 모드: 예약 데이터가 없습니다.')
      return []
    }

    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        packages (*)
      `)
      .eq('user_email', userEmail)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching user reservations:', error)
      return []
    }
    
    return data || []
  },

  // 예약 상태 업데이트
  async updateReservationStatus(reservationId: string, status: string): Promise<ReservationRow> {
    if (!supabase) {
      console.log('데모 모드: 예약 상태가 업데이트되지 않습니다.')
      return {
        id: reservationId,
        package_id: '',
        user_email: '',
        travelers: 0,
        departure_date: '',
        total_price: 0,
        status: status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }

    const { data, error } = await supabase
      .from('reservations')
      .update({ status })
      .eq('id', reservationId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating reservation status:', error)
      throw error
    }
    
    return data
  },

  // 예약 취소
  async cancelReservation(reservationId: string): Promise<void> {
    if (!supabase) {
      console.log('데모 모드: 예약이 취소되지 않습니다.')
      return
    }

    const { error } = await supabase
      .from('reservations')
      .delete()
      .eq('id', reservationId)
    
    if (error) {
      console.error('Error canceling reservation:', error)
      throw error
    }
  }
}

// 통계 관련 API 함수들
export const statsApi = {
  // 패키지 통계
  async getPackageStats(): Promise<{
    totalPackages: number
    averagePrice: number
    totalReservations: number
  }> {
    if (!supabase) {
      return {
        totalPackages: demoPackages.length,
        averagePrice: demoPackages.reduce((sum, pkg) => sum + pkg.price, 0) / demoPackages.length,
        totalReservations: 0
      }
    }

    const [packagesResult, reservationsResult] = await Promise.all([
      supabase.from('packages').select('price', { count: 'exact' }),
      supabase.from('reservations').select('*', { count: 'exact' })
    ])
    
    if (packagesResult.error || reservationsResult.error) {
      console.error('Error fetching stats:', packagesResult.error || reservationsResult.error)
      return {
        totalPackages: demoPackages.length,
        averagePrice: demoPackages.reduce((sum, pkg) => sum + pkg.price, 0) / demoPackages.length,
        totalReservations: 0
      }
    }
    
    const totalPackages = packagesResult.count || 0
    const averagePrice = packagesResult.data?.reduce((sum, pkg) => sum + pkg.price, 0) / totalPackages || 0
    const totalReservations = reservationsResult.count || 0
    
    return {
      totalPackages,
      averagePrice,
      totalReservations
    }
  }
}

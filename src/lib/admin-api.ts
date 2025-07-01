import { supabase } from '@/lib/supabase-admin';

interface Reservation {
  id: string;
  status: string;
  total_price: number | string;
  created_at: string;
  contact_email: string;
  [key: string]: any;
}

interface Package {
  id: string;
  price: number;
  isfeatured: boolean;
  isonsale: boolean;
  category: string;
  [key: string]: any;
}

interface Notice {
  id: string;
  is_important: boolean;
  created_at: string;
  [key: string]: any;
}

interface CategoryStats {
  [key: string]: number;
}

// 월간 예약 데이터 타입 정의
interface MonthlyStats {
  month: string;
  count: number;
  revenue: number;
}

// 대시보드 반환 타입에 새로운 필드 추가
interface DashboardStats {
  packageCount: number;
  featuredPackageCount: number;
  uniqueUsers: number;
  thisMonthReservationCount: number;
  totalReservationCount: number;
  totalRevenue: number;
  confirmedReservations: number;
  cancelledReservations: number;
  categoryStats: CategoryStats;
  recentReservations: Reservation[];
  importantNotices: Notice[];
  monthlyStats: MonthlyStats[];
  topPackages: Package[];
  recentCancellations: Reservation[];
}

/**
 * 대시보드 통계를 가져옵니다.
 */
export async function getDashboardStats() {
  try {
    // 패키지 통계
    const { data: packages, error: packagesError } = await supabase
      .from('packages')
      .select('id, price, isfeatured, isonsale, category');
    
    if (packagesError) throw packagesError;
    
    // 예약 통계
    const { data: reservations, error: reservationsError } = await supabase
      .from('reservations')
      .select('id, status, total_price, created_at, contact_email');
    
    if (reservationsError) throw reservationsError;
    
    // 공지사항 통계
    const { data: notices, error: noticesError } = await supabase
      .from('notices')
      .select('id, is_important, created_at')
      .order('created_at', { ascending: false });
    
    if (noticesError) throw noticesError;
    
    // 사용자 통계 (고유 이메일)
    const uniqueUsers = reservations ? 
      [...new Set(reservations.map((r: Reservation) => r.contact_email))].length : 
      0;
    
    // 이번 달 예약 수
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthReservations = reservations ? 
      reservations.filter((r: Reservation) => {
        const date = new Date(r.created_at);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      }) : 
      [];
      
    // 총 매출액
    const totalRevenue = reservations ? 
      reservations.reduce((sum: number, r: Reservation) => sum + (parseFloat(String(r.total_price)) || 0), 0) : 
      0;
    
    // 확정된 예약
    const confirmedReservations = reservations ?
      reservations.filter((r: Reservation) => r.status === 'confirmed').length :
      0;
    
    // 취소된 예약
    const cancelledReservations = reservations ?
      reservations.filter((r: Reservation) => r.status === 'cancelled').length :
      0;
    
    // 카테고리별 패키지 수
    const categoryStats: CategoryStats = {};
    if (packages) {
      packages.forEach((pkg: Package) => {
        if (!pkg.category) return;
        categoryStats[pkg.category] = (categoryStats[pkg.category] || 0) + 1;
      });
    }
    
    // 최근 예약
    const recentReservations = reservations ? 
      [...reservations].sort((a: Reservation, b: Reservation) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5) : 
      [];
    
    // 중요 공지사항
    const importantNotices = notices ? 
      notices.filter((n: Notice) => n.is_important).slice(0, 5) : 
      [];
    
    // 월별 예약 통계
    function getMonthlyStats(reservations: Reservation[]): MonthlyStats[] {
      if (!reservations || reservations.length === 0) return [];
      
      const months: { [key: string]: MonthlyStats } = {};
      
      // 최근 6개월 기준으로 통계를 계산합니다
      const today = new Date();
      for (let i = 0; i < 6; i++) {
        const d = new Date(today);
        d.setMonth(d.getMonth() - i);
        const monthKey = `${d.getFullYear()}-${d.getMonth() + 1}`;
        const monthName = d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short' });
        
        months[monthKey] = {
          month: monthName,
          count: 0,
          revenue: 0
        };
      }
      
      // 예약 데이터로 월별 통계 계산
      reservations.forEach(reservation => {
        const date = new Date(reservation.created_at);
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        
        // 최근 6개월 데이터만 처리
        if (months[monthKey]) {
          months[monthKey].count++;
          months[monthKey].revenue += parseFloat(String(reservation.total_price)) || 0;
        }
      });
      
      // 날짜 순으로 정렬하여 배열로 변환
      return Object.values(months).reverse();
    }
    
    // 인기 있는 패키지 목록
    async function getTopPackages(limit = 5): Promise<any[]> {
      try {
        const { data, error } = await supabase
          .from('packages')
          .select(`
            id, 
            title, 
            price, 
            category,
            isfeatured,
            isonsale,
            reservations:reservations(id)
          `)
          .limit(limit);
        
        if (error) throw error;
        
        // 예약 수에 따라 정렬
        return data
          .map((pkg: any) => ({
            ...pkg,
            reservationCount: pkg.reservations ? pkg.reservations.length : 0
          }))
          .sort((a: any, b: any) => b.reservationCount - a.reservationCount);
      } catch (error) {
        console.error('인기 패키지 가져오기 오류:', error);
        return [];
      }
    }
    
    const monthlyStats = getMonthlyStats(reservations);
    const topPackages = await getTopPackages();
    
    // 최근 취소된 예약
    const recentCancellations = reservations ? 
      [...reservations]
        .filter((r: Reservation) => r.status === 'cancelled')
        .sort((a: any, b: any) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ).slice(0, 3) :
      [];
    
    return {
      packageCount: packages?.length || 0,
      featuredPackageCount: packages?.filter((p: Package) => p.isfeatured).length || 0,
      uniqueUsers,
      thisMonthReservationCount: thisMonthReservations.length,
      totalReservationCount: reservations?.length || 0,
      totalRevenue,
      confirmedReservations,
      cancelledReservations,
      categoryStats,
      recentReservations,
      importantNotices,
      monthlyStats,
      topPackages,
      recentCancellations
    };
  } catch (error) {
    console.error('대시보드 통계 불러오기 오류:', error);
    return {
      packageCount: 0,
      featuredPackageCount: 0,
      uniqueUsers: 0,
      thisMonthReservationCount: 0,
      totalReservationCount: 0,
      totalRevenue: 0,
      confirmedReservations: 0,
      cancelledReservations: 0,
      categoryStats: {},
      recentReservations: [],
      importantNotices: [],
      monthlyStats: [],
      topPackages: [],
      recentCancellations: []
    };
  }
}

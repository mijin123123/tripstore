"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Package, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Clock,
  MapPin,
  Phone,
  Mail,
  Star,
  Activity,
  BarChart3,
  PieChart
} from 'lucide-react';

interface ReservationData {
  id: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  status: string;
  created_at: string;
  packages?: {
    title: string;
    price: number;
  };
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPackages: 0,
    totalReservations: 0,
    recentReservations: [] as ReservationData[],
    monthlyGrowth: 0,
    todayReservations: 0,
    pendingReservations: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    const checkAuth = () => {
      const adminAuth = sessionStorage.getItem('isAdminAuthenticated');
      if (adminAuth !== 'true') {
        router.replace('/admin/login');
      } else {
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchDashboardData = async () => {
      try {
        // API를 통해 데이터 가져오기
        const [packagesRes, reservationsRes, noticesRes] = await Promise.all([
          fetch('/api/packages'),
          fetch('/api/reservations'),
          fetch('/api/notices')
        ]);

        // 각 응답 확인
        const packages = packagesRes.ok ? await packagesRes.json() : [];
        const reservations = reservationsRes.ok ? await reservationsRes.json() : [];
        const notices = noticesRes.ok ? await noticesRes.json() : [];

        // 에러 로깅
        if (!packagesRes.ok) {
          console.error('패키지 API 오류:', packagesRes.status, packagesRes.statusText);
        }
        if (!reservationsRes.ok) {
          console.error('예약 API 오류:', reservationsRes.status, reservationsRes.statusText);
        }
        if (!noticesRes.ok) {
          console.error('공지사항 API 오류:', noticesRes.status, noticesRes.statusText);
        }

        // 통계 계산
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

        const todayReservations = Array.isArray(reservations) ? reservations.filter((r: any) => 
          new Date(r.created_at) >= todayStart
        ).length : 0;

        const thisMonthReservations = Array.isArray(reservations) ? reservations.filter((r: any) => 
          new Date(r.created_at) >= monthStart
        ).length : 0;

        const lastMonthReservations = Array.isArray(reservations) ? reservations.filter((r: any) => {
          const date = new Date(r.created_at);
          return date >= lastMonthStart && date <= lastMonthEnd;
        }).length : 0;

        const monthlyGrowth = lastMonthReservations > 0 
          ? ((thisMonthReservations - lastMonthReservations) / lastMonthReservations) * 100
          : 0;

        const pendingReservations = Array.isArray(reservations) ? reservations.filter((r: any) => 
          r.status === 'pending' || r.status === '대기중'
        ).length : 0;

        // 총 수익 계산 (확정된 예약만)
        const totalRevenue = Array.isArray(reservations) ? reservations
          .filter((r: any) => r.status === 'confirmed' || r.status === '확정')
          .reduce((sum: number, r: any) => {
            const packageData = Array.isArray(packages) ? packages.find((p: any) => p.id === r.package_id) : null;
            return sum + (packageData?.price || 0);
          }, 0) : 0;

        // 최근 예약 (상위 5개)
        const recentReservations = Array.isArray(reservations) ? reservations
          .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5)
          .map((r: any) => ({
            ...r,
            packages: Array.isArray(packages) ? packages.find((p: any) => p.id === r.package_id) : null
          })) : [];

        setStats({
          totalUsers: 0, // 사용자 정보가 없는 경우
          totalPackages: Array.isArray(packages) ? packages.length : 0,
          totalReservations: Array.isArray(reservations) ? reservations.length : 0,
          recentReservations,
          monthlyGrowth,
          todayReservations,
          pendingReservations,
          totalRevenue,
        });
      } catch (error) {
        console.error('대시보드 데이터 가져오기 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>인증 정보를 확인 중입니다...</p>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">관리자 대시보드 로딩 중...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">분석 대시보드</h1>
          <p className="text-gray-600 mt-2">비즈니스 성과와 주요 지표를 한눈에 확인하세요</p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Packages */}
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">총 패키지</p>
                  <p className="text-3xl font-bold">{stats.totalPackages}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Package className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Reservations */}
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">총 예약</p>
                  <p className="text-3xl font-bold">{stats.totalReservations}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Calendar className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Reservations */}
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">오늘 예약</p>
                  <p className="text-3xl font-bold">{stats.todayReservations}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Revenue */}
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">총 수익</p>
                  <p className="text-3xl font-bold">
                    ₩{stats.totalRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">월간 성장률</p>
                  <p className={`text-2xl font-bold ${stats.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.monthlyGrowth.toFixed(1)}%
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stats.monthlyGrowth >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                  {stats.monthlyGrowth >= 0 ? (
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  ) : (
                    <TrendingDown className="h-6 w-6 text-red-600" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">대기중 예약</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pendingReservations}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Activity className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">평균 예약가</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₩{stats.totalReservations > 0 ? Math.round(stats.totalRevenue / stats.totalReservations).toLocaleString() : 0}
                  </p>
                </div>
                <div className="bg-gray-100 p-3 rounded-full">
                  <BarChart3 className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Reservations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              최근 예약 현황
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentReservations.length > 0 ? (
              <div className="space-y-4">
                {stats.recentReservations.map((reservation) => (
                  <div key={reservation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{reservation.contact_name}</p>
                        <p className="text-sm text-gray-500">{reservation.packages?.title || '패키지 정보 없음'}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                          <span className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {reservation.contact_phone}
                          </span>
                          <span className="flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {reservation.contact_email}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(reservation.created_at).toLocaleDateString('ko-KR')}
                      </p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        reservation.status === 'confirmed' || reservation.status === '확정'
                          ? 'bg-green-100 text-green-800'
                          : reservation.status === 'pending' || reservation.status === '대기중'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {reservation.status}
                      </span>
                      {reservation.packages?.price && (
                        <p className="text-sm text-gray-500 mt-1">
                          ₩{reservation.packages.price.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">최근 예약이 없습니다.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

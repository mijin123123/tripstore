"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPackages: 0,
    totalReservations: 0,
    recentReservations: [] as any[],
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // 클라이언트 측에서만 실행되도록 함
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 동적으로 supabase 클라이언트를 import
        const { createClient } = await import('@/lib/supabase');
        const supabase = createClient();
        
        // 사용자 수 가져오기
        const { count: userCount } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });
        
        // 패키지 수 가져오기
        const { count: packageCount } = await supabase
          .from('packages')
          .select('*', { count: 'exact', head: true });
        
        // 예약 수 가져오기
        const { count: reservationCount } = await supabase
          .from('reservations')
          .select('*', { count: 'exact', head: true });
        
        // 최근 예약 가져오기
        const { data: recentReservations } = await supabase
          .from('reservations')
          .select('*, packages(title)')
          .order('created_at', { ascending: false })
          .limit(5);
        
        setStats({
          totalUsers: userCount || 0,
          totalPackages: packageCount || 0,
          totalReservations: reservationCount || 0,
          recentReservations: recentReservations || [],
        });
      } catch (error) {
        console.error('대시보드 데이터 가져오기 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">로딩 중...</div>;
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">관리자 대시보드</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>총 사용자</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>총 패키지</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalPackages}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>총 예약</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalReservations}</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>최근 예약</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentReservations.length > 0 ? (
            <div className="space-y-4">
              {stats.recentReservations.map((reservation) => (
                <div key={reservation.id} className="p-4 border rounded-md">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{reservation.contact_name}</p>
                      <p className="text-sm text-gray-500">{reservation.packages?.title || '패키지 정보 없음'}</p>
                    </div>
                    <div className="text-right">
                      <p>{new Date(reservation.created_at).toLocaleDateString()}</p>
                      <p className="text-sm">{reservation.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">최근 예약이 없습니다.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

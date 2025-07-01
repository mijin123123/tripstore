import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, Calendar, CreditCard, TrendingUp, AlertTriangle } from "lucide-react";
import { formatCurrency, formatDate } from '@/lib/utils';
import { getDashboardStats } from '@/lib/admin-api';

export default async function DashboardPage() {
  // 대시보드 통계 가져오기
  const stats = await getDashboardStats();
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">대시보드</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">총 패키지</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.packageCount}</div>
            <p className="text-xs text-muted-foreground">
              추천 패키지: {stats.featuredPackageCount}개
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">고유 사용자</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueUsers}</div>
            <p className="text-xs text-muted-foreground">
              등록된 고유 예약자 수
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">이번 달 예약</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisMonthReservationCount}</div>
            <p className="text-xs text-muted-foreground">
              총 예약: {stats.totalReservationCount}건
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">총 매출</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              평균 예약 금액: {formatCurrency(stats.totalRevenue / (stats.totalReservationCount || 1))}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">예약 상태</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.confirmedReservations}</div>
            <p className="text-xs text-muted-foreground">
              확정 예약: {(stats.confirmedReservations / (stats.totalReservationCount || 1) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">주의 필요</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-md font-bold">{stats.cancelledReservations}건의 취소</div>
            <p className="text-xs text-muted-foreground">
              중요 공지: {stats.importantNotices.length || 0}건
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>최근 예약</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.recentReservations.length > 0 ? (
              stats.recentReservations.map((reservation, index) => (
                <div key={reservation.id} className={index < stats.recentReservations.length - 1 ? "border-b pb-2" : ""}>
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{reservation.contact_name || '이름 없음'}</p>
                      <p className="text-sm text-muted-foreground">예약 ID: {reservation.id.substring(0, 8)}...</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(reservation.total_price)}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(reservation.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">예약 정보가 없습니다.</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>카테고리별 패키지</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.keys(stats.categoryStats).length > 0 ? (
                (() => {
                  // 정렬 및 퍼센트 계산
                  const sortedCategories = Object.entries(stats.categoryStats)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5);
                  
                  const total = stats.packageCount;
                  
                  return sortedCategories.map(([category, count]) => {
                    const percent = Math.round((count as number / total) * 100);
                    
                    return (
                      <div key={category} className="flex items-center">
                        <div className="w-full">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{category}</span>
                            <span className="text-sm font-medium">{percent}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()
              ) : (
                <p className="text-center text-gray-500">패키지 정보가 없습니다.</p>
              )}
            </div>
          </CardContent>
        </Card>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>예약 상태별 통계</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.totalReservationCount > 0 ? (
                (() => {
                  // 상태별 예약 수 계산
                  const statuses = {
                    pending: stats.totalReservationCount - stats.confirmedReservations - stats.cancelledReservations,
                    confirmed: stats.confirmedReservations,
                    cancelled: stats.cancelledReservations
                  };
                  
                  const statusLabels = {
                    pending: '대기중',
                    confirmed: '확정됨',
                    cancelled: '취소됨'
                  };
                  
                  const statusColors = {
                    pending: 'bg-yellow-500',
                    confirmed: 'bg-green-500',
                    cancelled: 'bg-red-500'
                  };
                  
                  const total = stats.totalReservationCount;
                  
                  return Object.entries(statuses).map(([status, count]) => {
                    const percent = Math.round((count as number / total) * 100) || 0;
                    
                    return (
                      <div key={status} className="flex items-center">
                        <div className="w-full">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{statusLabels[status as keyof typeof statusLabels]}</span>
                            <span className="text-sm font-medium">{count}건 ({percent}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`${statusColors[status as keyof typeof statusColors]} h-2 rounded-full`} 
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()
              ) : (
                <p className="text-center text-gray-500">예약 정보가 없습니다.</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>중요 공지사항</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.importantNotices.length > 0 ? (
                stats.importantNotices.map((notice, index) => (
                  <div key={notice.id} className={index < stats.importantNotices.length - 1 ? "border-b pb-2" : ""}>
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">{notice.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(notice.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">중요 공지사항이 없습니다.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* 월별 예약 통계 섹션 추가 */}
      <div className="grid grid-cols-1 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>월별 예약 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <div className="flex flex-col space-y-3">
                {stats.monthlyStats.map((month) => (
                  <div key={month.month} className="flex items-center">
                    <div className="w-24 text-sm">{month.month}</div>
                    <div className="flex-1 h-8 bg-gray-100 rounded-md relative">
                      <div
                        className="h-full bg-blue-500 rounded-md"
                        style={{
                          width: `${Math.min(
                            100,
                            (month.count / Math.max(...stats.monthlyStats.map(m => m.count), 1)) * 100
                          )}%`
                        }}
                      />
                      <div className="absolute top-1/2 right-2 transform -translate-y-1/2 text-xs font-medium">
                        {month.count}건 ({formatCurrency(month.revenue)})
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* 인기 패키지 및 취소된 예약 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>인기 패키지</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.topPackages.length > 0 ? (
              <div>
                {stats.topPackages.map((pkg, i) => (
                  <div key={pkg.id} className="flex items-center gap-4 mb-4 p-3 rounded-lg border">
                    <div className={`h-10 w-10 rounded-md flex items-center justify-center ${
                      i === 0 ? 'bg-yellow-100 text-yellow-700' : 
                      i === 1 ? 'bg-gray-200 text-gray-700' : 
                      i === 2 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{pkg.title}</p>
                      <p className="text-sm text-gray-500">{formatCurrency(pkg.price)} • {pkg.category}</p>
                    </div>
                    <div className="text-sm font-medium">
                      {pkg.reservationCount}건
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                패키지 데이터가 없습니다.
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>최근 취소된 예약</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.recentCancellations.length > 0 ? (
              <div>
                {stats.recentCancellations.map((reservation) => (
                  <div key={reservation.id} className="flex items-center gap-4 mb-4 p-3 rounded-lg border border-red-100 bg-red-50">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {reservation.contact_email}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(reservation.total_price)} • {formatDate(reservation.created_at)}
                      </p>
                    </div>
                    <a 
                      href={`/admin/reservations/${reservation.id}`}
                      className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-800 hover:bg-red-200"
                    >
                      상세보기
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                최근 취소된 예약이 없습니다.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

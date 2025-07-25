'use client'

import { useEffect, useState } from 'react'
import { Search, CalendarDays, Users, Calendar, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react'
import Link from 'next/link'

type Booking = {
  id: string
  user_id: string
  package_id: string | null
  villa_id?: string | null
  booking_date: string
  start_date: string | null
  end_date: string | null
  quantity: number | null
  cost: number
  status: string
  payment_status?: string
  special_requests?: string | null
  people_count?: number
  total_price?: number
  created_at: string
  packages?: {
    name: string
    image: string | null
  } | null
  villas?: {
    name: string
    image: string
  } | null
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [paymentFilter, setPaymentFilter] = useState<string>('all')
  
  // 예약자 정보를 파싱하는 함수
  const parseBookingInfo = (specialRequests: string | null | undefined) => {
    try {
      if (!specialRequests) return { name: '알 수 없음', email: '알 수 없음' }
      
      const parsed = JSON.parse(specialRequests)
      const travelerInfo = parsed.travelerInfo
      
      if (travelerInfo) {
        return {
          name: travelerInfo.name || '알 수 없음',
          email: travelerInfo.email || '알 수 없음'
        }
      }
      
      return { name: '알 수 없음', email: '알 수 없음' }
    } catch (error) {
      return { name: '알 수 없음', email: '알 수 없음' }
    }
  }

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true)
      
      try {
        console.log('예약 데이터 로딩 시작...')
        
        // API 엔드포인트를 통해 예약 데이터 가져오기
        const response = await fetch('/api/bookings');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('API 응답:', result);
        
        if (result.bookings && Array.isArray(result.bookings)) {
          // API에서 받은 데이터를 기존 타입에 맞게 변환
          const typedData = result.bookings.map((booking: any) => ({
            id: booking.id || `booking-${Date.now()}-${Math.random()}`,
            user_id: booking.user_id || '00000000-0000-0000-0000-000000000000',
            package_id: booking.package_id || null,
            villa_id: booking.villa_id || null,
            booking_date: booking.booking_date || booking.created_at || new Date().toISOString(),
            start_date: booking.start_date || null,
            end_date: booking.end_date || null,
            quantity: booking.quantity || booking.travelerCount || 1,
            cost: booking.cost || booking.totalAmount || booking.total_price || 0,
            status: booking.status || 'pending',
            payment_status: booking.payment_status || 'pending',
            special_requests: booking.special_requests || booking.specialRequests || null,
            people_count: booking.people_count || booking.travelerCount || 1,
            total_price: booking.total_price || booking.totalAmount || booking.cost || 0,
            created_at: booking.created_at || new Date().toISOString(),
            packages: booking.package_id ? {
              name: `패키지 ${booking.package_id}`,
              image: null
            } : null,
            villas: null
          }));
          
          console.log('변환된 예약 데이터:', typedData);
          setBookings(typedData);
        } else {
          console.log('예약 데이터가 없습니다.');
          setBookings([]);
        }
      } catch (error) {
        console.error('예약 데이터 로딩 오류:', error);
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookings();
  }, []);
  
  // 필터링 로직
  const filteredBookings = bookings.filter(booking => {
    // 예약자 정보 파싱
    const bookingInfo = parseBookingInfo(booking.special_requests)
    
    // 검색어 필터
    const searchMatch = !searchQuery ||
      bookingInfo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookingInfo.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.packages?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toString().includes(searchQuery);

    // 상태 필터
    const statusMatch = statusFilter === 'all' || booking.status === statusFilter;

    // 결제 상태 필터
    const paymentMatch = paymentFilter === 'all' || booking.payment_status === paymentFilter;

    return searchMatch && statusMatch && paymentMatch;
  });

  // 상태 업데이트 함수
  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      console.log(`예약 ${bookingId} 상태를 ${newStatus}로 변경 시도`);
      
      const response = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: bookingId,
          status: newStatus
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '상태 업데이트 실패');
      }

      const result = await response.json();
      console.log('상태 업데이트 성공:', result);

      // 로컬 상태 업데이트
      setBookings(bookings.map(booking =>
        booking.id === bookingId
          ? { ...booking, status: newStatus }
          : booking
      ));
      
      alert('예약 상태가 업데이트되었습니다.');
    } catch (error) {
      console.error('상태 업데이트 오류:', error);
      alert(`상태 업데이트에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  };

  // 결제 상태 업데이트 함수
  const updatePaymentStatus = async (bookingId: string, newPaymentStatus: string) => {
    try {
      console.log(`예약 ${bookingId} 결제 상태를 ${newPaymentStatus}로 변경 시도`);
      
      const response = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: bookingId,
          payment_status: newPaymentStatus
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '결제 상태 업데이트 실패');
      }

      const result = await response.json();
      console.log('결제 상태 업데이트 성공:', result);

      // 로컬 상태 업데이트
      setBookings(bookings.map(booking =>
        booking.id === bookingId
          ? { ...booking, payment_status: newPaymentStatus }
          : booking
      ));
      
      alert('결제 상태가 업데이트되었습니다.');
    } catch (error) {
      console.error('결제 상태 업데이트 오류:', error);
      alert(`결제 상태 업데이트에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  };

  // 상태 표시 컴포넌트
  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'confirmed': return 'bg-green-100 text-green-800';
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        case 'completed': return 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const getStatusText = (status: string) => {
      switch (status) {
        case 'confirmed': return '확정';
        case 'pending': return '대기중';
        case 'cancelled': return '취소됨';
        case 'completed': return '완료';
        default: return status;
      }
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
        {getStatusText(status)}
      </span>
    );
  };

  // 통계 계산
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">예약 관리</h1>
        <p className="text-gray-600">고객 예약 현황을 확인하고 관리하세요.</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">전체</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">대기중</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">확정</p>
              <p className="text-2xl font-bold text-gray-900">{stats.confirmed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">취소</p>
              <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="고객명, 이메일, 상품명 검색..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">모든 예약 상태</option>
              <option value="pending">대기중</option>
              <option value="confirmed">확정</option>
              <option value="cancelled">취소됨</option>
              <option value="completed">완료</option>
            </select>
            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
            >
              <option value="all">모든 결제 상태</option>
              <option value="pending">결제대기</option>
              <option value="paid">결제완료</option>
              <option value="refunded">환불완료</option>
              <option value="failed">결제실패</option>
            </select>
          </div>
        </div>
      </div>

      {/* 예약 목록 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            예약 목록 ({filteredBookings.length}건)
          </h2>
        </div>
        
        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center">
            <CalendarDays className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">등록된 예약이 없습니다</h3>
            <p className="mt-1 text-sm text-gray-500">새로운 예약이 들어오면 여기에 표시됩니다.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    예약자 정보
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상품 정보
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    일정
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    인원/금액
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => {
                  const bookingInfo = parseBookingInfo(booking.special_requests)
                  return (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {bookingInfo.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {bookingInfo.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {booking.packages?.name || `패키지 ${booking.package_id}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {booking.package_id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>출발일: {booking.start_date || '미정'}</div>
                      <div>예약일: {new Date(booking.booking_date).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{booking.people_count || booking.quantity}명</div>
                      <div className="font-medium text-gray-900">
                        {(booking.total_price || booking.cost)?.toLocaleString()}원
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={booking.status} />
                      <div className="mt-1">
                        <StatusBadge status={booking.payment_status || 'pending'} />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <select
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                          value={booking.status}
                          onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                        >
                          <option value="pending">대기중</option>
                          <option value="confirmed">확정</option>
                          <option value="cancelled">취소</option>
                          <option value="completed">완료</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

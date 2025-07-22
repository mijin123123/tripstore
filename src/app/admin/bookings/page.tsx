'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Search, CalendarDays, Users, Calendar, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react'
import Link from 'next/link'

type Booking = {
  id: string
  user_id: string
  package_id: string | null
  villa_id?: string | null // 선택적 필드
  booking_date: string
  start_date: string | null
  end_date: string | null
  quantity: number | null
  cost: number
  status: string
  payment_status?: string // 선택적 필드
  special_requests?: string | null // 선택적 필드
  people_count?: number // 선택적 필드
  total_price?: number // 선택적 필드
  created_at: string
  users: {
    name: string | null
    email: string
  }
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
  
  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true)
      const supabase = createClient()
      
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            users (name, email),
            packages (name, image),
            villas (name, image)
          `)
          .order('created_at', { ascending: false })
        
        if (error) {
          throw error
        }
        
        // 타입 변환을 통해 데이터 구조 맞추기
        const typedData = (data || []).map(booking => {
          // 패키지와 빌라 데이터 정리
          let packages = null;
          if (booking.packages) {
            // @ts-ignore - 타입 안전성을 위한 수동 변환
            packages = {
              name: booking.packages.name || '',
              image: booking.packages.image
            };
          }
          
          let villas = null;
          if (booking.villas && typeof booking.villas === 'object' && !('code' in booking.villas)) {
            // @ts-ignore - 타입 안전성을 위한 수동 변환
            villas = {
              name: booking.villas.name || '',
              image: booking.villas.image || ''
            };
          }
          
          // 명시적으로 필요한 필드만 선택하여 새 객체 생성
          return {
            id: booking.id,
            user_id: booking.user_id,
            package_id: booking.package_id,
            villa_id: booking.villa_id || null,
            booking_date: booking.booking_date,
            start_date: booking.start_date,
            end_date: booking.end_date,
            people_count: booking.quantity || 2,
            total_price: booking.cost,
            status: booking.status,
            payment_status: booking.status, // 결제 상태 필드가 없으면 일반 상태로 대체
            special_requests: null,
            created_at: booking.created_at,
            users: booking.users,
            packages: packages,
            villas: villas
          } as Booking;
        });
        
        setBookings(typedData)
      } catch (error) {
        console.error('예약을 가져오는 데 실패했습니다:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchBookings()
  }, [])
  
  // 필터링 로직
  const filteredBookings = bookings.filter(booking => {
    // 검색어 필터
    const searchMatch = 
      booking.users?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.users?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.packages?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.villas?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toString().includes(searchQuery);
    
    // 상태 필터
    const statusMatch = statusFilter === 'all' || booking.status === statusFilter;
    
    // 결제 상태 필터
    const paymentMatch = paymentFilter === 'all' || booking.payment_status === paymentFilter;
    
    return searchMatch && statusMatch && paymentMatch;
  });
  
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', id)
      
      if (error) {
        throw error
      }
      
      // 상태 업데이트
      setBookings(bookings.map(booking => 
        booking.id === id ? { ...booking, status: newStatus } : booking
      ))
    } catch (error) {
      console.error('예약 상태 업데이트에 실패했습니다:', error)
    }
  }
  
  const handleUpdatePaymentStatus = async (id: string, newStatus: string) => {
    try {
      const supabase = createClient()
      // payment_status 필드가 없으므로 상태를 메모로 저장
      // 실제로는 status 필드 또는 메타데이터로 저장하는 것이 좋습니다
      const { error } = await supabase
        .from('bookings')
        .update({ status: `payment:${newStatus}` }) // 임시 해결책: status 필드에 payment 상태 저장
        .eq('id', id)
      
      if (error) {
        throw error
      }
      
      // 상태 업데이트
      setBookings(bookings.map(booking => 
        booking.id === id ? { ...booking, payment_status: newStatus } : booking
      ))
    } catch (error) {
      console.error('결제 상태 업데이트에 실패했습니다:', error)
    }
  }
  
  // 상태별 예약 수
  const pendingCount = bookings.filter(b => b.status === 'pending').length
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length
  const completedCount = bookings.filter(b => b.status === 'completed').length
  const cancelledCount = bookings.filter(b => b.status === 'cancelled').length
  
  // 결제 상태별 예약 수
  const unpaidCount = bookings.filter(b => b.payment_status === 'unpaid').length
  const partialCount = bookings.filter(b => b.payment_status === 'partial').length
  const paidCount = bookings.filter(b => b.payment_status === 'paid').length
  
  if (isLoading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
      </div>
    )
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">예약 관리</h1>
      </div>
      
      {/* 검색 및 필터 */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="고객명, 이메일, 상품명 검색..."
            className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">모든 예약 상태</option>
            <option value="pending">대기중</option>
            <option value="confirmed">확정</option>
            <option value="completed">완료</option>
            <option value="cancelled">취소됨</option>
          </select>
        </div>
        
        <div>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">모든 결제 상태</option>
            <option value="unpaid">미결제</option>
            <option value="partial">부분 결제</option>
            <option value="paid">결제 완료</option>
          </select>
        </div>
      </div>
      
      {/* 예약 통계 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center mb-2">
            <Clock className="h-5 w-5 text-yellow-500 mr-2" />
            <span className="font-medium">대기중</span>
          </div>
          <p className="text-2xl font-bold">{pendingCount}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center mb-2">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span className="font-medium">확정</span>
          </div>
          <p className="text-2xl font-bold">{confirmedCount}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center mb-2">
            <Calendar className="h-5 w-5 text-blue-500 mr-2" />
            <span className="font-medium">완료</span>
          </div>
          <p className="text-2xl font-bold">{completedCount}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center mb-2">
            <XCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="font-medium">취소됨</span>
          </div>
          <p className="text-2xl font-bold">{cancelledCount}</p>
        </div>
      </div>
      
      {/* 예약 목록 */}
      {filteredBookings.length > 0 ? (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-sm">
                  <th className="px-6 py-3 font-medium text-gray-500">ID</th>
                  <th className="px-6 py-3 font-medium text-gray-500">고객</th>
                  <th className="px-6 py-3 font-medium text-gray-500">상품</th>
                  <th className="px-6 py-3 font-medium text-gray-500">예약일</th>
                  <th className="px-6 py-3 font-medium text-gray-500">여행 기간</th>
                  <th className="px-6 py-3 font-medium text-gray-500">인원</th>
                  <th className="px-6 py-3 font-medium text-gray-500">금액</th>
                  <th className="px-6 py-3 font-medium text-gray-500">예약 상태</th>
                  <th className="px-6 py-3 font-medium text-gray-500">결제 상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm">#{booking.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{booking.users?.name || '알 수 없음'}</p>
                        <p className="text-sm text-gray-500">{booking.users?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {booking.package_id ? (
                        <Link href={`/package/${booking.package_id}`} className="text-blue-600 hover:underline">
                          {booking.packages?.name || booking.package_id}
                        </Link>
                      ) : booking.villa_id ? (
                        <span>{booking.villas?.name || booking.villa_id}</span>
                      ) : (
                        <span className="text-gray-400">정보 없음</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <CalendarDays className="h-4 w-4 mr-2 text-gray-400" />
                        {new Date(booking.booking_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {booking.start_date ? new Date(booking.start_date).toLocaleDateString() : '날짜 미정'}
                      {booking.end_date && ` ~ ${new Date(booking.end_date).toLocaleDateString()}`}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gray-400" />
                        {booking.people_count}명
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                        ₩{Number(booking.total_price).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={booking.status}
                        onChange={(e) => handleUpdateStatus(booking.id, e.target.value)}
                        className={`px-2 py-1 rounded text-sm border ${
                          booking.status === 'confirmed' ? 'bg-green-50 border-green-200' :
                          booking.status === 'pending' ? 'bg-yellow-50 border-yellow-200' :
                          booking.status === 'completed' ? 'bg-blue-50 border-blue-200' :
                          'bg-red-50 border-red-200'
                        }`}
                      >
                        <option value="pending">대기중</option>
                        <option value="confirmed">확정</option>
                        <option value="completed">완료</option>
                        <option value="cancelled">취소됨</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={booking.payment_status}
                        onChange={(e) => handleUpdatePaymentStatus(booking.id, e.target.value)}
                        className={`px-2 py-1 rounded text-sm border ${
                          booking.payment_status === 'paid' ? 'bg-green-50 border-green-200' :
                          booking.payment_status === 'partial' ? 'bg-yellow-50 border-yellow-200' :
                          'bg-red-50 border-red-200'
                        }`}
                      >
                        <option value="unpaid">미결제</option>
                        <option value="partial">부분 결제</option>
                        <option value="paid">결제 완료</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          {searchQuery || statusFilter !== 'all' || paymentFilter !== 'all' ? (
            <>
              <p className="text-xl font-medium mb-2">검색 결과가 없습니다</p>
              <p className="text-gray-500">다른 검색어나 필터를 시도해보세요.</p>
            </>
          ) : (
            <p className="text-xl font-medium">등록된 예약이 없습니다</p>
          )}
        </div>
      )}
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { 
  Package,
  Users, 
  Building, 
  CalendarDays, 
  CreditCard, 
  TrendingUp,
  Bookmark
} from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    packages: 0,
    villas: 0,
    users: 0,
    bookings: 0,
    payments: 0,
    wishlist: 0,
    recentBookings: [] as any[],
    recentUsers: [] as any[]
  })
  const [isLoading, setIsLoading] = useState(true)
  const [authStatus, setAuthStatus] = useState('확인 중...')

  // 인증 상태 확인 (디버깅용)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          setAuthStatus('오류: ' + error.message)
          return
        }
        
        if (!data.session) {
          setAuthStatus('세션 없음')
          return
        }
        
        setAuthStatus('인증됨: ' + data.session.user.email)
      } catch (e: any) {
        setAuthStatus('예외 발생: ' + e.message)
      }
    }
    
    checkAuth()
  }, [])

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient()
      
      try {
        // 패키지 수
        const { count: packagesCount } = await supabase
          .from('packages')
          .select('*', { count: 'exact', head: true })
        
        // 빌라 수
        const { count: villasCount } = await supabase
          .from('villas')
          .select('*', { count: 'exact', head: true })
        
        // 사용자 수
        const { count: usersCount } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
        
        // 예약 수
        const { count: bookingsCount } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
        
        // 결제 수
        const { count: paymentsCount } = await supabase
          .from('payments')
          .select('*', { count: 'exact', head: true })
          
        // 위시리스트 수
        const { count: wishlistCount } = await supabase
          .from('wishlists')
          .select('*', { count: 'exact', head: true })
        
        // 최근 예약
        const { data: recentBookings } = await supabase
          .from('bookings')
          .select('*, users(name, email)')
          .order('created_at', { ascending: false })
          .limit(5)
        
        // 최근 사용자
        const { data: recentUsers } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)

        setStats({
          packages: packagesCount || 0,
          villas: villasCount || 0,
          users: usersCount || 0,
          bookings: bookingsCount || 0,
          payments: paymentsCount || 0,
          wishlist: wishlistCount || 0,
          recentBookings: recentBookings || [],
          recentUsers: recentUsers || []
        })
      } catch (error) {
        console.error('통계를 가져오는 데 실패했습니다:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchStats()
  }, [])
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
      </div>
    )
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">관리자 대시보드</h1>
      
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <Package className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">총 패키지</p>
            <p className="text-2xl font-bold">{stats.packages}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <Building className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">총 빌라</p>
            <p className="text-2xl font-bold">{stats.villas}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6 flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <Users className="h-8 w-8 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">총 사용자</p>
            <p className="text-2xl font-bold">{stats.users}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6 flex items-center">
          <div className="rounded-full bg-amber-100 p-3 mr-4">
            <CalendarDays className="h-8 w-8 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">총 예약</p>
            <p className="text-2xl font-bold">{stats.bookings}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6 flex items-center">
          <div className="rounded-full bg-rose-100 p-3 mr-4">
            <CreditCard className="h-8 w-8 text-rose-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">총 결제</p>
            <p className="text-2xl font-bold">{stats.payments}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6 flex items-center">
          <div className="rounded-full bg-sky-100 p-3 mr-4">
            <Bookmark className="h-8 w-8 text-sky-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">총 위시리스트</p>
            <p className="text-2xl font-bold">{stats.wishlist}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 최근 예약 */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">최근 예약</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">고객</th>
                  <th className="px-4 py-2 text-left">날짜</th>
                  <th className="px-4 py-2 text-left">금액</th>
                  <th className="px-4 py-2 text-left">상태</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentBookings.length > 0 ? (
                  stats.recentBookings.map((booking: any) => (
                    <tr key={booking.id} className="border-t border-gray-100">
                      <td className="px-4 py-3">#{booking.id}</td>
                      <td className="px-4 py-3">{booking.users?.name || '알 수 없음'}</td>
                      <td className="px-4 py-3">{new Date(booking.booking_date).toLocaleDateString()}</td>
                      <td className="px-4 py-3">₩{Number(booking.total_price).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {booking.status === 'confirmed' ? '확정' : 
                           booking.status === 'pending' ? '대기중' : 
                           booking.status === 'cancelled' ? '취소됨' : 
                           booking.status === 'completed' ? '완료' : booking.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-3 text-center text-gray-500">
                      최근 예약이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* 최근 가입 */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">최근 가입 사용자</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">이름</th>
                  <th className="px-4 py-2 text-left">이메일</th>
                  <th className="px-4 py-2 text-left">가입일</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentUsers.length > 0 ? (
                  stats.recentUsers.map((user: any) => (
                    <tr key={user.id} className="border-t border-gray-100">
                      <td className="px-4 py-3">{user.name || '이름 없음'}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">{new Date(user.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-center text-gray-500">
                      최근 가입한 사용자가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

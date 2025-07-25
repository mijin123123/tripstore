'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
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
  const [error, setError] = useState<string | null>(null)

  // 인증 상태 확인 (디버깅용)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = await createClient()
        
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          setAuthStatus('인증 오류: ' + error.message)
          return
        }
        
        if (!data.session) {
          setAuthStatus('세션 없음 (로그인 필요)')
          return
        }
        
        setAuthStatus('인증됨: ' + data.session.user.email)
      } catch (e: any) {
        setAuthStatus('예외 발생: ' + e.message)
        console.error('인증 확인 중 오류:', e)
      }
    }
    
    checkAuth()
  }, [])

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = await createClient()
      
      // 10초 타임아웃 설정
      const timeout = setTimeout(() => {
        setError('데이터 로딩이 너무 오래 걸립니다. 페이지를 새로고침해주세요.')
        setIsLoading(false)
      }, 10000)
      
      try {
        setError(null)
        
        // 모든 쿼리를 Promise.allSettled로 병렬 실행하여 하나가 실패해도 다른 것들이 계속 실행되도록 함
        const [
          packagesResult,
          villasResult,
          usersResult,
          bookingsResult,
          paymentsResult,
          wishlistResult,
          recentBookingsResult,
          recentUsersResult
        ] = await Promise.allSettled([
          supabase.from('packages').select('*', { count: 'exact', head: true }),
          supabase.from('villas').select('*', { count: 'exact', head: true }),
          supabase.from('users').select('*', { count: 'exact', head: true }),
          supabase.from('bookings').select('*', { count: 'exact', head: true }),
          supabase.from('payments').select('*', { count: 'exact', head: true }),
          supabase.from('wishlists').select('*', { count: 'exact', head: true }),
          supabase.from('bookings').select('*, users(name, email)').order('created_at', { ascending: false }).limit(5),
          supabase.from('users').select('*').order('created_at', { ascending: false }).limit(5)
        ])

        // 결과 처리
        const packagesCount = packagesResult.status === 'fulfilled' ? packagesResult.value.count || 0 : 0
        const villasCount = villasResult.status === 'fulfilled' ? villasResult.value.count || 0 : 0
        const usersCount = usersResult.status === 'fulfilled' ? usersResult.value.count || 0 : 0
        const bookingsCount = bookingsResult.status === 'fulfilled' ? bookingsResult.value.count || 0 : 0
        const paymentsCount = paymentsResult.status === 'fulfilled' ? paymentsResult.value.count || 0 : 0
        const wishlistCount = wishlistResult.status === 'fulfilled' ? wishlistResult.value.count || 0 : 0
        const recentBookings = recentBookingsResult.status === 'fulfilled' ? recentBookingsResult.value.data || [] : []
        const recentUsers = recentUsersResult.status === 'fulfilled' ? recentUsersResult.value.data || [] : []

        // 실패한 쿼리만 에러 로깅
        const failedQueries = []
        if (packagesResult.status === 'rejected') failedQueries.push('패키지')
        if (villasResult.status === 'rejected') failedQueries.push('빌라')
        if (usersResult.status === 'rejected') failedQueries.push('사용자')
        if (bookingsResult.status === 'rejected') failedQueries.push('예약')
        if (paymentsResult.status === 'rejected') failedQueries.push('결제')
        if (wishlistResult.status === 'rejected') failedQueries.push('위시리스트')
        if (recentBookingsResult.status === 'rejected') failedQueries.push('최근 예약')
        if (recentUsersResult.status === 'rejected') failedQueries.push('최근 사용자')
        
        if (failedQueries.length > 0) {
          console.warn('일부 통계 로딩 실패:', failedQueries.join(', '))
        }

        setStats({
          packages: packagesCount,
          villas: villasCount,
          users: usersCount,
          bookings: bookingsCount,
          payments: paymentsCount,
          wishlist: wishlistCount,
          recentBookings: recentBookings,
          recentUsers: recentUsers
        })
        
        clearTimeout(timeout)
      } catch (error: any) {
        console.error('통계를 가져오는 데 실패했습니다:', error)
        setError(`데이터 로딩 실패: ${error.message}`)
        clearTimeout(timeout)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchStats()
  }, [])
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">관리자 대시보드 로딩 중...</p>
        <p className="mt-2 text-sm text-gray-500">인증 상태: {authStatus}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">데이터 로딩 오류</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            페이지 새로고침
          </button>
        </div>
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

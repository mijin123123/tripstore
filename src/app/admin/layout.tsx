'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { 
  Package, 
  Users, 
  CalendarDays, 
  CreditCard, 
  Home, 
  BarChart3,
  Map,
  Hotel,
  Building,
  LogOut,
  User,
  Image,
  Settings
} from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        setIsLoading(true)
        const supabase = createClient()
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        console.log('세션 확인 시도:', session)
        
        if (sessionError) {
          console.error('세션 확인 오류:', sessionError)
          router.push('/auth/login?redirect=/admin')
          return
        }
        
        if (!session) {
          console.log('세션이 없음: 로그인 페이지로 리다이렉트')
          router.push('/auth/login?redirect=/admin')
          return
        }

        console.log('세션 확인됨:', session.user.id)

        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (error) {
          console.error('사용자 데이터 오류:', error)
          router.push('/')
          return
        }

        if (!userData) {
          console.log('사용자 데이터가 없음')
          router.push('/')
          return
        }

        if (!userData.is_admin) {
          console.log('관리자 권한이 없음')
          router.push('/')
          return
        }

        setUser(userData)
        setIsLoading(false)
      } catch (error) {
        console.error('관리자 확인 중 오류:', error)
        router.push('/auth/login?redirect=/admin')
      }
    }

    checkAdmin()
  }, [])

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/auth/login')
    } catch (error) {
      console.error('로그아웃 오류:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* 사이드바 */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold text-blue-600">트립스토어 관리자</h1>
        </div>
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">{user?.name || '관리자'}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          
          <nav className="space-y-1">
            <Link href="/admin" className="flex items-center px-4 py-3 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <BarChart3 className="h-5 w-5 mr-3" />
              <span>대시보드</span>
            </Link>
            <Link href="/admin/packages" className="flex items-center px-4 py-3 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <Package className="h-5 w-5 mr-3" />
              <span>패키지 관리</span>
            </Link>
            <Link href="/admin/villas" className="flex items-center px-4 py-3 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <Building className="h-5 w-5 mr-3" />
              <span>빌라 관리</span>
            </Link>
            <Link href="/admin/hotels" className="flex items-center px-4 py-3 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <Hotel className="h-5 w-5 mr-3" />
              <span>호텔 관리</span>
            </Link>
            <Link href="/admin/regions" className="flex items-center px-4 py-3 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <Map className="h-5 w-5 mr-3" />
              <span>지역 관리</span>
            </Link>
            <Link href="/admin/bookings" className="flex items-center px-4 py-3 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <CalendarDays className="h-5 w-5 mr-3" />
              <span>예약 관리</span>
            </Link>
            <Link href="/admin/users" className="flex items-center px-4 py-3 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <Users className="h-5 w-5 mr-3" />
              <span>사용자 관리</span>
            </Link>
            <Link href="/admin/payments" className="flex items-center px-4 py-3 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <CreditCard className="h-5 w-5 mr-3" />
              <span>결제 관리</span>
            </Link>
            <Link href="/admin/hero-images" className="flex items-center px-4 py-3 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <Image className="h-5 w-5 mr-3" />
              <span>히어로 이미지 관리</span>
            </Link>
            <Link href="/admin/site-settings" className="flex items-center px-4 py-3 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <Settings className="h-5 w-5 mr-3" />
              <span>사이트 설정</span>
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-4 border-t">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-gray-700 hover:text-blue-600">
              <Home className="h-5 w-5 mr-2" />
              <span>메인으로</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center text-gray-700 hover:text-red-600"
            >
              <LogOut className="h-5 w-5 mr-2" />
              <span>로그아웃</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  )
}

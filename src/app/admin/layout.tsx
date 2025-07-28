'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { 
  Package, 
  Users, 
  CalendarDays, 
  CreditCard, 
  Home, 
  BarChart3,
  LogOut,
  User,
  Image,
  Settings,
  AlertTriangle
} from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    const maxRetries = 3;
    
    const checkAdmin = async () => {
      if (!mounted) return;
      
      try {
        setIsLoading(true)
        setError('')
        
        const supabase = createClient()
        
        // 먼저 현재 세션을 확인
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (!mounted) return;
        
        if (sessionError) {
          console.error('세션 확인 오류:', sessionError)
          throw new Error(`세션 확인 실패: ${sessionError.message}`)
        }
        
        if (!session) {
          console.log('세션이 없음: 로그인 페이지로 리다이렉트')
          setIsLoading(false)
          router.push('/auth/login?redirect=/admin')
          return
        }

        console.log('세션 확인됨:', session.user.id)

        // 사용자 데이터 조회 (옵션으로 처리)
        try {
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (error && error.code !== 'PGRST116') { // Row not found는 무시
            console.log('사용자 데이터 조회 실패 (무시하고 계속):', error)
          }
          
          setUser(userData || { 
            id: session.user.id, 
            email: session.user.email, 
            name: session.user.email || 'Unknown User'
          })
        } catch (userError) {
          console.log('사용자 데이터 조회 중 오류 (무시하고 계속):', userError)
          setUser({ 
            id: session.user.id, 
            email: session.user.email, 
            name: session.user.email || 'Unknown User'
          })
        }

        setIsLoading(false)
      } catch (error: any) {
        console.error('관리자 확인 중 오류:', error)
        
        if (!mounted) return;
        
        // 재시도 로직
        if (retryCount < maxRetries && error.message?.includes('network')) {
          retryCount++
          console.log(`네트워크 오류로 재시도 중... (${retryCount}/${maxRetries})`)
          setTimeout(() => {
            if (mounted) checkAdmin()
          }, 2000 * retryCount) // 점진적 지연
          return
        }
        
        setError(error.message || '알 수 없는 오류가 발생했습니다')
        setIsLoading(false)
      }
    }
        }
      }
    }

    checkAdmin()

    // 인증 상태 변화 감지
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('인증 상태 변화:', event, session ? '세션 있음' : '세션 없음')
        
        if (event === 'SIGNED_OUT') {
          router.push('/auth/login')
        } else if (event === 'SIGNED_IN') {
          checkAdmin()
        }
      }
    )

    return () => subscription.unsubscribe()
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
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">관리자 권한을 확인하는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            관리자 페이지 로딩 오류
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-y-2">
            <button
              onClick={() => {
                setError('')
                setIsLoading(true)
                window.location.reload()
              }}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              페이지 새로고침
            </button>
            <button
              onClick={() => router.push('/auth/login?redirect=/admin')}
              className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              다시 로그인
            </button>
          </div>
        </div>
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
            <Link href="/admin/regions" className="flex items-center px-4 py-3 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <Package className="h-5 w-5 mr-3" />
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
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
    </div>
  )
}

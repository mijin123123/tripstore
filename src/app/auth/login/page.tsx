'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase'

// 로그인 폼 컴포넌트 - useSearchParams를 사용하는 부분을 분리
function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [loginError, setLoginError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // 입력 시 해당 필드의 에러 메시지 제거
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  useEffect(() => {
    // 이미 로그인되어 있는지 확인
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        console.log('이미 로그인되어 있음:', session);
        // admin 경로로 이동하려는 경우 관리자 권한 체크
        if (redirectTo.includes('/admin')) {
          const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single();
            
          if (userData?.role === 'admin') {
            router.push('/admin');
          }
        } else {
          router.push(redirectTo);
        }
      }
    };
    
    checkAuth();
  }, [redirectTo, router]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.'
    }
    
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.'
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다.'
    }
    
    // 추가적인 형식 검증을 여기에 넣을 수 있습니다
    // 예: 특수문자 요구, 대문자 포함 등
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    setLoginError('')
    
    try {
      console.log('로그인 시도 중...');
      console.log('이메일:', formData.email);
      console.log('비밀번호 길이:', formData.password.length);
      
      const supabase = createClient()
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })
      
      if (error) {
        console.error('로그인 오류:', error.message)
        // 다양한 Supabase 오류 메시지에 대한 처리
        const errorMessage = (() => {
          switch(error.message) {
            case 'Invalid login credentials':
              return '이메일 또는 비밀번호가 올바르지 않습니다.';
            case 'Email not confirmed':
              return '이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요.';
            case 'Too many requests':
              return '너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요.';
            default:
              return '로그인 중 오류가 발생했습니다. 다시 시도해주세요.';
          }
        })();
        
        setLoginError(errorMessage);
        return;
      }
      
      // 사용자 로그인 성공 후 권한 체크
      const userId = data.user?.id
      
      if (userId) {
        // users 테이블에서 관리자 여부 확인
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', userId)
          .single()
        
        console.log('사용자 데이터:', userData, '오류:', userError)
        
        // 관리자 페이지 접근 시 권한 체크
        if (redirectTo.includes('/admin')) {
          if (userError || !userData || userData.role !== 'admin') {
            setLoginError('관리자 권한이 없습니다.')
            await supabase.auth.signOut()
            return
          }
        }
        
        // 로그인 성공 시 리디렉션
        console.log('로그인 성공, 리디렉션:', redirectTo)
        
        // 권한에 따른 리디렉션
        if (userData?.role === 'admin' && !redirectTo.includes('/admin')) {
          router.push('/admin')
        } else {
          router.push(redirectTo)
        }
      } else {
        setLoginError('로그인 처리 중 오류가 발생했습니다.')
      }
      
    } catch (error) {
      console.error('로그인 중 예외 발생:', error)
      setLoginError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-12 sm:pt-20 bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-6 sm:py-8">
        {/* 뒤로가기 버튼 */}
        <div className="mb-4 sm:mb-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>뒤로가기</span>
          </button>
        </div>

        {/* 로그인 폼 */}
        <div className="bg-white rounded-xl shadow-lg p-5 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">로그인</h1>
            <p className="text-gray-600">TripStore에 다시 오신 것을 환영합니다</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 이메일 입력 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="이메일을 입력하세요"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="비밀번호를 입력하세요"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* 비밀번호 찾기 */}
            <div className="text-right">
              <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                비밀번호를 잊으셨나요?
              </Link>
            </div>

            {/* 로그인 버튼 */}
            {/* 로그인 오류 메시지 표시 */}
            {loginError && (
              <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{loginError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          {/* 회원가입 링크 */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              아직 계정이 없으신가요?{' '}
              <Link href="/auth/signup" className="text-blue-600 hover:text-blue-800 font-medium">
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// 메인 페이지 컴포넌트
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-12 sm:pt-20 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">로딩 중...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}

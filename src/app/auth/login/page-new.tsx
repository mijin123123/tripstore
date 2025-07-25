'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/components/AuthProvider'

// 로그인 폼 컴포넌트 - useSearchParams를 사용하는 부분을 분리
function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'
  
  const { refreshSession } = useAuth()
  
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
      try {
        const supabase = createClient();
        console.log('세션 확인 중...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('세션 확인 중 오류:', error);
          return;
        }
        
        if (session) {
          console.log('이미 로그인되어 있음. 사용자 ID:', session.user.id);
          
          // 세션이 유효한지 확인 (추가 검증)
          try {
            const { data: user, error: userError } = await supabase.auth.getUser();
            if (userError || !user.user) {
              console.error('사용자 정보 확인 실패:', userError);
              // 유효하지 않은 세션이면 로그아웃 처리
              await supabase.auth.signOut();
              return;
            }
            
            console.log('사용자 정보 확인됨:', user.user.email);
            router.push(redirectTo);
          } catch (verifyError) {
            console.error('세션 검증 오류:', verifyError);
          }
        } else {
          console.log('로그인된 세션 없음');
        }
      } catch (e) {
        console.error('checkAuth 함수 오류:', e);
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
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== handleSubmit 함수 시작 ===');
    
    if (!validateForm()) {
      console.log('폼 검증 실패');
      return;
    }
    
    console.log('폼 검증 성공');
    setIsLoading(true);
    setLoginError('');
    
    try {
      console.log('=== 로그인 시도 시작 ===');
      console.log('이메일:', formData.email);
      console.log('비밀번호 길이:', formData.password.length);
      
      // 수파베이스 클라이언트 생성
      const supabase = createClient();
      
      // 로그인 시도 (최대 3번 재시도)
      let data: any = null;
      let error: any = null;
      let attempts = 0;
      const maxAttempts = 3;
      
      while (attempts < maxAttempts) {
        attempts++;
        console.log(`로그인 시도 ${attempts}/${maxAttempts}`);
        
        // 로그인 시도
        const result = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        
        data = result.data;
        error = result.error;
        
        if (!error) {
          console.log('로그인 성공!');
          break;
        } else if (error.message !== 'Too many requests') {
          console.log('로그인 실패:', error.message);
          break;
        }
        
        // 429 에러면 잠시 대기 후 재시도
        console.log('요청 제한으로 인한 대기 중...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      if (error) {
        console.error('로그인 오류:', error.message)
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
        setIsLoading(false);
        return;
      }
      
      if (!data.session) {
        console.error('로그인은 성공했지만 세션 데이터가 없습니다.');
        setLoginError('세션 정보를 가져올 수 없습니다. 다시 시도해주세요.');
        setIsLoading(false);
        return;
      }
      
      // 전역 상태의 세션 갱신
      await refreshSession();
      
      // 리다이렉트 처리
      console.log('로그인 성공, 리다이렉트 중...', redirectTo);
      router.push(redirectTo);
      
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
                  autoComplete="email"
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
                  autoComplete="current-password"
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

            {/* 로그인 에러 메시지 */}
            {loginError && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                {loginError}
              </div>
            )}

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isLoading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
              } transition-colors`}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>

            {/* 회원가입 링크 */}
            <div className="text-center text-sm">
              <p className="text-gray-600">
                계정이 없으신가요?{' '}
                <Link href="/auth/signup" className="text-blue-600 hover:text-blue-800 font-medium">
                  회원가입
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// 서스펜스로 감싸 클라이언트 컴포넌트를 안전하게 렌더링
export default function LoginPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <LoginForm />
    </Suspense>
  )
}

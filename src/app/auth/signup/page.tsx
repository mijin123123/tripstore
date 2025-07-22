'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // 입력 시 해당 필드의 에러 메시지 제거
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = '이름은 2자 이상이어야 합니다.'
    }
    
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.'
    }
    
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.'
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.'
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = '비밀번호는 영문과 숫자를 포함해야 합니다.'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.'
    }
    
    if (!formData.phone) {
      newErrors.phone = '전화번호를 입력해주세요.'
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/-/g, ''))) {
      newErrors.phone = '올바른 전화번호 형식을 입력해주세요.'
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = '이용약관에 동의해주세요.'
    }
    
    if (!formData.agreePrivacy) {
      newErrors.agreePrivacy = '개인정보처리방침에 동의해주세요.'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    
    try {
      console.log('회원가입 시도 중...');
      console.log('이메일:', formData.email);
      console.log('이름:', formData.name);
      console.log('전화번호:', formData.phone);
      console.log('비밀번호 길이:', formData.password.length);
      
      // 1단계: Supabase 클라이언트 생성
      const supabase = createClient()
      console.log('Supabase 클라이언트 생성됨');
      
      // 2단계: Supabase Auth를 사용한 회원가입 (이메일 인증 없이 자동 확인 처리)
      console.log('Auth 회원가입 시도 중...');
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            phone: formData.phone,
            marketing_agree: formData.agreeMarketing
          },
          emailRedirectTo: window.location.origin + '/auth/login'
        }
      })
      
      if (error) {
        console.error('Auth 회원가입 오류:', error);
        throw error
      }
      
      console.log('Auth 회원가입 성공:', data);
      
      // 회원 정보를 users 테이블에도 저장
      if (data.user) {
        console.log('회원가입 사용자 ID:', data.user.id);
        
        // 잠시 대기하여 Supabase Auth가 처리될 시간을 줌
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 사용자 메타데이터 확인을 위한 세션 체크
        const { data: sessionData } = await supabase.auth.getSession();
        console.log('현재 세션 상태:', sessionData?.session ? '로그인됨' : '로그인되지 않음');
        
        // 사용자 데이터 준비
        const userData = {
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          is_admin: false
        };
        
        console.log('저장할 사용자 데이터:', userData);
        
        try {
          console.log('3단계: 사용자 데이터 저장 API 호출 중...');
          // 서버 API를 통해 사용자 생성 (서비스 역할 사용)
          const response = await fetch('/api/user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: data.user.id,
              userData: {
                email: formData.email,
                name: formData.name,
                phone: formData.phone,
                is_admin: false
              }
            }),
          });
          
          console.log('API 응답 상태:', response.status, response.statusText);
          
          const result = await response.json();
          console.log('API 응답 데이터:', result);
          
          if (!response.ok) {
            console.error('API 응답 오류:', result);
            throw new Error(result.error || '사용자 데이터 저장에 실패했습니다.');
          }
          
          console.log('사용자 데이터 저장 성공:', result.user);
        } catch (error: any) {
          console.error('사용자 데이터 저장 API 오류:', error);
          alert(`사용자 데이터 저장 중 오류가 발생했습니다: ${error.message}`);
          // 사용자 데이터 저장 실패해도 계속 진행
        }
        
        console.log('4단계: 자동 로그인 시도...');
        // 이메일 인증 없이 바로 로그인 처리
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        })
        
        if (signInError) {
          console.error('자동 로그인 실패:', signInError)
          // 로그인 실패해도 회원가입은 완료되었으므로 로그인 페이지로 이동
          alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.')
          console.log('로그인 페이지로 리디렉션 중...');
          
          // 0.5초 후에 리디렉션 (리디렉션 문제 디버깅용)
          setTimeout(() => {
            router.push('/auth/login')
          }, 500)
          return
        }
        
        console.log('자동 로그인 성공!', signInData);
        
        // 자동 로그인 성공 시 메인 페이지로 이동
        alert('회원가입이 완료되었습니다! 메인 페이지로 이동합니다.')
        console.log('메인 페이지로 리디렉션 중...');
        
        // 0.5초 후에 리디렉션 (리디렉션 문제 디버깅용)
        setTimeout(() => {
          router.push('/')
        }, 500)
        return
      }
      
      console.log('회원가입 성공 (사용자 없음 케이스):', data)
      
      // 회원가입은 성공했지만 자동 로그인은 실패한 경우 로그인 페이지로 이동
      alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.')
      console.log('로그인 페이지로 리디렉션 중...');
      
      // 0.5초 후에 리디렉션 (리디렉션 문제 디버깅용)
      setTimeout(() => {
        router.push('/auth/login')
      }, 500)
    } catch (error: any) {
      console.error('회원가입 오류:', error)
      let errorMessage = '회원가입에 실패했습니다. 다시 시도해주세요.'
      
      if (error.message === 'User already registered') {
        errorMessage = '이미 등록된 이메일 주소입니다. 로그인 페이지로 이동합니다.';
        console.log('이미 등록된 이메일. 로그인 페이지로 리디렉션 예정...');
        
        // 이미 등록된 사용자인 경우, 2초 후에 로그인 페이지로 이동
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else if (error.message?.includes('password')) {
        errorMessage = '비밀번호가 요구사항을 충족하지 않습니다. 더 강력한 비밀번호를 사용해주세요.';
      }
      
      alert(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '')
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setFormData(prev => ({
      ...prev,
      phone: formatted
    }))
    if (errors.phone) {
      setErrors(prev => ({
        ...prev,
        phone: ''
      }))
    }
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* 뒤로가기 버튼 */}
        <div className="mb-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>뒤로가기</span>
          </button>
        </div>

        {/* 회원가입 폼 */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">회원가입</h1>
            <p className="text-gray-600">TripStore와 함께 특별한 여행을 시작하세요</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 이름 입력 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                이름 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="이름을 입력하세요"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* 이메일 입력 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                이메일 <span className="text-red-500">*</span>
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

            {/* 전화번호 입력 */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                전화번호 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="010-0000-0000"
                  maxLength={13}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호 <span className="text-red-500">*</span>
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
                  placeholder="영문, 숫자 포함 8자 이상"
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

            {/* 비밀번호 확인 */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호 확인 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="비밀번호를 다시 입력하세요"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* 약관 동의 */}
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreeTerms" className="text-gray-700">
                    <span className="text-red-500">*</span> 이용약관에 동의합니다.{' '}
                    <Link href="/terms" className="text-blue-600 hover:text-blue-800 underline">
                      보기
                    </Link>
                  </label>
                </div>
              </div>
              {errors.agreeTerms && (
                <p className="text-sm text-red-600">{errors.agreeTerms}</p>
              )}

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id="agreePrivacy"
                    name="agreePrivacy"
                    checked={formData.agreePrivacy}
                    onChange={handleInputChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreePrivacy" className="text-gray-700">
                    <span className="text-red-500">*</span> 개인정보처리방침에 동의합니다.{' '}
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
                      보기
                    </Link>
                  </label>
                </div>
              </div>
              {errors.agreePrivacy && (
                <p className="text-sm text-red-600">{errors.agreePrivacy}</p>
              )}

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id="agreeMarketing"
                    name="agreeMarketing"
                    checked={formData.agreeMarketing}
                    onChange={handleInputChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreeMarketing" className="text-gray-700">
                    마케팅 정보 수신에 동의합니다. (선택)
                  </label>
                </div>
              </div>
            </div>

            {/* 회원가입 버튼 */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? '회원가입 중...' : '회원가입'}
            </button>
          </form>

          {/* 로그인 링크 */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              이미 계정이 있으신가요?{' '}
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-800 font-medium">
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

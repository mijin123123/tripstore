'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [error, setError] = useState('')

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError('이메일을 입력해주세요.')
      return
    }
    
    if (!validateEmail(email)) {
      setError('올바른 이메일 형식을 입력해주세요.')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      // 실제 비밀번호 재설정 이메일 발송 API 호출
      // 여기서는 임시로 2초 후 성공으로 처리
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setIsEmailSent(true)
    } catch (error) {
      setError('이메일 발송에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (error) {
      setError('')
    }
  }

  if (isEmailSent) {
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

          {/* 성공 메시지 */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">이메일을 확인해주세요</h1>
            
            <p className="text-gray-600 mb-2">
              비밀번호 재설정 링크를 다음 이메일로 발송했습니다:
            </p>
            <p className="text-blue-600 font-medium mb-6">{email}</p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                • 이메일이 도착하지 않았다면 스팸함을 확인해주세요<br/>
                • 링크는 24시간 동안만 유효합니다<br/>
                • 이메일을 받지 못하셨다면 다시 요청해주세요
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  setIsEmailSent(false)
                  setEmail('')
                }}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                다시 요청하기
              </button>
              
              <Link
                href="/auth/login"
                className="block w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
              >
                로그인 페이지로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
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

        {/* 비밀번호 찾기 폼 */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">비밀번호 찾기</h1>
            <p className="text-gray-600">
              가입하신 이메일 주소를 입력하시면<br/>
              비밀번호 재설정 링크를 보내드립니다
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 이메일 입력 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                이메일 주소
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    error ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="가입하신 이메일을 입력하세요"
                  disabled={isLoading}
                />
              </div>
              {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
              )}
            </div>

            {/* 전송 버튼 */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? '이메일 발송 중...' : '비밀번호 재설정 이메일 보내기'}
            </button>
          </form>

          {/* 추가 안내 */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">도움이 필요하신가요?</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 가입하신 이메일 주소를 정확히 입력해주세요</li>
              <li>• 이메일이 도착하지 않으면 스팸함을 확인해주세요</li>
              <li>• 문제가 지속되면 고객센터(02-1234-5678)로 연락주세요</li>
            </ul>
          </div>

          {/* 로그인 페이지로 돌아가기 */}
          <div className="mt-6 text-center">
            <Link href="/auth/login" className="text-blue-600 hover:text-blue-800 font-medium">
              로그인 페이지로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

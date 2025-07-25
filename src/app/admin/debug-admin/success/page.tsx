'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'

export default function AdminDebugSuccess() {
  const { isAdmin } = useAuth()
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)
  
  useEffect(() => {
    // 5초 후 메인 관리자 페이지로 리디렉션
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/admin')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [router])
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-5 text-center">
      <div className="bg-green-100 p-8 rounded-lg shadow-md max-w-md">
        <h1 className="text-3xl font-bold text-green-800 mb-4">디버그 성공!</h1>
        
        <div className="mb-6">
          <div className="text-5xl font-bold text-green-500 mb-2">
            {isAdmin ? '✓' : '⚠️'}
          </div>
          <p className="text-xl font-semibold mb-2">
            {isAdmin 
              ? '관리자 권한이 활성화되었습니다!' 
              : '관리자 권한이 비활성화되었습니다.'}
          </p>
          <p className="text-gray-600">
            현재 관리자 상태: <span className="font-semibold">{isAdmin ? '활성화' : '비활성화'}</span>
          </p>
        </div>
        
        <p className="text-gray-700 mb-4">
          {countdown}초 후 관리자 페이지로 이동합니다...
        </p>
        
        <div className="flex space-x-3 justify-center">
          <button
            onClick={() => router.push('/admin')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            지금 이동하기
          </button>
          <button
            onClick={() => router.push('/admin/debug-admin')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            디버그 페이지로 돌아가기
          </button>
        </div>
      </div>
    </div>
  )
}

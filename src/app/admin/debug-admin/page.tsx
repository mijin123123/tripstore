'use client'

import { useAuth } from '@/components/AuthProvider'
import { useState, useEffect } from 'react'

export default function AdminDebugPage() {
  const { user, isAdmin, refreshSession, setAdminForDebug } = useAuth()
  const [status, setStatus] = useState('초기화 중...')
  const [userEmail, setUserEmail] = useState<string | null>(null)
  
  useEffect(() => {
    // 컴포넌트 마운트 시 상태 업데이트
    updateStatus()
  }, [user, isAdmin])
  
  const updateStatus = () => {
    if (!user) {
      setStatus('로그인되지 않음')
      setUserEmail(null)
      return
    }
    
    setUserEmail(user.email || null)
    
    if (isAdmin) {
      setStatus('관리자 권한 있음')
    } else {
      setStatus('일반 사용자 (관리자 권한 없음)')
    }
  }
  
  const handleRefresh = async () => {
    setStatus('세션 새로고침 중...')
    try {
      await refreshSession()
      updateStatus()
    } catch (error) {
      console.error('새로고침 오류:', error)
      setStatus('새로고침 오류 발생')
    }
  }
  
  const handleSetAdmin = (adminState: boolean) => {
    setAdminForDebug(adminState)
    setStatus(`관리자 상태를 ${adminState ? '활성화' : '비활성화'}로 설정 중...`)
    
    // 상태 업데이트 후 성공 페이지로 리디렉션
    setTimeout(() => {
      window.location.href = '/admin/debug-admin/success'
    }, 1000)
  }
  
  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">관리자 디버그 페이지</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-5">
        <h2 className="text-lg font-semibold mb-2">현재 상태:</h2>
        <p><strong>상태:</strong> {status}</p>
        <p><strong>이메일:</strong> {userEmail || '없음'}</p>
        <p><strong>관리자:</strong> {isAdmin ? '예' : '아니오'}</p>
      </div>
      
      <div className="flex flex-col space-y-2 mb-5">
        <button 
          onClick={handleRefresh}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          세션 새로고침
        </button>
      </div>
      
      <div className="border-t pt-4 mt-4">
        <h2 className="text-lg font-semibold mb-2">관리자 상태 디버그 제어:</h2>
        <div className="flex space-x-3">
          <button 
            onClick={() => handleSetAdmin(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            관리자 활성화
          </button>
          <button 
            onClick={() => handleSetAdmin(false)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            관리자 비활성화
          </button>
        </div>
      </div>
    </div>
  )
}

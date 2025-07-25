'use client'

import React, { useEffect, useState } from 'react'
// @ts-ignore - 빌드 중 경로 문제 무시
import { createClient } from '@/lib/supabase-client'
// @ts-ignore - 빌드 중 경로 문제 무시
import { useAuth } from '@/components/AuthProvider'

export default function AdminDashboard() {
  const { user, loading, isAdmin, refreshSession } = useAuth();
  const [status, setStatus] = useState('페이지 초기화 중...');

  // 한 번만 실행되는 초기화 함수
  useEffect(() => {
    console.log('관리자 페이지 마운트됨');
    setStatus('인증 상태 확인 완료');
  }, []); // 빈 의존성 배열로 한 번만 실행
  
  // 인증 상태 변경 감지 (별도 useEffect)
  useEffect(() => {
    if (!loading) {
      if (user && isAdmin) {
        setStatus('관리자로 로그인됨: ' + user.email);
      } else if (user && !isAdmin) {
        setStatus('일반 사용자로 로그인됨: ' + user.email);
      } else {
        setStatus('로그인되지 않음');
      }
    }
  }, [user, isAdmin, loading]); // 상태 변경 시에만 실행
  
  // 페이지 콘텐츠
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">관리자 페이지 (디버그 모드)</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">상태 정보</h2>
        <div className="bg-gray-100 p-4 rounded-md">
          <p className="mb-2"><strong>페이지 상태:</strong> {status}</p>
          <p className="mb-2"><strong>인증 상태:</strong> {loading ? '로딩 중' : '완료'}</p>
          <p className="mb-2"><strong>관리자 권한:</strong> {isAdmin ? '있음' : '없음'}</p>
          <p className="mb-2"><strong>이메일:</strong> {user?.email || '로그인되지 않음'}</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={async () => {
            setStatus('세션 갱신 중...');
            await refreshSession();
            setStatus('세션 갱신 완료');
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          세션 갱신하기
        </button>
        
        <button
          onClick={() => window.location.reload()}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
        >
          페이지 새로고침
        </button>
      </div>

      {/* 관리자 정보만 표시 */}
      {isAdmin && !loading ? (
        <div className="bg-green-100 p-4 rounded-md">
          <p className="text-green-800 font-medium">관리자로 로그인되었습니다!</p>
          <p className="mt-2">이제 관리자 기능을 사용할 수 있습니다.</p>
        </div>
      ) : !loading ? (
        <div className="bg-yellow-100 p-4 rounded-md">
          <p className="text-yellow-800 font-medium">관리자 권한이 없습니다.</p>
          <p className="mt-2">관리자로 로그인하세요.</p>
        </div>
      ) : (
        <div className="bg-blue-100 p-4 rounded-md">
          <p className="text-blue-800 font-medium">인증 정보 확인 중...</p>
        </div>
      )}
      
      <div className="mt-8 border-t pt-4">
        <a 
          href="/admin/debug-admin" 
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 inline-block"
        >
          관리자 디버그 페이지로 이동
        </a>
        <p className="mt-2 text-sm text-gray-500">
          문제가 발생하면 디버그 페이지에서 관리자 상태를 직접 설정할 수 있습니다.
        </p>
      </div>
    </div>
  );
}

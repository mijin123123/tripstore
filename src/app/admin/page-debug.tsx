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
    const initPage = async () => {
      try {
        setStatus('인증 상태 확인 중...');
        console.log('관리자 페이지 초기화 시작');
        
        // 세션 강제 갱신
        await refreshSession();
        console.log('세션 갱신 완료');
        
        setStatus('인증 정보: ' + JSON.stringify({
          user: user?.email || '로그인 안됨',
          isAdmin: isAdmin,
          loading: loading
        }));
      } catch (error) {
        console.error('관리자 페이지 초기화 오류:', error);
        setStatus('오류 발생: ' + (error instanceof Error ? error.message : String(error)));
      }
    };
    
    initPage();
  }, []); // 의존성 배열은 비워두어 한 번만 실행되도록 함
  
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
    </div>
  );
}

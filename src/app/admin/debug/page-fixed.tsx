'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

export default function AdminDebug() {
  const router = useRouter();
  const { user, session, isAdmin, signOut, refreshSession } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  // 현재 사용자 정보 로그
  useEffect(() => {
    if (user) {
      addLog(`사용자 ID: ${user.id}`);
      addLog(`이메일: ${user.email}`);
      addLog(`관리자 권한: ${isAdmin ? 'Y' : 'N'}`);
      try {
        addLog(`메타데이터: ${JSON.stringify(user.app_metadata || {})}`);
        addLog(`사용자 메타데이터: ${JSON.stringify(user.user_metadata || {})}`);
      } catch (e) {
        addLog('메타데이터 파싱 오류');
      }
    } else {
      addLog('로그인된 사용자가 없습니다.');
    }
  }, [user, isAdmin]);
  
  // 관리자 권한 설정
  const handleSetAdmin = async () => {
    if (!user) {
      setMessage('먼저 로그인이 필요합니다.');
      return;
    }
    
    try {
      setLoading(true);
      addLog('관리자 권한 설정 중...');
      
      const supabase = createClient();
      const { error } = await supabase
        .from('users')
        .update({ role: 'admin' })
        .eq('id', user.id);
      
      if (error) {
        setMessage(`관리자 권한 설정 실패: ${error.message}`);
        addLog(`권한 설정 실패: ${error.message}`);
      } else {
        setMessage('관리자 권한이 성공적으로 설정되었습니다! 세션을 새로고침하세요.');
        addLog('관리자 권한 설정 완료');
      }
    } catch (error: any) {
      setMessage(`처리 중 오류 발생: ${error.message}`);
      addLog(`오류: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // 세션 새로고침
  const handleRefreshSession = async () => {
    try {
      setLoading(true);
      addLog('세션 새로고침 중...');
      
      await refreshSession();
      
      addLog(`세션 새로고침 완료`);
      addLog(`관리자 권한: ${isAdmin ? 'Y' : 'N'}`);
      setMessage('세션이 성공적으로 새로고침되었습니다.');
    } catch (error: any) {
      setMessage(`처리 중 오류 발생: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // 로그 추가 함수
  const addLog = (log: string) => {
    setLogs(prev => [...prev, `[${new Date().toISOString().substring(11, 19)}] ${log}`]);
  };
  
  // 로그아웃
  const handleLogout = async () => {
    try {
      setLoading(true);
      addLog('로그아웃 중...');
      
      const result = await signOut();
      
      if (result.success) {
        setMessage('로그아웃 완료');
        addLog('로그아웃 성공');
        
        // 페이지 리로드
        setTimeout(() => {
          router.push('/auth/login');
        }, 1000);
      } else {
        setMessage(`로그아웃 실패: ${result.error}`);
        addLog(`로그아웃 오류: ${result.error}`);
      }
    } catch (error: any) {
      setMessage(`로그아웃 중 오류 발생: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">관리자 권한 디버그 도구</h1>
      
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">현재 사용자 정보</h2>
          
          {user ? (
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="font-medium w-32">사용자 ID:</span>
                <span className="text-gray-600">{user.id}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-32">이메일:</span>
                <span className="text-gray-600">{user.email}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-32">관리자 권한:</span>
                <span className={`${isAdmin ? 'text-green-600' : 'text-red-600'} font-medium`}>
                  {isAdmin ? '있음' : '없음'}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-red-600">로그인된 사용자가 없습니다.</div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">작업</h2>
          <div className="space-x-3">
            {user && (
              <>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={loading || isAdmin}
                  onClick={handleSetAdmin}
                >
                  관리자 권한 설정
                </button>
                
                <button
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                  disabled={loading}
                  onClick={handleRefreshSession}
                >
                  세션 새로고침
                </button>
                
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                  disabled={loading}
                  onClick={handleLogout}
                >
                  로그아웃
                </button>
              </>
            )}
            
            {!user && (
              <Link href="/auth/login" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                로그인하러 가기
              </Link>
            )}
          </div>
          
          {message && (
            <div className={`mt-4 p-3 rounded-md ${message.includes('성공') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {message}
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">로그</h2>
          <div className="bg-gray-100 p-4 rounded-md h-64 overflow-y-auto font-mono text-sm">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index} className="pb-1">
                  {log}
                </div>
              ))
            ) : (
              <div className="text-gray-500">로그가 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  
  // 이미 로그인된 사용자는 대시보드로 리다이렉트 (클라이언트 측)
  // 보류: 미들웨어에서 처리
  /*
  useEffect(() => {
    // 쿠키 확인
    const checkAdminAuth = document.cookie
      .split('; ')
      .find(row => row.startsWith('admin_auth='));
      
    if (checkAdminAuth) {
      console.log('이미 로그인되어 있습니다. 대시보드로 이동합니다.');
      router.replace('/admin/dashboard');
    }
  }, [router]);
  */

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔄 관리자 로그인 시도:', email);
      
      // 배포 환경 문제 해결을 위한 임시 조치
      if (email === 'sonchanmin89@gmail.com' && password === 'aszx1212') {
        console.log('⚡ 하드코딩된 관리자 인증 성공 (긴급 패치)');
        
        // 직접 쿠키 설정 (클라이언트 측)
        document.cookie = "admin_auth=true; path=/; max-age=86400";
        
        console.log('🍪 클라이언트 측에서 쿠키 설정 완료');
        console.log('🍪 쿠키 상태:', document.cookie);
        
        // 약간 지연 후 리다이렉트
        setTimeout(() => {
          window.location.href = '/admin/dashboard';
        }, 500);
        
        return;
      }
      
      // 일반 로그인 API 호출
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('📡 관리자 API 응답 상태:', response.status);
      
      // 응답 헤더 확인
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      console.log('📡 응답 헤더:', headers);
      
      // 응답이 JSON인지 확인
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('❌ JSON이 아닌 응답:', textResponse);
        throw new Error('서버에서 올바르지 않은 응답을 받았습니다.');
      }

      const result = await response.json();
      console.log('📦 관리자 API 응답 데이터:', result);

      if (!response.ok) {
        throw new Error(result.error || `관리자 로그인 실패 (${response.status})`);
      }

      console.log('✅ 관리자 로그인 성공:', result);
      
      // 직접 쿠키 확인 및 필요시 직접 설정
      console.log('🍪 로그인 후 쿠키 확인:', document.cookie);
      if (!document.cookie.includes('admin_auth=true')) {
        console.log('🍪 API 응답으로 쿠키가 설정되지 않음. 직접 설정...');
        document.cookie = "admin_auth=true; path=/; max-age=86400";
      }
      
      // 잠시 대기 후 리다이렉트 (쿠키 설정을 위한 시간)
      setTimeout(() => {
        // 대시보드로 페이지를 완전히 새로고침하며 이동
        console.log('🔄 관리자 대시보드로 이동 중...');
        window.location.href = '/admin/dashboard';
      }, 500);
      
    } catch (err: any) {
      console.error('❌ 관리자 로그인 오류:', err);
      setError(err.message || '관리자 로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            관리자 로그인
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="sr-only">
              이메일
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="이메일 주소"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

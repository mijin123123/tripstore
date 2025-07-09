"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Loader2 } from 'lucide-react';

interface AdminSession {
  email: string;
  role: string;
  loginTime: string;
}

interface AdminProtectionProps {
  children: React.ReactNode;
}

export default function AdminProtection({ children }: AdminProtectionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAdminAuth = () => {
      try {
        // 1차: localStorage에서 세션 확인
        const adminSessionString = localStorage.getItem('adminSession');
        
        // 2차: 쿠키에서 세션 확인 (더 안전)
        const cookieValue = document.cookie
          .split('; ')
          .find(row => row.startsWith('admin-session='))
          ?.split('=')[1];

        // localStorage와 쿠키 모두 확인
        if (!adminSessionString && !cookieValue) {
          console.log('관리자 세션이 없습니다.');
          router.push('/admin/login');
          return;
        }

        let adminSession: AdminSession | null = null;

        // localStorage 우선 확인
        if (adminSessionString) {
          try {
            adminSession = JSON.parse(adminSessionString);
          } catch (e) {
            console.log('localStorage 세션 파싱 오류');
          }
        }

        // 쿠키에서 세션 확인 (fallback)
        if (!adminSession && cookieValue) {
          try {
            adminSession = JSON.parse(decodeURIComponent(cookieValue));
          } catch (e) {
            console.log('쿠키 세션 파싱 오류');
          }
        }

        if (!adminSession) {
          console.log('유효한 관리자 세션을 찾을 수 없습니다.');
          router.push('/admin/login');
          return;
        }
        
        // 세션 유효성 검사
        if (!adminSession.email || adminSession.email !== 'sonchanmin89@gmail.com') {
          console.log('유효하지 않은 관리자 세션입니다.');
          localStorage.removeItem('adminSession');
          // 쿠키 삭제는 서버에서 처리
          router.push('/admin/login');
          return;
        }

        // 세션 만료 시간 검사 (24시간)
        const loginTime = new Date(adminSession.loginTime);
        const currentTime = new Date();
        const timeDiff = currentTime.getTime() - loginTime.getTime();
        const hoursElapsed = timeDiff / (1000 * 60 * 60);

        if (hoursElapsed > 24) {
          console.log('관리자 세션이 만료되었습니다.');
          localStorage.removeItem('adminSession');
          router.push('/admin/login');
          return;
        }

        console.log('관리자 인증 성공:', adminSession.email);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('관리자 인증 확인 중 오류:', error);
        localStorage.removeItem('adminSession');
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">관리자 권한을 확인하는 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">접근 권한이 없습니다</h1>
          <p className="text-gray-600 mb-6">관리자 권한이 필요한 페이지입니다.</p>
          <button
            onClick={() => router.push('/admin/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            로그인 페이지로 이동
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

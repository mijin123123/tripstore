"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { verifyToken } from '@/lib/auth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    async function checkAuth() {
      try {
        console.log('🔍 관리자 인증 확인 시작');
        
        // 로컬 스토리지에서 토큰 가져오기
        const token = localStorage.getItem('admin_token');
        
        if (!token) {
          console.log('❌ 토큰이 없어서 로그인 페이지로 이동');
          router.push('/admin/login');
          return;
        }
        
        // 토큰 검증
        const user = verifyToken(token);
        
        console.log('👤 사용자 정보:', user?.email);
        
        if (!user || !user.email) {
          console.log('❌ 유효하지 않은 토큰, 로그인 페이지로 이동');
          router.push('/admin/login');
          return;
        }
        
        // 관리자 권한 확인
        if (user.role === 'admin') {
          console.log('✅ 관리자 권한 확인됨, 권한 승인');
          setIsAuthorized(true);
        } else {
          console.log('❌ 관리자 권한이 없어서 로그인 페이지로 이동');
          router.push('/admin/login');
        }
        
      } catch (error) {
        console.error('💥 인증 확인 중 예외 발생:', error);
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    }
    
    checkAuth();
  }, [router]);
  
  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">로딩 중...</div>;
  }
  
  if (!isAuthorized) {
    return <div className="flex min-h-screen items-center justify-center">인증 확인 중...</div>;
  }
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

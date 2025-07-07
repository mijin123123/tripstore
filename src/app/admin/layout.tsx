"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import useAdminAuthStore from '@/store/adminAuth';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, checkAuth } = useAdminAuthStore();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    checkAuth();
    setIsAuthChecked(true);
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthChecked && !isAuthenticated && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [isAuthChecked, isAuthenticated, pathname, router]);

  if (!isAuthChecked) {
    return <div className="flex min-h-screen items-center justify-center">인증 정보를 확인 중입니다...</div>;
  }

  if (!isAuthenticated && pathname !== '/admin/login') {
    // 리디렉션이 진행되는 동안 로딩 상태를 유지합니다.
    return <div className="flex min-h-screen items-center justify-center">인증 정보를 확인 중입니다...</div>;
  }
  
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (isAuthenticated) {
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

  return null; 
}

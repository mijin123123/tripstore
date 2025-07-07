"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const adminAuth = sessionStorage.getItem('isAdminAuthenticated');
      
      // If not authenticated and not on the login page, redirect.
      if (adminAuth !== 'true' && pathname !== '/admin/login') {
        console.log('❌ [Layout] 인증되지 않음. 로그인 페이지로 리디렉션합니다.');
        router.replace('/admin/login');
      } else {
        // Otherwise, verification is successful (either authenticated or on the login page).
        console.log('✅ [Layout] 인증 확인 완료.');
        setIsVerified(true);
      }
    };

    checkAuth();
  }, [pathname, router]);

  // While verifying, show a loading state.
  if (!isVerified) {
    return <div className="flex min-h-screen items-center justify-center">인증 정보를 확인 중입니다...</div>;
  }

  // If on the login page, just render the page content without the admin sidebar/header.
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // If verified and not on the login page, render the full admin layout.
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

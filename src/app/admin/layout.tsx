"use client";

import { useEffect } from 'react';
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

  useEffect(() => {
    // Initialize auth state from sessionStorage on component mount
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // If not on the login page and not authenticated, redirect.
    if (pathname !== '/admin/login' && !isAuthenticated) {
      console.log('❌ [Layout] 인증되지 않음. 로그인 페이지로 리디렉션합니다.');
      router.replace('/admin/login');
    }
  }, [pathname, isAuthenticated, router]);

  // While waiting for auth state to be determined, show a loading indicator.
  // This prevents a flash of the login page on refresh for authenticated users.
  if (pathname !== '/admin/login' && !isAuthenticated) {
    return <div className="flex min-h-screen items-center justify-center">인증 정보를 확인 중입니다...</div>;
  }

  // If on the login page, just render the page content without the admin sidebar/header.
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // If authenticated, render the full admin layout.
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

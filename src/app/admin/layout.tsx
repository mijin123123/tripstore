"use client";

import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  // 로그인 페이지인 경우, 관리자 레이아웃 없이 자식 컴포넌트만 렌더링
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // 그 외 관리자 페이지는 전체 레이아웃과 함께 렌더링
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

"use client";

import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { AuthProvider } from '@/lib/auth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  // 인증 컨텍스트 제공자로 모든 관리자 페이지 래핑
  return (
    <AuthProvider>
      {pathname === '/admin/login' ? (
        // 로그인 페이지인 경우, 관리자 레이아웃 없이 자식 컴포넌트만 렌더링
        <>{children}</>
      ) : (
        // 그 외 관리자 페이지는 전체 레이아웃과 함께 렌더링
        <div className="flex min-h-screen bg-gray-100">
          <AdminSidebar />
          <div className="flex-1">
            <AdminHeader />
            <main className="p-6">
              {children}
            </main>
          </div>
        </div>
      )}
    </AuthProvider>
  );
}

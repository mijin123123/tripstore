"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { createClient } from '@/lib/supabase';
import { checkAdminPermission } from '@/lib/admin-auth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  
  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session || !session.user?.email) {
          router.push('/admin/login');
          return;
        }
        
        const isAdmin = await checkAdminPermission(session.user.email);
        
        if (!isAdmin) {
          router.push('/admin/login');
          return;
        }
        
        setIsAuthorized(true);
      } catch (error) {
        console.error('인증 확인 중 오류:', error);
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    }
    
    checkAuth();
  }, [router, supabase]);
  
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

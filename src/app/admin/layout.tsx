"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { createClient } from '@/lib/supabase';

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
        console.log('관리자 인증 확인 시작');
        const supabase = createClient();
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('세션 정보:', session?.user?.email);
        
        if (error) {
          console.error('세션 가져오기 오류:', error);
          router.push('/admin/login');
          return;
        }
        
        if (!session || !session.user?.email) {
          console.log('세션이 없어서 로그인 페이지로 이동');
          router.push('/admin/login');
          return;
        }
        
        // 관리자 권한 확인
        console.log('관리자 권한 확인 중:', session.user.email);
        const { data: adminData, error: adminError } = await supabase
          .from('admins')
          .select('*')
          .eq('email', session.user.email)
          .single();
        
        console.log('관리자 데이터:', adminData);
        console.log('관리자 조회 오류:', adminError);
        
        if (adminError || !adminData) {
          console.log('관리자 권한이 없어서 로그인 페이지로 이동');
          router.push('/admin/login');
          return;
        }
        
        console.log('관리자 인증 성공');
        setIsAuthorized(true);
      } catch (error) {
        console.error('인증 확인 중 예외 발생:', error);
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

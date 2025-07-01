import { redirect } from 'next/navigation';

import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { createClient } from '@/lib/supabase';
import { checkAdminPermission } from '@/lib/admin-auth';

export default async function AdminLayout({ children }) {
  // 서버 사이드에서 관리자 권한 확인
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/login?returnUrl=/admin');
  }
  
  const isAdmin = await checkAdminPermission(session.user.email);
  
  if (!isAdmin) {
    redirect('/');
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

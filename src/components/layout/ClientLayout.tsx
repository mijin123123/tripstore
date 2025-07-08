'use client';

import { AuthProvider } from "@/lib/real-auth";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { usePathname } from 'next/navigation';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');
  
  // 관리자 페이지인 경우 헤더와 푸터를 표시하지 않음
  if (isAdminPage) {
    return <>{children}</>;
  }
  
  // 일반 페이지에는 헤더와 푸터 표시
  return (
    <>
      <AuthProvider>
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </AuthProvider>
    </>
  );
}

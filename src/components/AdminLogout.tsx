"use client";

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function AdminLogout() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // 서버에 로그아웃 요청
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // 로컬 스토리지에서 관리자 세션 제거
      localStorage.removeItem('adminSession');
      
      console.log('관리자 로그아웃 완료');
      
      // 로그인 페이지로 리다이렉트
      router.push('/admin/login');
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
      // 오류가 발생해도 로컬 스토리지 정리 후 로그인 페이지로 이동
      localStorage.removeItem('adminSession');
      router.push('/admin/login');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
    >
      <LogOut className="w-4 h-4" />
      로그아웃
    </button>
  );
}

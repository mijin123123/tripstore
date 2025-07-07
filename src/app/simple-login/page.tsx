"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SimpleLoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    // 즉시 /login 페이지로 리다이렉트
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">로그인 페이지로 이동 중...</p>
      </div>
    </div>
  );
}
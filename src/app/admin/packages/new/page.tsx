'use client'; // 클라이언트 컴포넌트로 전환하여 동적 렌더링 보장

import { useEffect, useState } from 'react';
import PackageForm from '@/components/admin/PackageForm';

export const dynamic = 'force-dynamic'; // 동적 렌더링 강제

export default function NewPackagePage() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">새 패키지 추가</h1>
      <PackageForm />
    </div>
  );
}

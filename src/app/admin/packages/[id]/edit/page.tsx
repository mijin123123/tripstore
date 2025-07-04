"use client";

import { useEffect, useState } from 'react';
import PackageForm from '@/components/admin/PackageForm';
import { useParams, notFound } from 'next/navigation';

// generateStaticParams는 별도 파일로 이동했습니다

export default function PackageEditPage() {
  const params = useParams();
  const id = params.id as string;
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/packages/${id}`);
        if (!response.ok) {
          throw new Error('패키지 데이터를 불러올 수 없습니다.');
        }
        const data = await response.json();
        setPackageData(data);
      } catch (err: any) {
        console.error('패키지 데이터 조회 오류:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  if (loading) {
    return <div>로딩 중...</div>;
  }
  
  if (error || !packageData) {
    return <div>패키지 정보를 불러올 수 없습니다.</div>;
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">패키지 수정</h1>
      <PackageForm initialData={packageData} />
    </div>
  );
}

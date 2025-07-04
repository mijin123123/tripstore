"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import NoticeForm from '@/components/admin/NoticeForm';
import { createClient } from '@/lib/supabase';

export default function NoticeEditPage() {
  const params = useParams();
  const router = useRouter();
  const [noticeData, setNoticeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  
  useEffect(() => {
    async function fetchNoticeData() {
      if (!params.id) return;
      
      try {
        const { data, error } = await supabase
          .from('notices')
          .select('*')
          .eq('id', params.id)
          .single();
        
        if (error) {
          throw error;
        }
        
        setNoticeData(data);
      } catch (err) {
        console.error('공지사항 데이터 조회 오류:', err);
        setError('공지사항을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchNoticeData();
  }, [params.id, supabase]);
  
  if (isLoading) {
    return <div>로딩 중...</div>;
  }
  
  if (error) {
    return <div>오류: {error}</div>;
  }
  
  if (!noticeData) {
    return <div>공지사항을 찾을 수 없습니다.</div>;
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">공지사항 수정</h1>
      <NoticeForm initialData={noticeData} />
    </div>
  );
}

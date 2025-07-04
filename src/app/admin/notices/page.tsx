"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import NoticeItem from '@/components/admin/NoticeItem';

interface NoticeData {
  id: string;
  title: string;
  content: string;
  is_important: boolean;
  created_at: string;
  [key: string]: any;
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<NoticeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchNotices() {
      try {
        const response = await fetch('/api/notices');
        if (!response.ok) {
          throw new Error('공지사항 데이터를 불러오는데 실패했습니다.');
        }
        const data = await response.json();
        setNotices(data);
      } catch (err) {
        console.error('공지사항 데이터 조회 오류:', err);
        setError('공지사항 데이터를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    }

    fetchNotices();
  }, []);

  if (loading) {
    return <div className="p-6">로딩 중...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">공지사항 관리</h1>
        
        <Link href="/admin/notices/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>새 공지사항 작성</span>
          </Button>
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-12 gap-4 p-4 border-b font-medium text-sm">
          <div className="col-span-2">날짜</div>
          <div className="col-span-6">제목</div>
          <div className="col-span-2">중요 여부</div>
          <div className="col-span-2 text-right">작업</div>
        </div>
        
        {notices.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            등록된 공지사항이 없습니다.
          </div>
        ) : (
          <div className="divide-y">
            {notices.map((notice) => (
              <NoticeItem key={notice.id} notice={notice} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Pencil, Trash, Eye, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useRouter } from 'next/navigation';

// 공지사항 타입 정의
interface Notice {
  id: string;
  title: string;
  content: string;
  is_important: boolean;
  created_at: string;
}

interface NoticeItemProps {
  notice: Notice;
}

export default function NoticeItem({ notice }: NoticeItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  
  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'yyyy년 MM월 dd일', { locale: ko });
    } catch (error) {
      return dateString;
    }
  };
  
  // 공지사항 삭제 처리
  const handleDelete = async () => {
    if (confirm('이 공지사항을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      setIsDeleting(true);
      
      try {
        const response = await fetch(`/api/notices/${notice.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || '공지사항 삭제 실패');
        }
        
        alert('공지사항이 삭제되었습니다.');
        // 페이지 새로고침
        router.refresh();
      } catch (error) {
        console.error('공지사항 삭제 중 오류:', error);
        alert(error instanceof Error ? error.message : '공지사항 삭제 중 오류가 발생했습니다.');
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  return (
    <div className="grid grid-cols-12 gap-4 p-4 items-center">
      <div className="col-span-2 text-sm text-gray-500">
        {formatDate(notice.created_at)}
      </div>
      
      <div className="col-span-6 font-medium">
        {notice.title}
      </div>
      
      <div className="col-span-2">
        {notice.is_important ? (
          <span className="flex items-center text-red-500">
            <AlertTriangle className="h-4 w-4 mr-1" />
            <span className="text-sm">중요</span>
          </span>
        ) : (
          <span className="text-sm text-gray-500">일반</span>
        )}
      </div>
      
      <div className="col-span-2 flex justify-end gap-2">
        <Link href={`/notice/${notice.id}`}>
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
        
        <Link href={`/admin/notices/${notice.id}/edit`}>
          <Button variant="ghost" size="sm">
            <Pencil className="h-4 w-4" />
          </Button>
        </Link>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </div>
  );
}

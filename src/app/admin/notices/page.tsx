import { createClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import NoticeItem from '@/components/admin/NoticeItem';

export default async function NoticesPage() {
  // 공지사항 데이터 조회
  const supabase = createClient();
  const { data: notices, error } = await supabase
    .from('notices')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('공지사항 데이터 조회 중 오류:', error);
    return <div>공지사항 데이터를 불러오는 중 오류가 발생했습니다.</div>;
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

import NoticeForm from '@/components/admin/NoticeForm';
import { createClient } from '@/lib/supabase';
import { notFound } from 'next/navigation';

interface NoticeEditPageProps {
  params: {
    id: string;
  };
}

export default async function NoticeEditPage({ params }: NoticeEditPageProps) {
  const { id } = params;
  
  // 공지사항 데이터 조회
  const supabase = createClient();
  const { data: noticeData, error } = await supabase
    .from('notices')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error || !noticeData) {
    console.error('공지사항 데이터 조회 오류:', error);
    notFound();
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">공지사항 수정</h1>
      <NoticeForm initialData={noticeData} />
    </div>
  );
}

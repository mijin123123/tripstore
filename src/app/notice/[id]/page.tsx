import NoticeDetail from '@/components/NoticeDetail';

// Static export를 위한 generateStaticParams 함수
export async function generateStaticParams() {
  // 임시 공지사항 ID 목록 (실제로는 API에서 가져올 것)
  const noticeIds = ['1', '2', '3', '4', '5', '6', '7', '8'];
  
  return noticeIds.map((id) => ({
    id: id,
  }));
}

export default function NoticeDetailPage({ params }: { params: { id: string } }) {
  return <NoticeDetail id={params.id} />;
}

import ReservationEditForm from '@/components/admin/ReservationEditForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';

// Static export를 위한 generateStaticParams 함수
export async function generateStaticParams() {
  // 정적 빌드를 위한 고정 ID 목록 반환
  const reservationIds = ['1', '2', '3'];
  return reservationIds.map((id) => ({
    id: id,
  }));
}

interface ReservationEditPageProps {
  params: {
    id: string;
  };
}

export default function ReservationEditPage({ params }: ReservationEditPageProps) {
  const { id } = params;

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link href={`/admin/reservations/${id}`}>
          <Button variant="ghost" size="sm" className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            예약 상세로 돌아가기
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">예약 수정</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>예약 정보 수정</CardTitle>
        </CardHeader>
        <CardContent>
          <ReservationEditForm id={id} />
        </CardContent>
      </Card>
    </div>
  );
}

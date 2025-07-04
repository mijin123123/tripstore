import ReservationEditForm from '@/components/admin/ReservationEditForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';

// Static export를 위한 generateStaticParams 함수
export async function generateStaticParams() {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from('reservations')
      .select('id')
      .limit(10); // 최대 10개의 예약 ID만 가져옴
    
    return (data || []).map((reservation) => ({
      id: String(reservation.id),
    }));
  } catch (error) {
    console.error('예약 ID 가져오기 오류:', error);
    // 오류 발생 시 기본 ID 목록 반환
    const reservationIds = ['1', '2', '3'];
    return reservationIds.map((id) => ({
      id: id,
    }));
  }
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

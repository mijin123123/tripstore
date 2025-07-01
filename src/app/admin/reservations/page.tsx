import { createClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import ReservationList from '@/components/admin/ReservationList';

export default async function ReservationsPage() {
  // 예약 데이터 조회
  const supabase = createClient();
  const { data: reservations, error } = await supabase
    .from('reservations')
    .select('*, packages(title)')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('예약 데이터 조회 중 오류:', error);
    return <div>예약 데이터를 불러오는 중 오류가 발생했습니다.</div>;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">예약 관리</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-12 gap-4 p-4 border-b font-medium text-sm">
          <div className="col-span-2">예약 ID</div>
          <div className="col-span-3">패키지</div>
          <div className="col-span-2">고객 정보</div>
          <div className="col-span-1">인원</div>
          <div className="col-span-1">금액</div>
          <div className="col-span-1">상태</div>
          <div className="col-span-2 text-right">작업</div>
        </div>
        
        {reservations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            예약 정보가 없습니다.
          </div>
        ) : (
          <ReservationList reservations={reservations} />
        )}
      </div>
    </div>
  );
}

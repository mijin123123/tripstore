import { db } from '@/lib/neon';
import { reservations as reservationsSchema, packages as packagesSchema } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function ReservationDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

  // 예약 정보와 패키지 정보 join
  const result = await db
    .select({
      reservation: reservationsSchema,
      package: packagesSchema,
    })
    .from(reservationsSchema)
    .leftJoin(packagesSchema, eq(reservationsSchema.packageId, packagesSchema.id))
    .where(eq(reservationsSchema.id, id));

  if (!result || result.length === 0) {
    return notFound();
  }

  const { reservation, package: pkg } = result[0];

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">예약 상세 정보</h1>
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <div>
          <span className="font-semibold">예약자명:</span> {reservation.contactName}
        </div>
        <div>
          <span className="font-semibold">이메일:</span> {reservation.contactEmail}
        </div>
        <div>
          <span className="font-semibold">연락처:</span> {reservation.contactPhone}
        </div>
        <div>
          <span className="font-semibold">여행 상품:</span> {pkg?.title || '상품 정보 없음'}
        </div>
        <div>
          <span className="font-semibold">출발일:</span> {reservation.departureDate}
        </div>
        <div>
          <span className="font-semibold">인원수:</span> {reservation.travelers}
        </div>
        <div>
          <span className="font-semibold">총 결제금액:</span> {reservation.totalPrice}원
        </div>
        <div>
          <span className="font-semibold">상태:</span> {reservation.status}
        </div>
        <div>
          <span className="font-semibold">결제상태:</span> {reservation.paymentStatus}
        </div>
        {reservation.specialRequests && (
          <div>
            <span className="font-semibold">요청사항:</span> {reservation.specialRequests}
          </div>
        )}
      </div>
      <div className="mt-8">
        <Link href="/mypage" className="text-blue-600 hover:underline">마이페이지로 돌아가기</Link>
      </div>
    </div>
  );
}

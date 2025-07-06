import 'dotenv/config';
import { db } from './src/lib/neon';
import { reservations, packages } from './src/lib/schema';
import { eq } from 'drizzle-orm';

async function addTestReservation() {
  try {
    // 먼저 패키지 ID 가져오기
    const packagesList = await db.select().from(packages).limit(1);
    
    if (packagesList.length === 0) {
      console.log('패키지가 없습니다. 먼저 패키지를 추가해주세요.');
      return;
    }

    const packageId = packagesList[0].id;
    
    // 테스트 예약 데이터 생성
    const testReservation = {
      userId: null,
      packageId: packageId,
      departureDate: '2024-01-15',
      travelers: 2,
      totalPrice: '150000',
      status: 'pending' as const,
      paymentStatus: 'pending',
      contactName: '테스트 고객',
      contactEmail: 'test@example.com',
      contactPhone: '010-1234-5678',
      specialRequests: '창가 자리 요청',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const [newReservation] = await db.insert(reservations).values(testReservation).returning();
    
    console.log('테스트 예약이 생성되었습니다:', newReservation);
    
    // 생성된 예약 확인
    const allReservations = await db
      .select({
        id: reservations.id,
        userId: reservations.userId,
        packageId: reservations.packageId,
        departureDate: reservations.departureDate,
        travelers: reservations.travelers,
        totalPrice: reservations.totalPrice,
        status: reservations.status,
        paymentStatus: reservations.paymentStatus,
        contactName: reservations.contactName,
        contactEmail: reservations.contactEmail,
        contactPhone: reservations.contactPhone,
        specialRequests: reservations.specialRequests,
        createdAt: reservations.createdAt,
        updatedAt: reservations.updatedAt,
        packageTitle: packages.title,
        packageDestination: packages.destination,
      })
      .from(reservations)
      .leftJoin(packages, eq(reservations.packageId, packages.id));

    console.log('모든 예약 목록:', allReservations);
    
  } catch (error) {
    console.error('테스트 예약 생성 중 오류:', error);
  }
}

addTestReservation();

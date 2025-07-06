import 'dotenv/config';
import { db } from './src/lib/neon';
import { reservations, packages } from './src/lib/schema';
import { eq } from 'drizzle-orm';

async function checkReservations() {
  try {
    console.log('모든 예약 조회 중...');
    
    // 모든 예약 조회
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

    console.log('예약 목록:', allReservations);
    
    if (allReservations.length > 0) {
      console.log('\n첫 번째 예약 ID:', allReservations[0].id);
      
      // 첫 번째 예약 상세 조회
      const [firstReservation] = await db
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
        .leftJoin(packages, eq(reservations.packageId, packages.id))
        .where(eq(reservations.id, allReservations[0].id))
        .limit(1);
      
      console.log('첫 번째 예약 상세:', firstReservation);
    }
    
  } catch (error) {
    console.error('예약 조회 중 오류:', error);
  }
}

checkReservations();

import { db } from './src/lib/neon';
import { reservations } from './src/lib/schema';

async function checkUsers() {
  try {
    console.log('=== 예약 데이터 확인 ===');
    
    // 모든 예약 데이터 조회
    const allReservations = await db
      .select()
      .from(reservations)
      .limit(10);
    
    console.log('예약 데이터 개수:', allReservations.length);
    
    if (allReservations.length > 0) {
      console.log('첫 번째 예약 데이터:');
      console.log(JSON.stringify(allReservations[0], null, 2));
      
      // 사용자별 예약 개수 확인
      const userReservations = allReservations.reduce((acc, reservation) => {
        const userId = reservation.userId || 'null';
        acc[userId] = (acc[userId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      console.log('\n사용자별 예약 개수:');
      Object.entries(userReservations).forEach(([userId, count]) => {
        console.log(`User ID ${userId}: ${count}개 예약`);
      });
    }
    
  } catch (error) {
    console.error('데이터 조회 중 오류:', error);
  }
}

checkUsers().then(() => {
  console.log('확인 완료');
  process.exit(0);
});

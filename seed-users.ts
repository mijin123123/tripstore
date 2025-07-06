import { db } from './src/lib/neon';
import { users, reservations, packages } from './src/lib/schema';

async function seedUsers() {
  try {
    console.log('=== 테스트 사용자 생성 ===');
    
    // 테스트 사용자 1
    const testUser1 = await db
      .insert(users)
      .values({
        email: 'test1@example.com',
        fullName: '김철수',
      })
      .returning();
    
    console.log('생성된 사용자 1:', testUser1[0]);
    
    // 테스트 사용자 2
    const testUser2 = await db
      .insert(users)
      .values({
        email: 'test2@example.com',
        fullName: '이영희',
      })
      .returning();
    
    console.log('생성된 사용자 2:', testUser2[0]);
    
    // 기존 예약 데이터 중 일부를 테스트 사용자에게 할당
    console.log('\n=== 예약 데이터 업데이트 ===');
    
    // 패키지 몇 개 가져오기
    const samplePackages = await db
      .select()
      .from(packages)
      .limit(2);
    
    if (samplePackages.length > 0) {
      // 사용자 1에게 예약 생성
      const reservation1 = await db
        .insert(reservations)
        .values({
          userId: testUser1[0].id,
          packageId: samplePackages[0].id,
          departureDate: '2024-03-15',
          travelers: 2,
          totalPrice: '500000',
          status: '예약 확정',
          paymentStatus: 'paid',
          contactName: '김철수',
          contactEmail: 'test1@example.com',
          contactPhone: '010-1234-5678',
        })
        .returning();
      
      console.log('생성된 예약 1:', reservation1[0]);
      
      // 사용자 2에게 예약 생성
      if (samplePackages.length > 1) {
        const reservation2 = await db
          .insert(reservations)
          .values({
            userId: testUser2[0].id,
            packageId: samplePackages[1].id,
            departureDate: '2024-04-20',
            travelers: 3,
            totalPrice: '750000',
            status: '결제 대기',
            paymentStatus: 'unpaid',
            contactName: '이영희',
            contactEmail: 'test2@example.com',
            contactPhone: '010-9876-5432',
          })
          .returning();
        
        console.log('생성된 예약 2:', reservation2[0]);
      }
    }
    
    console.log('\n테스트 사용자 및 예약 데이터 생성 완료!');
    
  } catch (error) {
    console.error('데이터 생성 중 오류:', error);
  }
}

seedUsers().then(() => {
  console.log('완료');
  process.exit(0);
});

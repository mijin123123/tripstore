// .env 파일을 로드합니다.
import { config } from 'dotenv';
config();

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { reservations, packages } from '../lib/schema';
import { v4 as uuidv4 } from 'uuid';

// 데이터베이스 연결 설정
const DATABASE_URL = process.env.NEON_DATABASE_URL || process.env.NETLIFY_DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error('데이터베이스 URL이 설정되지 않았습니다.');
}

const sql = neon(DATABASE_URL);
const db = drizzle(sql, { schema: { packages } });

// 샘플 예약 데이터 생성
async function importReservations() {
  try {
    console.log('예약 데이터 가져오기 시작...');
    
    // 기존 예약을 조회
    const existingReservations = await db.select().from(reservations);
    console.log(`현재 ${existingReservations.length}개의 예약이 DB에 등록되어 있습니다.`);
    
    if (existingReservations.length > 0) {
      console.log('이미 예약 데이터가 등록되어 있습니다. 중복 등록을 방지하기 위해 가져오기를 중단합니다.');
      return;
    }
    
    // 패키지 ID 조회
    const packagesResult = await db.query.packages.findMany();
    
    if (packagesResult.length === 0) {
      console.log('등록된 패키지가 없습니다. 먼저 패키지를 등록해주세요.');
      return;
    }
    
    console.log(`${packagesResult.length}개의 패키지를 찾았습니다. 예약 데이터 생성 중...`);
    
    // 샘플 예약 데이터 생성
    const sampleReservations = [];
    
    // 각 패키지마다 2~4개의 예약 생성
    for (const pkg of packagesResult) {
      const reservationCount = Math.floor(Math.random() * 3) + 2; // 2~4개
      
      for (let i = 0; i < reservationCount; i++) {
        const departureDate = pkg.departuredate && pkg.departuredate.length > 0
          ? pkg.departuredate[Math.floor(Math.random() * pkg.departuredate.length)]
          : "2025.08.15";
        
        const travelers = Math.floor(Math.random() * 4) + 1; // 1~4명
        const totalPrice = parseFloat(pkg.price) * travelers;
        
        // 예약 상태는 pending, confirmed, cancelled, completed 중 하나
        const statusOptions = ['pending', 'confirmed', 'cancelled', 'completed'];
        const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
        
        // 결제 상태는 unpaid, paid, refunded 중 하나
        const paymentOptions = ['unpaid', 'paid', 'refunded'];
        // completed면 paid, cancelled면 refunded, 나머지는 랜덤
        let paymentStatus;
        if (randomStatus === 'completed') {
          paymentStatus = 'paid';
        } else if (randomStatus === 'cancelled') {
          paymentStatus = 'refunded';
        } else {
          paymentStatus = paymentOptions[Math.floor(Math.random() * 2)]; // unpaid 또는 paid만
        }
        
        // 임의의 한국 이름 생성
        const firstNames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임'];
        const lastNames = ['민준', '서준', '도윤', '지훈', '준서', '지유', '서윤', '하은', '하윤', '민서', '지민', '소율'];
        const fullName = firstNames[Math.floor(Math.random() * firstNames.length)] + lastNames[Math.floor(Math.random() * lastNames.length)];
        
        // 임의의 이메일 생성
        const emailDomains = ['gmail.com', 'naver.com', 'daum.net', 'kakao.com', 'outlook.com'];
        const randomString = Math.random().toString(36).substring(2, 8);
        const email = `${randomString}@${emailDomains[Math.floor(Math.random() * emailDomains.length)]}`;
        
        // 임의의 전화번호 생성
        const phoneNumber = `010-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
        
        // 특별 요청 (30% 확률로 있음)
        let specialRequest = null;
        if (Math.random() < 0.3) {
          const requests = [
            '창가 좌석을 선호합니다.',
            '알러지가 있어 해산물은 제외해주세요.',
            '어린이 동반이라 안전에 신경써주세요.',
            '노부모님과 함께 여행합니다. 편안한 이동 부탁드립니다.',
            '신혼여행입니다. 특별한 이벤트가 있으면 좋겠습니다.'
          ];
          specialRequest = requests[Math.floor(Math.random() * requests.length)];
        }
        
        const createdDate = new Date();
        createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30)); // 최근 30일 내
        
        const updatedDate = new Date(createdDate);
        updatedDate.setDate(updatedDate.getDate() + Math.floor(Math.random() * 3)); // 생성 후 0~2일 내 업데이트
        
        sampleReservations.push({
          id: uuidv4(),
          userId: null, // 실제 사용자 ID가 없으므로 null로 설정
          packageId: pkg.id,
          departureDate: departureDate,
          travelers: travelers,
          totalPrice: totalPrice.toString(),
          status: randomStatus,
          paymentStatus: paymentStatus,
          contactName: fullName,
          contactEmail: email,
          contactPhone: phoneNumber,
          specialRequests: specialRequest,
          createdAt: createdDate,
          updatedAt: updatedDate,
        });
      }
    }
    
    console.log(`${sampleReservations.length}개의 예약 데이터를 생성했습니다.`);
    
    // DB에 삽입
    const insertedReservations = await db.insert(reservations).values(sampleReservations).returning();
    console.log(`${insertedReservations.length}개의 예약을 성공적으로 DB에 등록했습니다.`);
    
  } catch (error) {
    console.error('예약 가져오기 중 오류 발생:', error);
    console.error(error);
  }
}

// 스크립트가 직접 실행된 경우에만 importReservations 함수를 실행
if (require.main === module) {
  importReservations()
    .then(() => console.log('예약 가져오기 작업 완료'))
    .catch(error => console.error('예약 가져오기 작업 실패:', error))
    .finally(() => process.exit());
}

export { importReservations };

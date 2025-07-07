import { db } from '@/lib/neon';
import { packages } from '@/lib/schema';
import { v4 as uuidv4 } from 'uuid';

// 더미 패키지 데이터
const dummyPackages = [
  {
    id: uuidv4(),
    title: '제주도 3박 4일',
    description: '아름다운 제주도의 자연을 만끽하는 여행',
    price: '350000',
    discountprice: '315000',
    duration: 3,
    departuredate: ["2024-07-15", "2024-07-22", "2024-08-05"],
    images: ["https://source.unsplash.com/featured/?jeju"],
    destination: '제주도',
    category: '국내여행',
    season: '여름',
    inclusions: ['숙박', '조식', '렌터카'],
    exclusions: ['저녁식사', '입장료'],
    isfeatured: true,
    isonsale: false,
    itinerary: JSON.stringify({ days: [{ title: '1일차', description: '제주 공항 도착 및 렌터카 픽업' }] }),
    rating: '4.5',
    reviewcount: 12,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    title: '부산 해운대 2박 3일',
    description: '해운대와 광안리를 중심으로 한 부산 여행',
    price: '250000',
    discountprice: '225000',
    duration: 2,
    departuredate: ["2024-08-01", "2024-08-15", "2024-09-01"],
    images: ["https://source.unsplash.com/featured/?busan"],
    destination: '부산',
    category: '국내여행',
    season: '여름',
    inclusions: ['숙박', '조식'],
    exclusions: ['렌터카', '저녁식사'],
    isfeatured: false,
    isonsale: true,
    itinerary: JSON.stringify({ days: [{ title: '1일차', description: '부산역 도착 및 호텔 체크인' }] }),
    rating: '4.3',
    reviewcount: 8,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    title: '파리 5박 6일',
    description: '로맨틱한 파리의 아름다운 경치와 문화를 체험하는 여행',
    price: '1800000',
    discountprice: '1620000',
    duration: 5,
    departuredate: ["2024-09-10", "2024-09-20", "2024-10-05"],
    images: ["https://source.unsplash.com/featured/?paris"],
    destination: '파리',
    category: '로맨틱여행',
    season: '가을',
    inclusions: ['숙박', '조식', '공항 픽업'],
    exclusions: ['중식', '석식', '개인 지출'],
    isfeatured: true,
    isonsale: false,
    itinerary: JSON.stringify({ days: [{ title: '1일차', description: '파리 도착 및 호텔 체크인' }] }),
    rating: '4.8',
    reviewcount: 24,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

async function insertDummyPackages() {
  try {
    console.log('=== 더미 패키지 데이터 삽입 스크립트 시작 ===');
    console.log('DB URL:', process.env.NEON_DATABASE_URL ? '설정됨' : '설정되지 않음');
    
    // 기존 패키지 조회
    console.log('기존 패키지 조회 중...');
    const existingPackages = await db.select().from(packages);
    console.log(`현재 ${existingPackages.length}개의 패키지가 DB에 등록되어 있습니다.`);
    
    // 기존 패키지가 있다면 삭제
    if (existingPackages.length > 0) {
      console.log('기존 패키지를 삭제합니다...');
      // 모든 패키지 삭제 (실제 운영 환경에서는 주의해서 사용)
      await db.delete(packages);
      console.log('기존 패키지가 삭제되었습니다.');
    }
    
    // 더미 패키지 삽입
    console.log('새 더미 패키지 데이터를 삽입합니다...');
    const insertedPackages = await db.insert(packages).values(dummyPackages).returning();
    
    console.log(`${insertedPackages.length}개의 더미 패키지가 성공적으로 DB에 삽입되었습니다.`);
    
    return insertedPackages;
  } catch (error) {
    console.error('더미 패키지 삽입 중 오류 발생:', error);
    throw error;
  }
}

// 스크립트가 직접 실행된 경우에만 함수 실행
if (require.main === module) {
  insertDummyPackages()
    .then(() => {
      console.log('더미 패키지 삽입 작업 완료');
      process.exit(0);
    })
    .catch(error => {
      console.error('더미 패키지 삽입 작업 실패:', error);
      process.exit(1);
    });
}

export { insertDummyPackages };

// .env 파일을 로드합니다.
import { config } from 'dotenv';
config();

import { db } from '@/lib/neon';
import { packages } from '@/lib/schema';
import { packagesData, TravelPackage } from '../data/packagesData';
import { v4 as uuidv4 } from 'uuid';

console.log('=== 메인 사이트 패키지 데이터 가져오기 스크립트 시작 ===');

// packagesData.ts에서 데이터를 DB 스키마에 맞게 변환
const transformPackageData = (pkg: TravelPackage) => {
  // 가격 문자열에서 숫자만 추출 (예: "1,800,000원" -> 1800000)
  const price = parseFloat(pkg.price.replace(/[^0-9]/g, ''));
  const discountPrice = price * 0.9; // 10% 할인가 (예시)
  
  // 여행 기간에서 숫자만 추출 (예: "5박 6일" -> 5)
  const durationMatch = pkg.duration?.match(/(\d+)박/);
  const duration = durationMatch ? parseInt(durationMatch[1]) : 3;
  
  // 카테고리 매핑
  const category = pkg.type === '커플' ? '로맨틱여행' : 
                  pkg.type === '어드벤처' ? '모험여행' : '국내여행';
  
  // 계절 추출 (출발일 기반)
  const getSeasonFromDate = (date: string) => {
    const month = parseInt(date.split('.')[1] || '6');
    if (month >= 3 && month <= 5) return '봄';
    if (month >= 6 && month <= 8) return '여름';
    if (month >= 9 && month <= 11) return '가을';
    return '겨울';
  };
  
  const season = pkg.departureDate && pkg.departureDate.length > 0 
    ? getSeasonFromDate(pkg.departureDate[0]) 
    : '여름';
  
  // 이미지 URL 배열
  const images = pkg.gallery || [pkg.image];
  
  // 포함/불포함 항목
  const inclusions = pkg.includes || [];
  const exclusions = pkg.excludes || [];
  
  // 일정을 itinerary 객체로 변환
  const itinerary = pkg.itinerary 
    ? JSON.stringify({ 
        days: pkg.itinerary.map(item => ({
          title: item.title,
          description: item.description,
          image: item.image
        })) 
      })
    : null;
  
  return {
    id: uuidv4(),
    title: pkg.name,
    description: pkg.description,
    destination: pkg.destination,
    price: price.toString(), // decimal 타입에 맞게 문자열로
    discountprice: discountPrice.toString(), // decimal 타입에 맞게 문자열로
    duration: duration,
    departuredate: pkg.departureDate || [],
    images: images,
    rating: pkg.rating?.toString() || '4.5', // decimal 타입에 맞게 문자열로
    reviewcount: Math.floor(Math.random() * 20) + 5, // 랜덤 리뷰 수 (5~24)
    category: category,
    season: season,
    inclusions: inclusions,
    exclusions: exclusions,
    isfeatured: Math.random() > 0.5, // 50% 확률로 추천 상품
    isonsale: Math.random() > 0.7, // 30% 확률로 세일 상품
    itinerary: itinerary, // JSON 문자열로 저장
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

// 메인 사이트의 패키지 데이터를 관리자 DB에 삽입하는 함수
async function importMainPackagesToDb() {
  try {
    console.log('메인 사이트의 패키지 데이터를 가져오는 중...');
    console.log(`총 ${packagesData.length}개의 패키지 데이터 발견`);
    
    // 기존 패키지를 조회
    console.log('기존 패키지 조회 중...');
    const existingPackages = await db.select().from(packages);
    console.log(`현재 DB에 ${existingPackages.length}개의 패키지가 등록되어 있습니다.`);
    
    // 기존 패키지가 있다면 삭제
    if (existingPackages.length > 0) {
      console.log('기존 패키지를 삭제합니다...');
      await db.delete(packages);
      console.log('기존 패키지가 삭제되었습니다.');
    }
    
    // 데이터 변환
    console.log('패키지 데이터를 DB 형식으로 변환 중...');
    const transformedPackages = packagesData.map(transformPackageData);
    console.log(`${transformedPackages.length}개의 패키지 데이터 변환 완료`);
    
    // 첫 번째 패키지 데이터 예시 출력
    if (transformedPackages.length > 0) {
      console.log('첫 번째 변환된 패키지 예시:');
      const example = { ...transformedPackages[0] };
      delete example.itinerary; // 길이가 긴 필드는 제외
      console.log(JSON.stringify(example, null, 2));
    }
    
    // DB에 삽입
    console.log('변환된 패키지 데이터를 DB에 삽입 중...');
    const insertedPackages = await db.insert(packages).values(transformedPackages).returning();
    
    console.log(`${insertedPackages.length}개의 패키지가 성공적으로 DB에 등록되었습니다.`);
    return insertedPackages;
    
  } catch (error) {
    console.error('패키지 데이터 가져오기 중 오류 발생:', error);
    if (error instanceof Error) {
      console.error('오류 메시지:', error.message);
      console.error('오류 스택:', error.stack);
    }
    throw error;
  }
}

// 스크립트 실행
importMainPackagesToDb()
  .then(() => {
    console.log('메인 패키지 데이터 가져오기 작업이 성공적으로 완료되었습니다.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('메인 패키지 데이터 가져오기 작업 실패:', error);
    process.exit(1);
  });

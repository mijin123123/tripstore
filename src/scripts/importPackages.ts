// .env 파일을 로드합니다.
import { config } from 'dotenv';
config();

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { packages } from '../lib/schema';
import { packagesData, TravelPackage } from '../data/packagesData';
import { v4 as uuidv4 } from 'uuid';

// 데이터베이스 연결 설정
const DATABASE_URL = process.env.NEON_DATABASE_URL;
console.log('DB URL 사용 가능 여부:', DATABASE_URL ? '사용 가능' : '사용 불가');

if (!DATABASE_URL) {
  throw new Error('데이터베이스 URL이 설정되지 않았습니다.');
}

console.log('데이터베이스에 연결 시도 중...');
try {
  const sql = neon(DATABASE_URL);
  const db = drizzle(sql);
  console.log('데이터베이스 연결 성공');
} catch (error) {
  console.error('데이터베이스 연결 실패:', error);
  process.exit(1);
}

const sql = neon(DATABASE_URL);
const db = drizzle(sql);

// packagesData에서 db 스키마에 맞는 형식으로 변환
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
    const month = parseInt(date.split('.')[1]);
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
    ? { 
        days: pkg.itinerary.map(item => ({
          title: item.title,
          description: item.description,
          image: item.image
        })) 
      }
    : null;
  
  return {
    id: uuidv4(),
    title: pkg.name,
    description: pkg.description,
    destination: pkg.destination,
    price: price.toString(),
    discountprice: discountPrice.toString(),
    duration: duration,
    departuredate: pkg.departureDate || [],
    images: images,
    rating: pkg.rating ? pkg.rating.toString() : "4.5",
    reviewcount: Math.floor(Math.random() * 20) + 5, // 랜덤 리뷰 수 (5~24)
    category: category,
    season: season,
    inclusions: inclusions,
    exclusions: exclusions,
    isfeatured: Math.random() > 0.5, // 50% 확률로 추천 상품
    isonsale: Math.random() > 0.7, // 30% 확률로 세일 상품
    itinerary: itinerary,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

async function importPackages() {
  try {
    console.log('패키지 데이터 가져오기 시작...');
    
    // 기존 패키지를 조회
    const existingPackages = await db.select().from(packages);
    console.log(`현재 ${existingPackages.length}개의 패키지가 DB에 등록되어 있습니다.`);
    
    if (existingPackages.length > 0) {
      console.log('이미 패키지 데이터가 등록되어 있습니다. 중복 등록을 방지하기 위해 가져오기를 중단합니다.');
      return;
    }
    
    // 데이터 변환
    const transformedPackages = packagesData.map(transformPackageData);
    console.log(`${transformedPackages.length}개의 패키지 데이터를 변환했습니다.`);
    
    // DB에 삽입
    const insertedPackages = await db.insert(packages).values(transformedPackages).returning();
    console.log(`${insertedPackages.length}개의 패키지를 성공적으로 DB에 등록했습니다.`);
    
  } catch (error) {
    console.error('패키지 가져오기 중 오류 발생:', error);
  }
}

// 스크립트가 직접 실행된 경우에만 importPackages 함수를 실행
if (require.main === module) {
  importPackages()
    .then(() => console.log('패키지 가져오기 작업 완료'))
    .catch(error => console.error('패키지 가져오기 작업 실패:', error))
    .finally(() => process.exit());
}

export { importPackages };

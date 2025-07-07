import { db } from '@/lib/neon';
import { packages } from '@/lib/schema';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// packagesData.ts에서 필요한 타입 정의를 직접 가져옴
interface TravelPackage {
  id: number;
  name: string;
  destination: string;
  description: string;
  price: string;
  image: string;
  type: string;
  rating?: number;
  duration?: string;
  groupSize?: string;
  meals?: string;
  accommodation?: string;
  activities?: string[];
  includes?: string[];
  excludes?: string[];
  itinerary?: {
    day: number;
    title: string;
    description: string;
    image?: string;
  }[];
  gallery?: string[];
  highlights?: string[];
  departureDate?: string[];
}

// 더미 패키지 데이터 (DB 연결 실패 시 사용)
const fallbackPackages = [
  {
    id: 'pkg-001',
    title: '제주도 3박 4일',
    description: '아름다운 제주도의 자연을 만끽하는 여행',
    price: 350000,
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
    itinerary: { days: [{ title: '1일차', description: '제주 공항 도착 및 렌터카 픽업' }] },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rating: 4.5,
    reviewcount: 12
  },
  {
    id: 'pkg-002',
    title: '부산 해운대 2박 3일',
    description: '해운대와 광안리를 중심으로 한 부산 여행',
    price: 250000,
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
    itinerary: { days: [{ title: '1일차', description: '부산역 도착 및 호텔 체크인' }] },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rating: 4.3,
    reviewcount: 8
  },
];

// 패키지 데이터를 변환하는 함수
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

export async function GET() {
  try {
    console.log('패키지 데이터 요청을 처리 중...');
    const allPackages = await db.select().from(packages);
    console.log(`${allPackages.length}개의 패키지 데이터를 성공적으로 가져왔습니다.`);
    return NextResponse.json(allPackages);
  } catch (error) {
    console.error('패키지 데이터 가져오기 실패:', error);
    // 데이터베이스 연결 실패 시 더미 데이터 반환
    console.log('더미 패키지 데이터를 대신 반환합니다.');
    return NextResponse.json(fallbackPackages);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 특별한 요청 확인: 데모 데이터 삽입
    if (body.action === 'import_demo_data') {
      
      // 패키지 데이터가 요청에 포함되어 있는지 확인
      if (!body.packagesData || !Array.isArray(body.packagesData)) {
        return NextResponse.json(
          { error: '유효한 패키지 데이터가 필요합니다.' }, 
          { status: 400 }
        );
      }
      
      console.log(`${body.packagesData.length}개의 데모 패키지 데이터를 가져옵니다...`);
      
      try {
        // 기존 패키지를 조회
        const existingPackages = await db.select().from(packages);
        
        if (existingPackages.length > 0) {
          return NextResponse.json({
            message: `이미 ${existingPackages.length}개의 패키지가 DB에 존재합니다. 중복 방지를 위해 가져오기를 중단합니다.`,
            success: false
          });
        }
        
        // 데이터 변환
        const transformedPackages = body.packagesData.map(transformPackageData);
        
        // DB에 삽입
        const insertedPackages = await db.insert(packages).values(transformedPackages).returning();
        
        return NextResponse.json({
          message: `${insertedPackages.length}개의 패키지를 성공적으로 DB에 등록했습니다.`,
          success: true,
          count: insertedPackages.length
        });
        
      } catch (error: any) {
        console.error('패키지 가져오기 중 오류 발생:', error);
        return NextResponse.json(
          { 
            error: '패키지 데이터 가져오기 실패', 
            details: error.message || '알 수 없는 오류' 
          }, 
          { status: 500 }
        );
      }
    } else {
      // 일반 패키지 생성 로직 (기존 코드)
      const [newPackage] = await db.insert(packages).values(body).returning();
      return NextResponse.json(newPackage, { status: 201 });
    }
  } catch (error: any) {
    console.error('패키지 생성 실패:', error);
    return NextResponse.json(
      {
        error: '패키지를 생성할 수 없습니다.',
        details: error.message || '알 수 없는 오류',
      },
      { status: 500 }
    );
  }
}

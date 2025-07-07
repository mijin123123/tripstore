// 환경 변수를 먼저 로드하기 위해 dotenv 설정
import { config } from 'dotenv';
config();

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
  
  // itinerary를 JSON 문자열로 직렬화 (jsonb 타입 호환)
  const itineraryForDB = itinerary ? JSON.stringify(itinerary) : null;

  return {
    id: uuidv4(),
    title: pkg.name,
    description: pkg.description,
    destination: pkg.destination,
    price: price.toString(), // decimal 타입에 맞게 문자열로 저장
    discountprice: discountPrice.toString(), // decimal 타입에 맞게 문자열로 저장
    duration: duration,
    departuredate: pkg.departureDate || [],
    images: images,
    rating: pkg.rating?.toString() || '4.5', // decimal 타입에 맞게 문자열로 저장
    reviewcount: Math.floor(Math.random() * 20) + 5,
    category: category,
    season: season,
    inclusions: inclusions,
    exclusions: exclusions,
    isfeatured: Math.random() > 0.5,
    isonsale: Math.random() > 0.7,
    itinerary: itineraryForDB, // JSON 문자열로 저장
    created_at: new Date(),
    updated_at: new Date(),
  };
};

export async function GET() {
  try {
    console.log('=== 패키지 GET API 요청 처리 시작 ===');
    
    // DB 연결 확인
    if (!db) {
      console.error('DB 객체가 초기화되지 않았습니다.');
      throw new Error('DB 객체가 초기화되지 않았습니다.');
    }
    
    console.log('DB 연결 확인됨, 패키지 데이터 가져오는 중...');
    
    // SQL 직접 실행을 통한 디버깅
    try {
      // 방법 1: drizzle ORM 사용
      const allPackages = await db.select().from(packages);
      console.log(`[ORM 방식] DB에서 ${allPackages.length}개의 패키지 데이터를 가져왔습니다.`);
      
      // 방법 2: 로우 쿼리 직접 실행
      // @ts-ignore - sql 함수가 없을 수 있지만 디버깅을 위해 시도
      if (db.execute) {
        try {
          const rawResult = await db.execute('SELECT COUNT(*) FROM packages');
          console.log('[RAW SQL] 패키지 수 조회 결과:', rawResult);
        } catch (sqlError) {
          console.error('[RAW SQL] 직접 SQL 실행 오류:', sqlError);
        }
      }
      
      // 방법 3: 스키마를 무시하고 네이티브 쿼리 (제작사/테이블 이름만 사용)
      try {
        const rawPackages = await db.query.packages.findMany();
        console.log(`[네이티브 쿼리] ${rawPackages?.length || 0}개의 패키지 찾음`);
      } catch (nativeError) {
        console.error('[네이티브 쿼리] 오류:', nativeError);
      }
      
      // 패키지 ID 목록 출력
      if (allPackages.length > 0) {
        console.log('패키지 ID 목록:');
        allPackages.slice(0, 5).forEach((pkg, idx) => {
          console.log(`- [${idx}] ID: ${pkg.id}, 제목: ${pkg.title}`);
        });
        if (allPackages.length > 5) {
          console.log(`... 외 ${allPackages.length - 5}개`);
        }
      }
    
      // 개발용: 첫 번째 아이템 구조 검사 (있는 경우)
      if (allPackages && Array.isArray(allPackages) && allPackages.length > 0) {
        console.log('첫 번째 패키지 아이템 구조:', JSON.stringify(allPackages[0]).substring(0, 200) + '...');
        console.log('API에서 실제 DB 데이터를 반환합니다.');
        return NextResponse.json(allPackages);
      } else {
        console.warn('패키지 데이터가 없거나 배열이 아닙니다. 더미 데이터를 반환합니다.');
        console.log('allPackages 타입:', typeof allPackages);
        console.log('allPackages 값:', allPackages);
        return NextResponse.json(fallbackPackages);
      }
    
    } catch (dbError) {
      console.error('DB에서 패키지 조회 중 오류:', dbError);
      throw dbError;  // 상위 catch 블록으로 전달
    }
  } catch (error) {
    console.error('패키지 데이터 가져오기 실패:', error);
    
    // 개발용: 에러 상세 정보 출력
    console.error('에러 상세 정보:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack?.slice(0, 200) // 스택 앞부분만 출력
    });
    
    // 에러 정보 저장
    const errorInfo = {
      timestamp: new Date().toISOString(),
      error: error?.message || '알 수 없는 오류',
      type: error?.name || 'Unknown',
    };
    
    console.log('에러 발생으로 더미 패키지 데이터를 대신 반환합니다.');
    
    // 더미 데이터에 에러 정보 추가
    const enhancedFallbackPackages = fallbackPackages.map(pkg => ({
      ...pkg,
      _debug: {
        source: 'fallback',
        reason: '데이터베이스 연결 오류'
      }
    }));
    
    return NextResponse.json(enhancedFallbackPackages);
  }
}

export async function POST(request: Request) {
  try {
    console.log('패키지 API에 POST 요청 수신');
    
    const body = await request.json();
    console.log('요청 본문 타입:', typeof body);
    console.log('요청 액션:', body.action);
    console.log('요청 소스:', body.source || 'unknown');
    
    // 특별한 요청 확인: 데모 데이터 삽입
    if (body.action === 'import_demo_data') {
      
      // 패키지 데이터가 요청에 포함되어 있는지 확인
      if (!body.packagesData || !Array.isArray(body.packagesData)) {
        console.error('요청에 유효한 packagesData 배열이 없습니다');
        return NextResponse.json(
          { error: '유효한 패키지 데이터가 필요합니다.', success: false }, 
          { status: 400 }
        );
      }
      
      console.log(`${body.packagesData.length}개의 패키지 데이터를 가져옵니다...`);
      
      // 첫 번째 패키지 데이터 로그
      if (body.packagesData.length > 0) {
        const firstPkg = body.packagesData[0];
        console.log('첫 번째 패키지 데이터 예시:', {
          id: firstPkg.id,
          name: firstPkg.name,
          destination: firstPkg.destination,
          price: firstPkg.price,
          type: firstPkg.type
        });
      }
      
      try {
        // 기존 패키지를 조회
        console.log('기존 패키지 조회 중...');
        const existingPackages = await db.select().from(packages);
        console.log(`기존 패키지 조회 결과: ${existingPackages.length}개 패키지 발견`);
        
        // 강제 덮어쓰기 옵션 (force=true 파라미터가 있으면 기존 데이터를 삭제)
        const forceOverwrite = body.force === true;
        
        if (existingPackages.length > 0 && !forceOverwrite) {
          console.log(`기존 패키지가 존재합니다. (${existingPackages.length}개)`);
          console.log(`가져오기를 계속하려면 force=true 옵션을 사용하세요.`);
          
          return NextResponse.json({
            message: `이미 ${existingPackages.length}개의 패키지가 DB에 존재합니다. 덮어쓰려면 force=true 옵션을 사용하세요.`,
            success: false,
            existingCount: existingPackages.length
          });
        }
        
        // 강제 덮어쓰기 옵션이 있고 기존 패키지가 있으면 모두 삭제
        if (existingPackages.length > 0 && forceOverwrite) {
          console.log('강제 덮어쓰기 옵션이 활성화되어 기존 패키지를 모두 삭제합니다...');
          await db.delete(packages);
          console.log('기존 패키지가 삭제되었습니다.');
        }
        
        // 데이터 변환
        console.log('패키지 데이터 변환 중...');
        const transformedPackages = body.packagesData.map(transformPackageData);
        console.log(`${transformedPackages.length}개의 패키지 데이터 변환 완료`);
        console.log('첫 번째 변환된 패키지 샘플:', JSON.stringify(transformedPackages[0]).substring(0, 200) + '...');
        
        // DB에 삽입
        console.log('패키지 데이터 DB에 삽입 중...');
        try {
          const insertedPackages = await db.insert(packages).values(transformedPackages).returning();
          console.log(`DB에 ${insertedPackages.length}개의 패키지 삽입 성공`);
          
          return NextResponse.json({
            message: `${insertedPackages.length}개의 패키지를 성공적으로 DB에 등록했습니다.`,
            success: true,
            count: insertedPackages.length
          });
        } catch (insertError: any) {
          console.error('DB 삽입 중 오류:', insertError);
          
          // 상세 오류 내용 로깅
          console.error('DB 삽입 오류 상세:', {
            name: insertError.name,
            message: insertError.message,
            code: insertError.code,
            stack: insertError.stack?.substring(0, 200)
          });
          
          throw insertError; // 상위 catch 블록에서 처리
        }
        
      } catch (error: any) {
        console.error('패키지 가져오기 중 오류 발생:', error);
        return NextResponse.json(
          { 
            error: '패키지 데이터 가져오기 실패', 
            details: error.message || '알 수 없는 오류',
            success: false
          }, 
          { status: 500 }
        );
      }
    } else {
      // 일반 패키지 생성 로직
      console.log('일반 패키지 생성 요청 처리 중...');
      try {
        const [newPackage] = await db.insert(packages).values(body).returning();
        console.log('새 패키지 생성 성공');
        return NextResponse.json(newPackage, { status: 201 });
      } catch (createError: any) {
        console.error('패키지 생성 중 오류:', createError);
        throw createError; // 상위 catch 블록에서 처리
      }
    }
  } catch (error: any) {
    console.error('패키지 생성 실패:', error);
    
    // 오류 상세 정보 로깅 
    console.error('오류 상세:', {
      name: error.name,
      message: error.message,
      code: error.code || 'N/A',
      stack: error.stack?.substring(0, 200) || 'No stack'
    });
    
    return NextResponse.json(
      {
        error: '패키지를 생성할 수 없습니다.',
        details: error.message || '알 수 없는 오류',
        success: false
      },
      { status: 500 }
    );
  }
}

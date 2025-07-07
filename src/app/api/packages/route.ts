import { db } from '@/lib/neon';
import { packages } from '@/lib/schema';
import { NextResponse } from 'next/server';

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
    const [newPackage] = await db.insert(packages).values(body).returning();
    return NextResponse.json(newPackage, { status: 201 });
  } catch (error) {
    console.error('패키지 생성 실패:', error);
    return NextResponse.json(
      {
        error: '패키지를 생성할 수 없습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 }
    );
  }
}

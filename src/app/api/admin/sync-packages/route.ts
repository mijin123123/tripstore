import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/neon';
import { packages } from '@/lib/schema';
import { packagesData } from '@/data/packagesData';
import { v4 as uuidv4 } from 'uuid';

// 메인 패키지 데이터를 DB 스키마에 맞게 변환
const transformPackageToDbFormat = (pkg: any) => {
  try {
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
    const season = '여름'; // 기본값
    
    // 이미지 URL 배열
    const images = pkg.gallery || [pkg.image];
    
    // 포함/불포함 항목
    const inclusions = pkg.includes || [];
    const exclusions = pkg.excludes || [];
    
    // 일정을 JSON 문자열로 직렬화
    const itinerary = pkg.itinerary 
      ? JSON.stringify({ 
          days: pkg.itinerary.map((item: any) => ({
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
      price: price.toString(), // decimal 타입에 맞게 문자열로 저장
      discountprice: discountPrice.toString(), // decimal 타입에 맞게 문자열로 저장
      duration: duration,
      departuredate: pkg.departureDate || [],
      images: images,
      rating: (pkg.rating || 4.5).toString(), // decimal 타입에 맞게 문자열로 저장
      reviewcount: Math.floor(Math.random() * 20) + 5,
      category: category,
      season: season,
      inclusions: inclusions,
      exclusions: exclusions,
      isfeatured: Math.random() > 0.5,
      isonsale: Math.random() > 0.7,
      itinerary: itinerary,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error(`패키지 변환 오류 (${pkg.name}):`, error);
    throw error;
  }
};

export async function POST(request: NextRequest) {
  console.log('=== 관리자: 패키지 데이터 직접 동기화 API 호출됨 ===');
  
  try {
    const body = await request.json();
    console.log('요청 본문:', body);
    
    // 관리자 인증 확인
    const adminAuth = request.cookies.get('admin_auth');
    if (!adminAuth || adminAuth.value !== 'true') {
      console.log('인증되지 않은 사용자의 동기화 시도');
      return NextResponse.json(
        { error: '동기화를 수행할 권한이 없습니다' },
        { status: 401 }
      );
    }
    
    console.log(`데이터 소스: packagesData.ts (${packagesData.length}개 항목)`);
    
    // 기존 패키지 모두 삭제 (깨끗한 상태에서 시작)
    console.log('기존 패키지 삭제 중...');
    await db.delete(packages);
    console.log('기존 패키지 삭제 완료');
    
    // 메인 패키지 데이터 변환
    console.log('패키지 데이터 변환 중...');
    const transformedPackages = [];
    
    for (const pkg of packagesData) {
      try {
        const transformed = transformPackageToDbFormat(pkg);
        transformedPackages.push(transformed);
      } catch (transformError) {
        console.error(`패키지 변환 실패 (ID: ${pkg.id}):`, transformError);
        // 하나의 패키지 변환 실패해도 계속 진행
      }
    }
    
    console.log(`${transformedPackages.length}개의 패키지 데이터 변환 완료`);
    
    // DB에 삽입
    if (transformedPackages.length === 0) {
      throw new Error('변환된 패키지가 없습니다.');
    }
    
    console.log('패키지 데이터 DB에 삽입 중...');
    const insertedPackages = await db.insert(packages).values(transformedPackages).returning();
    console.log(`DB에 ${insertedPackages.length}개의 패키지 삽입 성공`);
    
    // 성공 응답
    return NextResponse.json({
      success: true, 
      message: `${insertedPackages.length}개의 패키지를 성공적으로 동기화했습니다`,
      count: insertedPackages.length
    });
    
  } catch (error) {
    console.error('패키지 데이터 동기화 중 오류 발생:', error);
    return NextResponse.json(
      { 
        success: false,
        error: '패키지 데이터 동기화 실패', 
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      }, 
      { status: 500 }
    );
  }
}

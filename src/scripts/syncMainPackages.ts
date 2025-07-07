// 메인 사이트 패키지 데이터를 직접 DB에 동기화하는 스크립트
import { config } from 'dotenv';
config(); // .env 파일 로드

import { db } from '../lib/neon';
import { packages } from '../lib/schema';
import { packagesData } from '../data/packagesData';
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

async function syncMainPackages() {
  console.log('=== 메인 사이트 패키지 데이터 동기화 시작 ===');
  console.log(`데이터 소스: packagesData.ts (${packagesData.length}개 항목)`);
  
  try {
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
    
    // 첫 번째 패키지 확인
    if (insertedPackages.length > 0) {
      console.log('삽입된 첫 번째 패키지 ID:', insertedPackages[0].id);
    }
    
    return insertedPackages;
  } catch (error) {
    console.error('패키지 데이터 동기화 중 오류 발생:', error);
    throw error;
  }
}

// 스크립트 실행
syncMainPackages()
  .then((packages) => {
    console.log(`동기화 완료: ${packages?.length || 0}개의 패키지가 DB에 동기화됨`);
  })
  .catch(error => {
    console.error('치명적 오류:', error);
    process.exit(1);
  })
  .finally(() => {
    console.log('=== 동기화 프로세스 종료 ===');
    process.exit(0);
  });

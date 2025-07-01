import supabase from '../lib/supabase';
import { packagesData } from '../data/packagesData';

/**
 * packagesData.ts에서 Supabase로 데이터를 마이그레이션하는 함수
 * 이 스크립트는 한 번만 실행해야 합니다.
 */
export async function migratePackagesData() {
  console.log('패키지 데이터 마이그레이션을 시작합니다...');
  
  try {
    // 기존 데이터 형식을 Supabase 스키마에 맞게 변환
    const formattedData = packagesData.map(pkg => ({
      id: pkg.id.toString(), // Supabase에서는 id를 UUID로 저장하지만, 기존 데이터를 유지하기 위해 문자열로 변환
      title: pkg.name,
      description: pkg.description,
      destination: pkg.destination,
      price: parseFloat(pkg.price.replace(/[^\d.]/g, '')), // 가격에서 숫자만 추출
      discountPrice: null, // 할인 가격 정보가 있다면 설정
      duration: pkg.duration ? parseInt(pkg.duration.split(' ')[0]) : null,
      departureDate: pkg.departureDate || [],
      images: [pkg.image], // 단일 이미지를 배열로 변환
      rating: pkg.rating || null,
      reviewCount: 0, // 리뷰 수 초기값
      category: pkg.type,
      season: null, // 시즌 정보가 있다면 설정
      inclusions: pkg.includes || [],
      exclusions: pkg.excludes || [],
      isFeatured: false, // 추천 상품 여부
      isOnSale: false, // 세일 상품 여부
      itinerary: pkg.itinerary ? JSON.stringify(pkg.itinerary) : null,
    }));
    
    // Supabase에 데이터 삽입
    const { data, error } = await supabase
      .from('packages')
      .upsert(formattedData, {
        onConflict: 'id', // id가 중복되는 경우 업데이트
        ignoreDuplicates: false
      });
    
    if (error) {
      throw error;
    }
    
    console.log(`${formattedData.length}개의 패키지가 성공적으로 마이그레이션되었습니다.`);
    return { success: true, count: formattedData.length };
  } catch (error) {
    console.error('마이그레이션 중 오류가 발생했습니다:', error);
    return { success: false, error };
  }
}

// 이 파일을 직접 실행하는 경우에만 마이그레이션 수행
if (require.main === module) {
  migratePackagesData()
    .then(result => {
      if (result.success) {
        console.log('마이그레이션이 성공적으로 완료되었습니다.');
        process.exit(0);
      } else {
        console.error('마이그레이션 실패:', result.error);
        process.exit(1);
      }
    });
}

export default migratePackagesData;

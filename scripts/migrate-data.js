// migrate-data.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// ESM에서 __dirname 사용하기
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.local 파일 로드
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Supabase URL 또는 서비스 키가 설정되지 않았습니다.');
  process.exit(1);
}

// Supabase 클라이언트 생성 (서비스 키 사용)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateData() {
  try {
    console.log('데이터 마이그레이션 시작...');
    
    // 카테고리 데이터 삽입
    const categories = [
      { name: '국내', slug: 'domestic', description: '국내 여행 패키지' },
      { name: '해외', slug: 'overseas', description: '해외 여행 패키지' },
      { name: '호텔', slug: 'hotel', description: '호텔 예약' },
      { name: '럭셔리', slug: 'luxury', description: '럭셔리 여행 상품' },
      { name: '풀빌라', slug: 'pool-villa', description: '프라이빗 풀빌라', parent_id: 1 },
      { name: '리조트', slug: 'resort', description: '리조트 숙박', parent_id: 1 },
      { name: '유럽', slug: 'europe', description: '유럽 여행', parent_id: 2 },
      { name: '동남아시아', slug: 'southeast-asia', description: '동남아시아 여행', parent_id: 2 },
      { name: '일본', slug: 'japan', description: '일본 여행', parent_id: 2 },
      { name: '미주', slug: 'americas', description: '미주 여행', parent_id: 2 },
      { name: '중국/홍콩', slug: 'china-hongkong', description: '중국 및 홍콩 여행', parent_id: 2 },
      { name: '괌/사이판', slug: 'guam-saipan', description: '괌 및 사이판 여행', parent_id: 2 }
    ];
    
    console.log('카테고리 데이터 삽입 중...');
    const { data: catData, error: catError } = await supabase.from('categories').upsert(categories, {
      onConflict: 'slug',
      ignoreDuplicates: false
    });
    
    if (catError) {
      throw new Error(`카테고리 데이터 삽입 중 오류: ${catError.message}`);
    }
    
    // 지역 데이터 삽입
    const regions = [
      { name: 'Domestic', name_ko: '국내', slug: 'domestic', description: '국내 여행지' },
      { name: 'Overseas', name_ko: '해외', slug: 'overseas', description: '해외 여행지' },
      { name: 'Jeju', name_ko: '제주도', slug: 'jeju', description: '제주도', parent_id: 1 },
      { name: 'Gangwon', name_ko: '강원도', slug: 'gangwon', description: '강원도', parent_id: 1 },
      { name: 'Gyeonggi', name_ko: '경기도', slug: 'gyeonggi', description: '경기도', parent_id: 1 },
      { name: 'Europe', name_ko: '유럽', slug: 'europe', description: '유럽', parent_id: 2 },
      { name: 'Southeast Asia', name_ko: '동남아시아', slug: 'southeast-asia', description: '동남아시아', parent_id: 2 },
      { name: 'Japan', name_ko: '일본', slug: 'japan', description: '일본', parent_id: 2 },
      { name: 'Americas', name_ko: '미주', slug: 'americas', description: '미주', parent_id: 2 },
      { name: 'China/Hongkong', name_ko: '중국/홍콩', slug: 'china-hongkong', description: '중국 및 홍콩', parent_id: 2 },
      { name: 'Guam/Saipan', name_ko: '괌/사이판', slug: 'guam-saipan', description: '괌 및 사이판', parent_id: 2 }
    ];
    
    console.log('지역 데이터 삽입 중...');
    const { data: regionData, error: regionError } = await supabase.from('regions').upsert(regions, {
      onConflict: 'slug',
      ignoreDuplicates: false
    });
    
    if (regionError) {
      throw new Error(`지역 데이터 삽입 중 오류: ${regionError.message}`);
    }
    
    // 샘플 빌라 데이터 마이그레이션
    const villas = [
      {
        id: 'domestic-villa-1',
        name: '제주 사려니 프라이빗풀 빌라',
        location: '제주도 서귀포시',
        image: '/images/villa-jeju.jpg',
        rating: 5,
        price: '480,000',
        features: ['프라이빗 풀', '한라산 뷰', '바베큐'],
        region_id: 3, // Jeju
        description: '제주 사려니 숲길 근처에 위치한 독채 풀빌라로, 한라산 전망을 감상할 수 있는 프라이빗 풀과 야외 바베큐 시설을 갖추고 있습니다.',
        max_people: 6,
        bed_count: 3,
        bath_count: 2,
        is_featured: true
      },
      {
        id: 'domestic-villa-2',
        name: '강원도 평창 하늘정원 빌라',
        location: '평창, 강원도',
        image: '/images/villa-pyeongchang.jpg',
        rating: 5,
        price: '420,000',
        features: ['온수풀', '스키리조트 근처', '자쿠지'],
        region_id: 4, // Gangwon
        description: '강원도 평창의 높은 고도에 위치한 럭셔리 풀빌라로, 계절에 상관없이 즐길 수 있는 온수 수영장과 자쿠지를 갖추고 있습니다.',
        max_people: 4,
        bed_count: 2,
        bath_count: 2
      },
      {
        id: 'domestic-villa-3',
        name: '경기도 가평 수상 풀빌라',
        location: '가평, 경기도',
        image: '/images/villa-gapyeong.jpg',
        rating: 4.5,
        price: '380,000',
        features: ['수상 빌라', '오픈 에어풀', '캠프파이어'],
        region_id: 5, // Gyeonggi
        description: '가평의 호수 위에 지어진 독특한 수상 풀빌라로, 자연 속에서 프라이빗한 휴식을 즐길 수 있습니다.',
        max_people: 4,
        bed_count: 2,
        bath_count: 1
      }
    ];
    
    console.log('빌라 데이터 삽입 중...');
    const { data: villaData, error: villaError } = await supabase.from('villas').upsert(villas, {
      onConflict: 'id',
      ignoreDuplicates: false
    });
    
    if (villaError) {
      throw new Error(`빌라 데이터 삽입 중 오류: ${villaError.message}`);
    }
    
    // 샘플 패키지 데이터 마이그레이션
    const packages = [
      {
        id: 'europe-paris-1',
        type: 'overseas',
        region: 'europe',
        region_ko: '유럽',
        title: '파리 에펠탑 투어 5박 7일',
        price: '3,500,000',
        duration: '5박 7일',
        rating: 4.8,
        image: '/images/europe-hero.jpg',
        highlights: ['에펠탑 우선입장권', '루브르 박물관 가이드 투어', '센 강 크루즈', '몽마르트르 언덕 투어'],
        departure: '인천',
        description: '파리의 상징인 에펠탑부터 루브르 박물관, 세계적인 미술관과 역사적 건축물을 돌아보는 파리 핵심 투어입니다. 전문 가이드와 함께 파리의 역사와 문화를 체험해보세요.',
        region_id: 6, // Europe
        category_id: 2, // Overseas
        is_featured: true
      },
      {
        id: 'japan-tokyo-1',
        type: 'overseas',
        region: 'japan',
        region_ko: '일본',
        title: '도쿄 벚꽃 여행 3박 4일',
        price: '1,200,000',
        duration: '3박 4일',
        rating: 4.7,
        image: '/images/japan-hero.jpg',
        highlights: ['우에노 공원 벚꽃 구경', '아사쿠사 센소지 방문', '도쿄 스카이트리 전망대', '시부야 쇼핑'],
        departure: '김포',
        description: '봄 시즌 도쿄의 아름다운 벚꽃을 감상하는 특별한 여행입니다. 우에노 공원의 벚꽃길과 함께 도쿄의 주요 관광지를 둘러보세요.',
        region_id: 8, // Japan
        category_id: 2 // Overseas
      }
    ];
    
    console.log('패키지 데이터 삽입 중...');
    const { data: packageData, error: packageError } = await supabase.from('packages').upsert(packages, {
      onConflict: 'id',
      ignoreDuplicates: false
    });
    
    if (packageError) {
      throw new Error(`패키지 데이터 삽입 중 오류: ${packageError.message}`);
    }
    
    console.log('데이터 마이그레이션이 성공적으로 완료되었습니다.');
  } catch (error) {
    console.error('데이터 마이그레이션 중 오류 발생:', error);
    process.exit(1);
  }
}

migrateData();

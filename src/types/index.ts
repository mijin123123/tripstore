export interface Package {
  id: string;
  type?: string;
  region?: string;
  regionKo?: string; // camelCase 사용 (database.types.ts와 일치시킴)
  region_ko?: string; // 호환성을 위한 별칭
  title?: string;
  name?: string; // 데이터베이스 스키마에 있는 name 필드
  price: number | string;
  duration?: string;
  rating?: number;
  image?: string;
  images?: string[]; // 여러 이미지 URL 배열
  highlights?: string[];
  departure?: string;
  description?: string;
  min_people?: number; // 최소 인원
  max_people?: number; // 최대 인원
  category_id?: number; // 카테고리 ID
  is_featured?: boolean; // 추천 패키지 여부
  location?: string; // 데이터베이스 스키마에 있는 location 필드
  itinerary?: {
    day: number;
    title: string;
    description: string;
    accommodation: string;
    meals: {
      breakfast: boolean;
      lunch: boolean;
      dinner: boolean;
    }
  }[];
  included?: string[];
  excluded?: string[];
  notes?: string[];
  features?: {
    location?: string;
    images?: string[];
    additional_images?: string[];
    all_images?: string[];
    [key: string]: any; // 다른 추가 속성을 위한 인덱스 시그니처
  } | string[]; // 이전 버전과의 호환성을 위해 string[]도 허용
}

export interface Villa {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  price: string;
  features: string[];
}

// Supabase 데이터베이스 테이블에 맞는 타입 정의
export type PackageTable = Package;
export type VillaTable = Villa;

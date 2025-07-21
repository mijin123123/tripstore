export interface Package {
  id: string;
  type: string;
  region: string;
  regionKo: string;
  title: string;
  price: string;
  duration: string;
  rating: number;
  image: string;
  highlights: string[];
  departure: string;
  description: string;
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
  features?: string[];
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

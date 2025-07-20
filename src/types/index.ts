// 사용자 타입
export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

// 여행 패키지 타입
export interface TravelPackage {
  id: string;
  title: string;
  description: string;
  destination: string;
  duration: number; // 일수
  price: number;
  maxParticipants: number;
  currentParticipants: number;
  startDate: Date;
  endDate: Date;
  images: string[];
  itinerary: ItineraryItem[];
  status: 'active' | 'inactive' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

// 여행 일정 아이템
export interface ItineraryItem {
  day: number;
  title: string;
  description: string;
  activities: string[];
}

// 예약 타입
export interface Booking {
  id: string;
  userId: string;
  packageId: string;
  participants: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  specialRequests?: string;
  emergencyContact: EmergencyContact;
  createdAt: Date;
  updatedAt: Date;
}

// 비상 연락처
export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

// API 응답 타입
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  code?: string;
}

// 페이지네이션 타입
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

// 검색 필터 타입
export interface PackageFilters {
  destination?: string;
  minPrice?: number;
  maxPrice?: number;
  duration?: number;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'duration' | 'startDate' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// JWT 페이로드 타입
export interface JwtPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

// 요청 확장 타입 (인증된 사용자 정보 포함)
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

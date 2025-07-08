"use client";

import { useEffect, useState } from 'react';
import { User, Map, Heart, Settings, ChevronRight, Package, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/real-auth';
import { useRouter } from 'next/navigation';

// 임시 예약 데이터
const mockReservations = [
  {
    id: '1',
    packageTitle: '제주도 3박 4일 완전정복 투어',
    departureDate: '2024-03-15',
    status: '예약 확정',
    travelers: 2,
    totalPrice: 500000,
  },
  {
    id: '2',
    packageTitle: '오사카 자유 여행 패키지',
    departureDate: '2024-04-20',
    status: '결제 대기',
    travelers: 1,
    totalPrice: 780000,
  },
];

// 임시 위시리스트 데이터
const mockWishlist = [
  {
    id: '101',
    packageTitle: '유럽 6개국 14일 투어',
    price: 2800000,
    image: '/travel-image-1.jpg'
  },
  {
    id: '102',
    packageTitle: '방콕 5일 자유여행',
    price: 650000,
    image: '/travel-image-2.jpg'
  },
  {
    id: '103',
    packageTitle: '뉴욕 핵심 관광지 투어',
    price: 1800000,
    image: '/travel-image-3.jpg'
  },
];

export default function MyPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('예약');
  
  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/mypage');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-32 w-32 mb-4 bg-gray-200 rounded-full"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // 리다이렉트 처리되기 때문에 여기서는 빈 화면만 표시
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* 프로필 섹션 */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10 p-6 bg-white rounded-lg shadow">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mb-2">
            <User size={40} />
          </div>
          <button className="text-sm text-blue-600 mt-1 hover:underline">프로필 편집</button>
        </div>
        
        <div className="flex-grow text-center md:text-left">
          <h1 className="text-2xl font-bold">{user.email || '사용자'} 님</h1>
          <p className="text-gray-500 mt-1">가입일: 2024년 1월 15일</p>
          
          <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
            <div className="px-4 py-2 bg-blue-50 rounded-full text-blue-700 flex items-center gap-1">
              <Map size={16} />
              <span>여행 5회</span>
            </div>
            <div className="px-4 py-2 bg-red-50 rounded-full text-red-700 flex items-center gap-1">
              <Heart size={16} />
              <span>찜 {mockWishlist.length}개</span>
            </div>
            <div className="px-4 py-2 bg-green-50 rounded-full text-green-700 flex items-center gap-1">
              <Package size={16} />
              <span>예약 {mockReservations.length}건</span>
            </div>
          </div>
        </div>
        
        <div className="hidden md:block">
          <Link href="/settings" className="flex items-center gap-1 text-gray-600 hover:text-blue-600">
            <Settings size={16} />
            <span>설정</span>
          </Link>
        </div>
      </div>
      
      {/* 탭 네비게이션 */}
      <div className="mb-6 border-b">
        <div className="flex space-x-6">
          {['예약', '찜 목록', '리뷰'].map((tab) => (
            <button
              key={tab}
              className={`pb-3 px-1 ${activeTab === tab 
                ? 'border-b-2 border-blue-600 text-blue-600 font-medium' 
                : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      
      {/* 탭 콘텐츠 */}
      <div className="mb-10">
        {/* 예약 탭 */}
        {activeTab === '예약' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">내 예약 목록</h2>
            {mockReservations.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-lg">
                <AlertTriangle className="mx-auto mb-3 text-gray-400" size={40} />
                <p className="text-gray-500">아직 예약한 여행이 없습니다.</p>
                <Link href="/packages" className="mt-3 inline-block text-blue-600 hover:underline">
                  여행 상품 둘러보기
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {mockReservations.map((reservation) => (
                  <Link 
                    key={reservation.id} 
                    href={`/reservation/${reservation.id}`} 
                    className="block bg-white p-4 rounded-lg border hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{reservation.packageTitle}</h3>
                        <p className="text-sm text-gray-500">출발일: {reservation.departureDate} • {reservation.travelers}인</p>
                        <div className={`mt-1 inline-block px-2 py-0.5 text-xs rounded-full ${
                          reservation.status === '예약 확정' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {reservation.status}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="text-gray-500 text-sm">총액</p>
                          <p className="font-medium">{reservation.totalPrice.toLocaleString()}원</p>
                        </div>
                        <ChevronRight className="text-gray-400" size={20} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

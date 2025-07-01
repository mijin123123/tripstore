"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ChevronRight, 
  Search, 
  Bell, 
  Calendar, 
  ChevronLeft,
  ArrowLeft,
  Eye,
  FileText,
  Filter
} from 'lucide-react';

// 임시 공지사항 데이터 (실제 구현에서는 API로 가져올 것입니다)
const notices = [
  { id: 1, title: 'TripStore 그랜드 오픈! 특별 할인 이벤트를 확인하세요.', date: '2025-06-29', category: '이벤트', content: '오픈 기념 할인 이벤트 안내입니다. 모든 여행 상품 15% 할인!', views: 428 },
  { id: 2, title: '여름 휴가 시즌, 항공권/숙소 예약 유의사항 안내', date: '2025-06-28', category: '공지', content: '성수기 예약 시 주의사항에 대해 안내드립니다.', views: 356 },
  { id: 3, title: '개인정보 처리방침 개정 안내 (2025년 7월 15일 시행)', date: '2025-06-25', category: '안내', content: '개인정보보호법 개정에 따라 당사 개인정보 처리방침이 변경됩니다.', views: 289 },
  { id: 4, title: '시스템 정기 점검 안내 (2025년 6월 30일 02:00 ~ 04:00)', date: '2025-06-24', category: '점검', content: '시스템 안정화를 위한 정기 점검 시간 안내입니다.', views: 198 },
  { id: 5, title: '신규 여행 상품 출시: 동유럽 4개국 9일', date: '2025-06-22', category: '상품', content: '새롭게 출시된 동유럽 패키지 상품을 소개합니다.', views: 312 },
  { id: 6, title: '카드사 프로모션 안내 (2025년 7월)', date: '2025-06-20', category: '이벤트', content: '제휴 카드사 할인 혜택 안내입니다.', views: 276 },
  { id: 7, title: '비수기 특가 패키지 출시 안내', date: '2025-06-18', category: '상품', content: '비수기 특별 할인 상품을 확인하세요.', views: 234 },
  { id: 8, title: '여행자 보험 가입 안내', date: '2025-06-15', category: '안내', content: '안전한 여행을 위한 여행자 보험 안내입니다.', views: 156 },
  { id: 9, title: '해외 입국 정책 변경 안내 (2025년 하반기)', date: '2025-06-10', category: '안내', content: '주요 여행지 입국 정책 변경 사항을 안내드립니다.', views: 177 },
  { id: 10, title: 'TripStore 모바일 앱 출시 안내', date: '2025-06-08', category: '공지', content: 'iOS/Android 앱이 출시되었습니다. 앱 설치 시 적립금 1만원 지급!', views: 398 },
  { id: 11, title: '유럽 지역 기차 파업에 따른 일정 변경 안내', date: '2025-06-05', category: '안내', content: '유럽 일부 국가 기차 파업으로 인한 대체 교통편 안내입니다.', views: 201 },
  { id: 12, title: '여름 휴가 조기 예약 프로모션', date: '2025-06-01', category: '이벤트', content: '8월 출발 상품 조기 예약 시 최대 20% 할인 혜택을 드립니다.', views: 329 },
  { id: 13, title: '신규 회원 가입 혜택 안내', date: '2025-05-28', category: '이벤트', content: '신규 회원 가입 시 적립금 2만원과 할인 쿠폰을 드립니다.', views: 245 },
  { id: 14, title: '항공사 수하물 규정 변경 안내', date: '2025-05-25', category: '안내', content: '주요 항공사 수하물 규정 변경 사항을 확인하세요.', views: 187 },
  { id: 15, title: '여행 상품 예약 및 결제 시스템 개선 안내', date: '2025-05-20', category: '공지', content: '더 편리해진 예약 및 결제 시스템을 소개합니다.', views: 165 },
  { id: 16, title: '제주 특가 패키지 출시 안내', date: '2025-05-15', category: '상품', content: '초여름 제주 3일 특가 상품이 출시되었습니다.', views: 278 },
  { id: 17, title: '태국 여행 비자 면제 연장 안내', date: '2025-05-10', category: '안내', content: '태국 정부의 관광객 비자 면제 기간 연장 발표에 관한 안내입니다.', views: 189 },
  { id: 18, title: '고객 만족도 조사 참여 이벤트', date: '2025-05-05', category: '이벤트', content: '고객 만족도 조사 참여시 추첨을 통해 경품을 드립니다.', views: 156 },
  { id: 19, title: '휴면 계정 전환 예정 안내', date: '2025-05-01', category: '공지', content: '1년 이상 미접속 계정 휴면 전환 안내입니다.', views: 132 },
  { id: 20, title: '해외여행 안전 정보 업데이트', date: '2025-04-28', category: '안내', content: '외교부 발표 해외 국가별 안전 정보가 업데이트되었습니다.', views: 175 },
];

// 카테고리 목록
const categories = ['전체', '이벤트', '공지', '안내', '점검', '상품'];

export default function AllNoticePage() {
  const [activeCategory, setActiveCategory] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'latest' | 'views'>('latest');
  const itemsPerPage = 10;

  // 공지사항 필터링
  const filteredNotices = notices.filter(notice => {
    const matchesCategory = activeCategory === '전체' || notice.category === activeCategory;
    const matchesSearch = 
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // 정렬 적용
  const sortedNotices = [...filteredNotices].sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return b.views - a.views;
    }
  });

  // 페이지네이션 계산
  const totalPages = Math.ceil(sortedNotices.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedNotices.slice(indexOfFirstItem, indexOfLastItem);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // 페이지 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 정렬 변경 핸들러
  const handleSortChange = (sort: 'latest' | 'views') => {
    setSortBy(sort);
    setCurrentPage(1); // 정렬 변경 시 첫 페이지로 이동
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* 히어로 섹션 */}
      <div className="relative bg-gray-800 text-white">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <Image 
            src="https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?q=80&w=2070&auto=format&fit=crop"
            alt="공지사항 배경"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="container mx-auto px-6 py-12 md:py-16 relative z-10">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">공지사항</h1>
            <p className="text-base md:text-lg text-gray-200 max-w-2xl mx-auto">
              TripStore의 새로운 소식과 중요 공지사항을 확인하세요.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 상단 네비게이션 */}
        <div className="mb-6">
          <Link 
            href="/notice" 
            className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            고객센터로 돌아가기
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          {/* 검색 및 필터링 */}
          <div className="p-6 border-b">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="공지사항 검색"
                  className="pl-10 py-2 pr-3 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // 검색어 변경 시 첫 페이지로 이동
                  }}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 flex items-center">
                  <Filter className="h-4 w-4 mr-1" />
                  정렬:
                </span>
                <button
                  onClick={() => handleSortChange('latest')}
                  className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                    sortBy === 'latest'
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  최신순
                </button>
                <button
                  onClick={() => handleSortChange('views')}
                  className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                    sortBy === 'views'
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  조회순
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    setCurrentPage(1); // 카테고리 변경 시 첫 페이지로 이동
                  }}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    activeCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* 공지사항 목록 */}
          <div>
            {currentItems.length > 0 ? (
              <>
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="hidden md:table-row">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">카테고리</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">날짜</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">조회수</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentItems.map((notice) => (
                      <tr key={notice.id} className="hover:bg-blue-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                          <span className={`
                            text-xs font-medium px-2.5 py-0.5 rounded-full
                            ${notice.category === '이벤트' ? 'bg-purple-100 text-purple-800' : ''}
                            ${notice.category === '공지' ? 'bg-blue-100 text-blue-800' : ''}
                            ${notice.category === '안내' ? 'bg-green-100 text-green-800' : ''}
                            ${notice.category === '점검' ? 'bg-orange-100 text-orange-800' : ''}
                            ${notice.category === '상품' ? 'bg-teal-100 text-teal-800' : ''}
                          `}>
                            {notice.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Link href={`/notice/${notice.id}`} className="block">
                            <div className="flex md:hidden items-center mb-1">
                              <span className={`
                                text-xs font-medium px-2 py-0.5 rounded-full mr-2
                                ${notice.category === '이벤트' ? 'bg-purple-100 text-purple-800' : ''}
                                ${notice.category === '공지' ? 'bg-blue-100 text-blue-800' : ''}
                                ${notice.category === '안내' ? 'bg-green-100 text-green-800' : ''}
                                ${notice.category === '점검' ? 'bg-orange-100 text-orange-800' : ''}
                                ${notice.category === '상품' ? 'bg-teal-100 text-teal-800' : ''}
                              `}>
                                {notice.category}
                              </span>
                              <span className="text-xs text-gray-500">{notice.date}</span>
                            </div>
                            <div className="group flex items-center">
                              <h3 className="text-sm md:text-base font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                {notice.title}
                              </h3>
                              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 ml-auto md:hidden" />
                            </div>
                            <p className="mt-1 text-xs text-gray-500 line-clamp-1 md:hidden">{notice.content}</p>
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                          {notice.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                          <div className="flex items-center">
                            <Eye className="h-3.5 w-3.5 mr-1 text-gray-400" />
                            {notice.views}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* 페이지네이션 */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center py-6">
                    <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">이전</span>
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        // 많은 페이지가 있을 경우 일부만 표시
                        if (
                          pageNumber <= 3 || 
                          pageNumber > totalPages - 3 || 
                          (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => handlePageChange(pageNumber)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === pageNumber
                                  ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                  : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        } else if (
                          (pageNumber === 4 && currentPage > 4) || 
                          (pageNumber === totalPages - 3 && currentPage < totalPages - 3)
                        ) {
                          // 생략 부호 표시
                          return (
                            <span
                              key={pageNumber}
                              className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                            >
                              ...
                            </span>
                          );
                        } else {
                          return null;
                        }
                      })}
                      
                      <button
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">다음</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">검색 결과가 없습니다</h3>
                <p className="mt-1 text-gray-500">다른 키워드로 검색하거나 필터를 변경해 보세요.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* 검색 결과 요약 */}
        {filteredNotices.length > 0 && (
          <div className="mb-8 text-sm text-gray-500 text-center">
            전체 {filteredNotices.length}개 중 {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredNotices.length)}개 표시 
            {searchTerm && ` (검색어: "${searchTerm}")`}
            {activeCategory !== '전체' && ` (카테고리: ${activeCategory})`}
          </div>
        )}
      </div>
    </div>
  );
}

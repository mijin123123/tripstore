"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ChevronRight, 
  Search, 
  Bell, 
  HelpCircle, 
  Calendar, 
  Info, 
  AlignLeft, 
  MinusCircle,
  ArrowRight,
  ChevronDown
} from 'lucide-react';

const notices = [
  { id: 1, title: 'TripStore 그랜드 오픈! 특별 할인 이벤트를 확인하세요.', date: '2025-06-29', category: '이벤트', content: '오픈 기념 할인 이벤트 안내입니다. 모든 여행 상품 15% 할인!' },
  { id: 2, title: '여름 휴가 시즌, 항공권/숙소 예약 유의사항 안내', date: '2025-06-28', category: '공지', content: '성수기 예약 시 주의사항에 대해 안내드립니다.' },
  { id: 3, title: '개인정보 처리방침 개정 안내 (2025년 7월 15일 시행)', date: '2025-06-25', category: '안내', content: '개인정보보호법 개정에 따라 당사 개인정보 처리방침이 변경됩니다.' },
  { id: 4, title: '시스템 정기 점검 안내 (2025년 6월 30일 02:00 ~ 04:00)', date: '2025-06-24', category: '점검', content: '시스템 안정화를 위한 정기 점검 시간 안내입니다.' },
  { id: 5, title: '신규 여행 상품 출시: 동유럽 4개국 9일', date: '2025-06-22', category: '상품', content: '새롭게 출시된 동유럽 패키지 상품을 소개합니다.' },
  { id: 6, title: '카드사 프로모션 안내 (2025년 7월)', date: '2025-06-20', category: '이벤트', content: '제휴 카드사 할인 혜택 안내입니다.' },
  { id: 7, title: '비수기 특가 패키지 출시 안내', date: '2025-06-18', category: '상품', content: '비수기 특별 할인 상품을 확인하세요.' },
  { id: 8, title: '여행자 보험 가입 안내', date: '2025-06-15', category: '안내', content: '안전한 여행을 위한 여행자 보험 안내입니다.' },
];

const faqs = [
  {
    id: 1,
    question: '예약 취소는 어떻게 하나요?',
    answer: '예약 취소는 마이페이지 > 예약 내역에서 가능합니다. 취소 수수료는 출발일로부터 남은 기간에 따라 차등 적용되며, 자세한 내용은 각 상품의 취소 규정을 참고해 주세요.'
  },
  {
    id: 2,
    question: '여행 상품 결제는 어떤 방식으로 할 수 있나요?',
    answer: '현재 계좌이체를 통한 결제만 가능합니다. 입금 확인 후 예약이 확정됩니다. 추후 카드 결제 시스템도 도입 예정입니다.'
  },
  {
    id: 3,
    question: '비자 신청은 어떻게 하나요?',
    answer: '비자가 필요한 국가의 경우, 예약 확정 후 안내 메일을 통해 필요한 서류와 절차를 안내해 드립니다. 비자 발급 대행 서비스도 별도 요금으로 제공하고 있습니다.'
  },
  {
    id: 4,
    question: '여행자 보험은 포함되어 있나요?',
    answer: '대부분의 패키지 상품에는 기본적인 여행자 보험이 포함되어 있습니다. 보장 범위와 금액은 상품별로 상이할 수 있으니 상세 페이지에서 확인해 주세요. 추가 보험 가입도 가능합니다.'
  },
  {
    id: 5,
    question: '단체 예약은 어떻게 하나요?',
    answer: '10명 이상의 단체 예약은 이메일 또는 고객센터 전화를 통해 문의해 주시면 전담 상담원이 맞춤형 견적을 안내해 드립니다. 단체 예약 시 추가 할인 혜택이 제공됩니다.'
  },
];

const categories = ['전체', '이벤트', '공지', '안내', '점검', '상품'];

export default function NoticePage() {
  const [activeCategory, setActiveCategory] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaqs, setExpandedFaqs] = useState<number[]>([]);

  // 페이지 내 스크롤을 위한 ref
  const noticeRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  // FAQ 토글 함수
  const toggleFaq = (id: number) => {
    setExpandedFaqs(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // 스크롤 내비게이션 함수
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref && ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  // 공지사항 필터링
  const filteredNotices = notices.filter(notice => {
    const matchesCategory = activeCategory === '전체' || notice.category === activeCategory;
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* 히어로 섹션 */}
      <div className="relative bg-gray-800 text-white">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <Image 
            src="https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?q=80&w=2070&auto=format&fit=crop"
            alt="고객센터 배경"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="container mx-auto px-6 py-16 md:py-24 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">고객센터</h1>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto">
              TripStore와 함께하는 여행에 관한 모든 문의사항과 소식을 확인하세요.
            </p>
            
            {/* 빠른 네비게이션 버튼 */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <button 
                onClick={() => scrollToSection(noticeRef)}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all flex items-center"
              >
                <Bell className="h-4 w-4 mr-1.5" />
                공지사항
              </button>
              <button 
                onClick={() => scrollToSection(faqRef)}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all flex items-center"
              >
                <HelpCircle className="h-4 w-4 mr-1.5" />
                자주 묻는 질문
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">

        <div className="flex flex-col">
          <div className="w-full">
            {/* 공지사항 섹션 */}
            <div ref={noticeRef} className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Bell className="h-6 w-6 mr-2 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-800">공지사항</h2>
                  </div>
                  <Link href="/notice/all" className="text-sm text-blue-600 flex items-center hover:underline">
                    모든 공지 보기
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
                
                {/* 검색 및 필터링 */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500" />
                    <input
                      type="text"
                      placeholder="공지사항 검색"
                      className="pl-10 py-2 pr-3 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
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
              </div>

              {/* 공지사항 목록 */}
              <div>
                {filteredNotices.length > 0 ? (
                  <ul className="divide-y divide-gray-100">
                    {filteredNotices.map((notice) => (
                      <li key={notice.id}>
                        <Link 
                          href={`/notice/${notice.id}`}
                          className="block group hover:bg-blue-50 transition-colors"
                        >
                          <div className="p-6">
                            <div className="flex items-center mb-2">
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
                              <span className="text-sm text-gray-500 ml-3 flex items-center">
                                <Calendar className="h-3.5 w-3.5 mr-1" />
                                {notice.date}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                {notice.title}
                              </h3>
                              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                            </div>
                            <p className="mt-1 text-sm text-gray-500 line-clamp-1">{notice.content}</p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-12">
                    <Info className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">검색 결과가 없습니다</h3>
                    <p className="mt-1 text-gray-500">다른 키워드로 검색하거나 필터를 변경해 보세요.</p>
                  </div>
                )}
              </div>
            </div>

            {/* FAQ 섹션 */}
            <div ref={faqRef} className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 lg:mb-0">
              <div className="p-6 border-b">
                <div className="flex items-center mb-2">
                  <HelpCircle className="h-6 w-6 mr-2 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-800">자주 묻는 질문</h2>
                </div>
                <p className="text-gray-600">여행 관련 자주 묻는 질문들을 모았습니다.</p>
              </div>

              <ul className="divide-y divide-gray-100">
                {faqs.map((faq) => (
                  <li key={faq.id}>
                    <div 
                      className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleFaq(faq.id)}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                        <button 
                          className={`flex-shrink-0 transition-transform duration-300 ${
                            expandedFaqs.includes(faq.id) ? 'rotate-180' : ''
                          }`}
                        >
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        </button>
                      </div>
                      <div 
                        className={`mt-3 pl-4 border-l-4 border-blue-100 overflow-hidden transition-all duration-300 ${
                          expandedFaqs.includes(faq.id) 
                            ? 'max-h-96 opacity-100' 
                            : 'max-h-0 opacity-0'
                        }`}
                      >
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

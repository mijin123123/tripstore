'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Share2, 
  Printer, 
  ChevronRight,
  FileText,
  Bell
} from 'lucide-react';

// 임시 공지사항 데이터 (실제 구현에서는 API로 가져올 것입니다)
const notices = [
  { id: 1, title: 'TripStore 그랜드 오픈! 특별 할인 이벤트를 확인하세요.', date: '2025-06-29', category: '이벤트', content: '안녕하세요, TripStore 고객 여러분!\n\n저희 TripStore가 드디어 그랜드 오픈을 하게 되었습니다. 이를 기념하여 특별한 할인 이벤트를 준비했습니다.\n\n## 오픈 기념 할인 이벤트 안내\n\n### 1. 전 상품 15% 할인\n- 기간: 2025년 7월 1일 ~ 7월 31일\n- 대상: 모든 여행 상품\n- 방법: 결제 시 쿠폰 코드 "GRAND2025" 입력\n\n### 2. 얼리버드 추가 5% 할인\n- 기간: 2025년 7월 1일 ~ 7월 15일\n- 조건: 9월 이후 출발 상품 예약 시\n\n### 3. 첫 구매 고객 웰컴 기프트\n- 여행용 파우치 세트 증정 (선착순 100명)\n\n이번 할인 이벤트를 통해 더 많은 고객님들께서 저희 TripStore와 함께 특별한 여행 경험을 시작하시길 바랍니다.\n\n감사합니다.', views: 428 },
  { id: 2, title: '여름 휴가 시즌, 항공권/숙소 예약 유의사항 안내', date: '2025-06-28', category: '공지', content: '여름 휴가 시즌을 맞아 항공권 및 숙소 예약 시 유의사항을 안내해 드립니다.\n\n## 항공권 예약 유의사항\n\n1. **조기 예약의 중요성**\n   - 성수기(7-8월) 항공권은 최소 3개월 전 예약 권장\n   - 주요 휴가지 노선은 빠르게 매진될 수 있음\n\n2. **요금 규정 확인**\n   - 취소/변경 수수료 규정 필수 확인\n   - 성수기에는 특별 규정이 적용될 수 있음\n\n3. **대체 일정 고려**\n   - 피크 시즌 전후로 일정 조정 시 20-30% 저렴한 요금 가능\n\n## 숙소 예약 유의사항\n\n1. **위치와 교통편 확인**\n   - 주요 관광지와의 거리 및 대중교통 접근성 체크\n   - 공항/기차역에서의 이동 방법 사전 확인\n\n2. **취소 정책 확인**\n   - 성수기에는 엄격한 취소 정책이 적용되는 경우가 많음\n   - 무료 취소 가능 기간 체크\n\n3. **리뷰 확인의 중요성**\n   - 최근 6개월 내 리뷰 중심으로 확인\n   - 청결도와 WiFi 품질 관련 리뷰 체크\n\n안전하고 즐거운 여행 되시길 바랍니다.', views: 356 },
  { id: 3, title: '개인정보 처리방침 개정 안내 (2025년 7월 15일 시행)', date: '2025-06-25', category: '안내', content: '안녕하세요, TripStore입니다.\n\n개인정보보호법 개정에 따라 당사의 개인정보 처리방침이 2025년 7월 15일부터 아래와 같이 변경됨을 안내해 드립니다.\n\n## 주요 변경 사항\n\n1. **개인정보 보관 기간 변경**\n   - 기존: 회원 탈퇴 후 3개월 보관\n   - 변경: 회원 탈퇴 후 1개월 보관 후 파기\n\n2. **마케팅 목적 정보 이용 동의 방식 변경**\n   - 기존: 포괄적 동의 방식\n   - 변경: 세부 항목별 선택적 동의 방식으로 변경\n\n3. **제3자 정보 제공 범위 명확화**\n   - 여행 상품 예약을 위한 필수적 제3자 제공 범위 구체화\n   - 항공사, 숙박시설, 현지 여행사 등으로 구분하여 제공 목적과 항목 명시\n\n4. **개인정보 처리 위탁 업체 변경**\n   - 결제 처리 위탁업체 추가: SecurePay Inc.\n   - 이메일 마케팅 위탁업체 변경: MarketMail → BrightMessage\n\n자세한 내용은 웹사이트 하단의 \'개인정보 처리방침\' 페이지에서 확인하실 수 있습니다.\n\n변경된 개인정보 처리방침에 동의하지 않으시는 경우, 회원 탈퇴가 가능하며 기존 약관이 적용됩니다.\n\n문의사항이 있으시면 고객센터(02-123-4567)로 연락 주시기 바랍니다.\n\n감사합니다.', views: 289 },
  { id: 4, title: '시스템 정기 점검 안내 (2025년 6월 30일 02:00 ~ 04:00)', date: '2025-06-24', category: '점검', content: '안녕하세요, TripStore입니다.\n\n보다 안정적인 서비스 제공을 위한 시스템 정기 점검을 아래와 같이 진행할 예정입니다.\n\n## 점검 일정\n- 일시: 2025년 6월 30일 (월) 02:00 ~ 04:00 (한국시간 기준)\n- 소요시간: 약 2시간 (상황에 따라 조기 종료 또는 연장될 수 있음)\n\n## 점검 영향\n- 점검 시간 동안 웹사이트 및 모바일 앱 서비스 이용 불가\n- 진행 중인 예약 건은 자동 저장되나, 완료되지 않은 결제는 취소될 수 있음\n\n## 점검 내용\n- 서버 안정화 및 성능 최적화\n- 보안 시스템 업데이트\n- 데이터베이스 유지보수\n\n점검 시간 동안 서비스 이용에 불편을 드려 죄송합니다.\n긴급 문의는 이메일(support@tripstore.kr)로 접수해 주시기 바랍니다.\n\n감사합니다.', views: 198 },
  { id: 5, title: '신규 여행 상품 출시: 동유럽 4개국 9일', date: '2025-06-22', category: '상품', content: '안녕하세요, TripStore입니다.\n\n이번에 새롭게 출시된 동유럽 4개국 9일 패키지 상품을 소개해 드립니다.\n\n## 상품 개요\n- 상품명: 동유럽 로맨틱 투어 (체코, 오스트리아, 헝가리, 슬로바키아)\n- 일정: 9일 7박 (기내 1박 포함)\n- 가격: 2,790,000원부터 (항공, 호텔, 식사, 가이드, 입장료 포함)\n- 출발일: 매주 화, 토요일\n\n## 주요 관광지\n\n### 체코 프라하 (2박)\n- 프라하성, 까를교, 구시가지 광장, 천문시계\n- 체스키 크롬로프 당일 투어 (UNESCO 세계문화유산)\n\n### 오스트리아 비엔나 (2박)\n- 쇤브룬 궁전, 호프부르크, 슈테판 대성당\n- 벨베데레 궁전 및 미술관\n\n### 헝가리 부다페스트 (2박)\n- 어부의 요새, 마차시 성당, 국회의사당\n- 다뉴브강 야경 크루즈 포함\n\n### 슬로바키아 브라티슬라바 (1박)\n- 브라티슬라바 성, 구시가지, 미하엘 문\n- 전통 민속 공연 및 디너쇼\n\n## 특별 혜택\n- 7월 출발 상품 10% 얼리버드 할인\n- 4인 이상 그룹 예약 시 1인 10만원 추가 할인\n- 여행 사진 전문 촬영 서비스 무료 제공 (1회)\n\n자세한 내용은 상품 페이지에서 확인하시거나 고객센터로 문의해 주세요.\n\n감사합니다.', views: 312 },
  { id: 6, title: '카드사 프로모션 안내 (2025년 7월)', date: '2025-06-20', category: '이벤트', content: '안녕하세요, TripStore입니다.\n\n2025년 7월 카드사 프로모션 혜택을 안내해 드립니다.\n\n## 신한카드\n- 3/6/9개월 무이자 할부\n- 30만원 이상 결제 시 3만 포인트 즉시 할인\n- 적용 기간: 7월 1일 ~ 31일\n\n## 삼성카드\n- 2/3/4/5/6개월 무이자 할부\n- 50만원 이상 결제 시 최대 7% 청구 할인 (최대 5만원)\n- 적용 기간: 7월 1일 ~ 15일\n\n## 현대카드\n- 3/6/9/12개월 무이자 할부\n- M포인트 최대 5배 적립\n- 여행 관련 보험 무료 업그레이드\n- 적용 기간: 7월 전체\n\n## KB국민카드\n- 2/3/4/5/6개월 무이자 할부\n- 해외 직접 구매 시 브랜드 수수료 면제\n- 적용 기간: 7월 10일 ~ 31일\n\n## 적용 방법\n- 결제 시 해당 카드 선택 후 프로모션 적용 선택\n- 일부 특가 상품은 프로모션 적용이 제한될 수 있음\n\n혜택에 관한 자세한 내용은 각 카드사 홈페이지 또는 TripStore 고객센터로 문의해 주세요.\n\n감사합니다.', views: 276 },
  { id: 7, title: '비수기 특가 패키지 출시 안내', date: '2025-06-18', category: '상품', content: '안녕하세요, TripStore입니다.\n\n비수기를 활용한 특별 할인 패키지 상품을 안내해 드립니다.\n\n## 비수기 특가 패키지 안내\n\n### 1. 푸켓 5일 특가\n- 기간: 2025년 9월 15일 ~ 10월 31일 출발\n- 가격: 599,000원~ (항공, 호텔, 조식 포함)\n- 특전: 스파 마사지 1회 무료 제공\n\n### 2. 오키나와 4일\n- 기간: 2025년 10월 1일 ~ 11월 15일 출발\n- 가격: 499,000원~ (항공, 호텔, 렌터카 포함)\n- 특전: 수족관 입장권 무료 제공\n\n### 3. 발리 6일\n- 기간: 2025년 11월 1일 ~ 12월 15일 출발\n- 가격: 899,000원~ (항공, 풀빌라, 조식 포함)\n- 특전: 우붓 투어 + 발리니스 마사지 무료 제공\n\n### 4. 이탈리아 일주 8일\n- 기간: 2025년 10월 15일 ~ 11월 30일 출발\n- 가격: 1,790,000원~ (항공, 호텔, 식사, 가이드 포함)\n- 특전: 베네치아 곤돌라 탑승권 제공\n\n## 비수기 여행의 장점\n- 항공권 및 숙소 최대 40%까지 저렴한 가격\n- 혼잡하지 않은 관광지에서 여유로운 여행\n- 현지인과의 진정한 교류 기회\n- 사진 촬영에 최적화된 환경 (인파가 적음)\n\n지금 바로 TripStore 웹사이트나 앱에서 비수기 특가 상품을 확인해 보세요!\n\n감사합니다.', views: 234 },
  { id: 8, title: '여행자 보험 가입 안내', date: '2025-06-15', category: '안내', content: '안녕하세요, TripStore입니다.\n\n안전한 여행을 위한 여행자 보험 안내드립니다.\n\n## 여행자 보험 중요성\n해외여행 중 발생할 수 있는 질병, 상해, 분실, 취소 등의 위험에 대비하기 위해 여행자 보험 가입은 필수입니다. 특히 의료비가 비싼 국가 여행 시 더욱 중요합니다.\n\n## TripStore 제공 보험 상품\n\n### 1. 기본형 (패키지 여행 포함)\n- 해외의료비: 최대 2,000만원\n- 해외상해: 최대 3,000만원\n- 휴대품 손해: 최대 100만원\n- 여행취소: 최대 100만원\n\n### 2. 표준형 (추가 10,000원)\n- 해외의료비: 최대 5,000만원\n- 해외상해: 최대 5,000만원\n- 휴대품 손해: 최대 200만원\n- 여행취소: 최대 200만원\n- 항공지연: 최대 30만원\n\n### 3. 프리미엄형 (추가 20,000원)\n- 해외의료비: 최대 1억원\n- 해외상해: 최대 1억원\n- 휴대품 손해: 최대 300만원\n- 여행취소: 최대 300만원\n- 항공지연: 최대 50만원\n- 특별비용(구조비용 등): 최대 1,000만원\n\n## 보험 가입 방법\n1. 패키지 예약 시 보험 옵션 선택\n2. 마이페이지 > 예약 상세 > 보험 추가 신청\n3. 고객센터 전화 신청 (02-123-4567)\n\n## 보험금 청구 방법\n1. 사고 발생 시 현지에서 진료 확인서, 영수증 등 증빙 확보\n2. 귀국 후 7일 이내 보험사에 청구\n3. TripStore 고객센터에서 청구 과정 지원\n\n안전한 여행을 위해 적절한 보험 상품 가입을 권장드립니다.\n\n감사합니다.', views: 156 },
];

// 추천 공지사항 (현재 보고 있는 공지를 제외한 최근 3개)
const getRelatedNotices = (currentId: number) => {
  return notices
    .filter(notice => notice.id !== currentId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
};

interface NoticeDetailProps {
  id: string;
}

export default function NoticeDetail({ id }: NoticeDetailProps) {
  const router = useRouter();
  const [notice, setNotice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedNotices, setRelatedNotices] = useState<any[]>([]);

  useEffect(() => {
    // URL 파라미터에서 ID 가져오기
    const noticeId = parseInt(id);
    
    // ID로 공지사항 찾기
    const foundNotice = notices.find(n => n.id === noticeId);
    
    if (foundNotice) {
      setNotice(foundNotice);
      setRelatedNotices(getRelatedNotices(noticeId));
    } else {
      // 존재하지 않는 ID인 경우 목록 페이지로 리다이렉트
      router.push('/notice');
    }
    
    setLoading(false);
  }, [id, router]);

  // 공지사항 콘텐츠 줄바꿈 처리
  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('##')) {
        return <h2 key={index} className="text-xl font-bold my-4 text-gray-800">{line.replace('##', '').trim()}</h2>;
      } else if (line.startsWith('###')) {
        return <h3 key={index} className="text-lg font-bold my-3 text-gray-700">{line.replace('###', '').trim()}</h3>;
      } else if (line.startsWith('-')) {
        return <li key={index} className="ml-6 list-disc my-1 text-gray-600">{line.replace('-', '').trim()}</li>;
      } else if (line.trim() === '') {
        return <br key={index} />;
      } else {
        return <p key={index} className="my-2 text-gray-600">{line}</p>;
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!notice) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">공지사항을 찾을 수 없습니다</h1>
        <Link href="/notice" className="text-blue-500 hover:underline">
          공지사항 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 뒤로가기 및 공지 카테고리 */}
      <div className="flex items-center mb-6">
        <Link href="/notice" className="flex items-center text-gray-600 hover:text-blue-500 mr-4">
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>목록으로</span>
        </Link>
        <span className="text-sm py-1 px-3 bg-blue-50 text-blue-600 rounded-full">
          {notice.category}
        </span>
      </div>
      
      {/* 공지사항 제목 */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{notice.title}</h1>
      
      {/* 메타 정보 */}
      <div className="flex items-center text-gray-500 text-sm mb-8 pb-4 border-b">
        <div className="flex items-center mr-6">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{notice.date}</span>
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          <span>조회 {notice.views}</span>
        </div>
        <div className="ml-auto flex items-center space-x-3">
          <button className="flex items-center hover:text-blue-500">
            <Share2 className="w-4 h-4 mr-1" />
            <span>공유</span>
          </button>
          <button className="flex items-center hover:text-blue-500">
            <Printer className="w-4 h-4 mr-1" />
            <span>인쇄</span>
          </button>
        </div>
      </div>
      
      {/* 공지사항 내용 */}
      <div className="prose max-w-none mb-12">
        {formatContent(notice.content)}
      </div>
      
      {/* 관련 공지사항 */}
      <div className="mt-16">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Bell className="w-5 h-5 mr-2 text-blue-500" />
          <span>다른 공지사항</span>
        </h2>
        <div className="space-y-4">
          {relatedNotices.map((relatedNotice) => (
            <Link 
              href={`/notice/${relatedNotice.id}`} 
              key={relatedNotice.id}
              className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">{relatedNotice.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{relatedNotice.date}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/notice" className="inline-flex items-center text-blue-500 hover:underline">
            <FileText className="w-4 h-4 mr-1" />
            <span>모든 공지사항 보기</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

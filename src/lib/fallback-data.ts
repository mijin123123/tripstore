// 배포 환경에서 데이터베이스 연결 실패시 사용할 폴백 데이터
// 가장 기본적인 패키지 데이터만 포함하여 사이트가 항상 작동하도록 함

export const fallbackPackages = [
  {
    id: "fallback-pkg-001",
    destination: "일본 도쿄",
    type: "해외여행",
    title: "도쿄 핵심 관광지 4박 5일",
    description: "도쿄의 인기 관광지를 모두 둘러보는 알찬 일정",
    price: 789000,
    duration: "5일",
    image: "https://images.unsplash.com/photo-1554797589-7241bb691973?q=80&w=1636&auto=format&fit=crop",
    rating: 4.5,
    reviews: 128,
    name: "도쿄 핵심 관광지 4박 5일"
  },
  {
    id: "fallback-pkg-002",
    destination: "프랑스 파리",
    type: "해외여행",
    title: "파리 로맨틱 여행 6박 7일",
    description: "에펠탑부터 루브르 박물관까지, 파리의 모든 것",
    price: 1890000,
    duration: "7일",
    image: "https://images.unsplash.com/photo-1478391679764-b2d8b3cd1e94?q=80&w=1740&auto=format&fit=crop",
    rating: 4.8,
    reviews: 256,
    name: "파리 로맨틱 여행 6박 7일"
  },
  {
    id: "fallback-pkg-003",
    destination: "대한민국 제주도",
    type: "국내여행",
    title: "제주도 힐링 3박 4일",
    description: "아름다운 해변과 오름을 즐기는 제주 여행",
    price: 590000,
    duration: "4일",
    image: "https://images.unsplash.com/photo-1590174593210-1d9c3511fba5?q=80&w=1588&auto=format&fit=crop",
    rating: 4.7,
    reviews: 184,
    name: "제주도 힐링 3박 4일"
  },
  {
    id: "fallback-pkg-004",
    destination: "이탈리아 로마",
    type: "해외여행",
    title: "로마 역사 탐방 5박 6일",
    description: "콜로세움, 바티칸 등 역사적 명소를 방문하는 여행",
    price: 1590000,
    duration: "6일",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1696&auto=format&fit=crop",
    rating: 4.6,
    reviews: 210,
    name: "로마 역사 탐방 5박 6일"
  },
  {
    id: "fallback-pkg-005",
    destination: "미국 뉴욕",
    type: "해외여행",
    title: "뉴욕 시티 투어 7박 8일",
    description: "자유의 여신상, 타임스퀘어, 센트럴파크를 모두 경험하세요",
    price: 2490000,
    duration: "8일",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1740&auto=format&fit=crop",
    rating: 4.4,
    reviews: 312,
    name: "뉴욕 시티 투어 7박 8일"
  },
  {
    id: "fallback-pkg-006",
    destination: "대한민국 부산",
    type: "국내여행",
    title: "부산 바다 여행 2박 3일",
    description: "해운대, 광안리 등 부산의 아름다운 해변을 즐기세요",
    price: 350000,
    duration: "3일",
    image: "https://images.unsplash.com/photo-1617289430640-20391f4399d6?q=80&w=1587&auto=format&fit=crop",
    rating: 4.5,
    reviews: 98,
    name: "부산 바다 여행 2박 3일"
  }
];

export default fallbackPackages;

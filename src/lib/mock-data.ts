// Mock 데이터베이스 - 실제 데이터베이스 연결이 안 될 때 임시로 사용 (해외여행 패키지)
export const mockPackages = [
  {
    id: 1,
    title: "파리 낭만 여행 5박 7일",
    description: "에펠탑과 루브르 박물관, 샹젤리제 거리를 둘러보며 파리의 낭만을 만끽하는 프리미엄 여행 패키지입니다.",
    destination: "프랑스 파리",
    price: 2890000,
    duration: 7,
    category: "문화/예술",
    image_url: "https://images.unsplash.com/photo-1499856871958-5b9357976b82?q=80&w=1740",
    created_at: "2025-07-09T13:35:41.893128+00:00",
    updated_at: "2025-07-09T13:35:41.893128+00:00"
  },
  {
    id: 2,
    title: "도쿄 현대문화 체험 4박 5일",
    description: "시부야, 하라주쿠, 아키하바라를 중심으로 일본의 현대 문화와 전통이 어우러진 도쿄를 탐험합니다.",
    destination: "일본 도쿄",
    price: 1590000,
    duration: 5,
    category: "문화체험",
    image_url: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=1636",
    created_at: "2025-07-09T13:35:41.893128+00:00",
    updated_at: "2025-07-09T13:35:41.893128+00:00"
  },
  {
    id: 3,
    title: "뉴욕 자유의 여신상과 브로드웨이 6박 8일",
    description: "타임스퀘어, 센트럴파크, 브루클린 브릿지 등 뉴욕의 상징적인 명소들을 둘러보는 완벽한 미국 여행.",
    destination: "미국 뉴욕",
    price: 3890000,
    duration: 8,
    category: "도시탐방",
    image_url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1740",
    created_at: "2025-07-09T13:35:41.893128+00:00",
    updated_at: "2025-07-09T13:35:41.893128+00:00"
  },
  {
    id: 4,
    title: "바르셀로나 가우디 건축 투어 4박 6일",
    description: "사그라다 파밀리아, 구엘 공원, 카사 밀라 등 가우디의 걸작들을 감상하며 바르셀로나의 예술혼을 느끼세요.",
    destination: "스페인 바르셀로나",
    price: 2190000,
    duration: 6,
    category: "건축/예술",
    image_url: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=1740",
    created_at: "2025-07-09T13:35:41.893128+00:00",
    updated_at: "2025-07-09T13:35:41.893128+00:00"
  },
  {
    id: 5,
    title: "로마 역사기행 3박 5일",
    description: "콜로세움, 바티칸 시국, 트레비 분수 등 2000년 역사가 살아 숨쉬는 영원한 도시 로마를 탐험합니다.",
    destination: "이탈리아 로마",
    price: 2390000,
    duration: 5,
    category: "역사문화",
    image_url: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1636",
    created_at: "2025-07-09T13:35:41.893128+00:00",
    updated_at: "2025-07-09T13:35:41.893128+00:00"
  },
  {
    id: 6,
    title: "런던 클래식 투어 4박 6일",
    description: "빅벤, 타워브릿지, 버킹엄 궁전 등 영국 왕실의 전통과 현대가 공존하는 런던의 매력을 경험하세요.",
    destination: "영국 런던",
    price: 2690000,
    duration: 6,
    category: "역사문화",
    image_url: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1740",
    created_at: "2025-07-09T13:35:41.893128+00:00",
    updated_at: "2025-07-09T13:35:41.893128+00:00"
  },
  {
    id: 7,
    title: "베를린 역사와 예술 4박 5일",
    description: "베를린 장벽, 브란덴부르크 문, 동서독 분단의 역사와 현대 예술이 어우러진 베를린을 탐방합니다.",
    destination: "독일 베를린",
    price: 1990000,
    duration: 5,
    category: "역사문화",
    image_url: "https://images.unsplash.com/photo-1587330979470-3016b6702ecf?q=80&w=1740",
    created_at: "2025-07-09T13:35:41.893128+00:00",
    updated_at: "2025-07-09T13:35:41.893128+00:00"
  },
  {
    id: 8,
    title: "발리 힐링 휴양 5박 7일",
    description: "우붓의 라이스 테라스와 전통 스파, 아름다운 해변에서 즐기는 완벽한 휴양과 힐링 여행.",
    destination: "인도네시아 발리",
    price: 1790000,
    duration: 7,
    category: "휴양/힐링",
    image_url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1820",
    created_at: "2025-07-09T13:35:41.893128+00:00",
    updated_at: "2025-07-09T13:35:41.893128+00:00"
  }
];

// Mock 예약 데이터
export const mockReservations = [
  {
    id: 1,
    packageId: 1,
    packageTitle: "파리 낭만 여행 5박 7일",
    userId: 101,
    userName: "김해외",
    userEmail: "overseas@example.com",
    travelDate: "2025-09-15",
    travelers: 2,
    totalPrice: 4980000,
    status: "confirmed",
    createdAt: "2025-07-01T00:00:00Z",
    updatedAt: "2025-07-01T00:00:00Z"
  },
  {
    id: 2,
    packageId: 3,
    packageTitle: "뉴욕 자유의 여신상과 브로드웨이 6박 8일",
    userId: 102,
    userName: "이미국",
    userEmail: "newyork@example.com",
    travelDate: "2025-10-20",
    travelers: 4,
    totalPrice: 13960000,
    status: "pending",
    createdAt: "2025-07-05T00:00:00Z",
    updatedAt: "2025-07-05T00:00:00Z"
  },
  {
    id: 3,
    packageId: 8,
    packageTitle: "발리 힐링 휴양 5박 7일",
    userId: 103,
    userName: "박발리",
    userEmail: "bali@example.com",
    travelDate: "2025-08-10",
    travelers: 2,
    totalPrice: 2980000,
    status: "confirmed",
    createdAt: "2025-06-25T00:00:00Z",
    updatedAt: "2025-06-25T00:00:00Z"
  }
];

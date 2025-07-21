// 패키지 타입 정의
export interface Package {
  id: string;
  type: 'overseas' | 'hotel' | 'domestic' | 'luxury';
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
  itinerary?: Array<{
    day: number;
    title: string;
    description: string;
    meals: {
      breakfast: boolean;
      lunch: boolean;
      dinner: boolean;
    };
    accommodation: string;
  }>;
  included?: string[];
  excluded?: string[];
  notes?: string[];
  location?: string;
  features?: string[];
}

// 모든 패키지 데이터를 저장하는 객체
export const allPackages: Record<string, Package> = {
  // 유럽 패키지
  'europe-1': {
    id: 'europe-1',
    type: 'overseas',
    region: 'europe',
    regionKo: '유럽',
    title: '로맨틱 파리 & 런던 7일',
    price: '2,890,000',
    duration: '7일 5박',
    rating: 4.9,
    image: '/images/europe-paris.jpg',
    highlights: ['에펠탑', '루브르 박물관', '빅벤', '버킹엄 궁전'],
    departure: '매주 화/금 출발',
    description: '프랑스 파리와 영국 런던의 아름다운 명소들을 방문하는 7일간의 로맨틱한 여행입니다. 에펠탑, 루브르 박물관 등 파리의 유명 관광지와 빅벤, 버킹엄 궁전 등 런던의 주요 명소를 경험할 수 있습니다.',
    itinerary: [
      {
        day: 1,
        title: '인천 출발 - 파리 도착',
        description: '인천공항에서 출발하여 파리 샤를드골 공항에 도착 후 호텔 체크인',
        meals: { breakfast: false, lunch: false, dinner: true },
        accommodation: '파리 시내 4성급 호텔'
      },
      {
        day: 2,
        title: '파리 시내 관광',
        description: '에펠탑, 개선문, 샹젤리제 거리, 루브르 박물관 방문',
        meals: { breakfast: true, lunch: true, dinner: true },
        accommodation: '파리 시내 4성급 호텔'
      },
      {
        day: 3,
        title: '베르사유 궁전 투어',
        description: '베르사유 궁전과 정원 방문, 몽마르트 언덕과 사크레쾨르 대성당',
        meals: { breakfast: true, lunch: true, dinner: true },
        accommodation: '파리 시내 4성급 호텔'
      },
      {
        day: 4,
        title: '파리 - 런던 (유로스타)',
        description: '유로스타 기차를 타고 런던으로 이동, 런던 도착 후 테임즈강 크루즈',
        meals: { breakfast: true, lunch: false, dinner: true },
        accommodation: '런던 시내 4성급 호텔'
      },
      {
        day: 5,
        title: '런던 시내 관광',
        description: '빅벤, 버킹엄 궁전, 타워 브릿지, 대영박물관 방문',
        meals: { breakfast: true, lunch: true, dinner: true },
        accommodation: '런던 시내 4성급 호텔'
      },
      {
        day: 6,
        title: '런던 자유 시간 & 귀국',
        description: '오전 자유 시간, 옥스포드 거리 쇼핑 후 런던 히드로 공항에서 출발',
        meals: { breakfast: true, lunch: false, dinner: false },
        accommodation: '기내'
      },
      {
        day: 7,
        title: '인천 도착',
        description: '인천공항 도착, 여행 종료',
        meals: { breakfast: false, lunch: false, dinner: false },
        accommodation: '-'
      }
    ],
    included: [
      '왕복 국제선 항공권 및 세금',
      '4성급 호텔 5박',
      '일정상 표기된 식사',
      '공항-호텔 간 전용 차량 이동',
      '파리-런던 유로스타 기차표',
      '현지 한국어 가이드',
      '여행자 보험'
    ],
    excluded: [
      '개인 여행 경비',
      '일정에 표기되지 않은 식사',
      '가이드 및 드라이버 팁',
      '각종 매너팁',
      '선택 관광 비용'
    ],
    notes: [
      '출발 최소 3일 전까지 예약 필요',
      '여권은 출발일 기준 6개월 이상 유효기간 필요',
      '항공 스케줄에 따라 일정 변경 가능',
      '현지 상황에 따라 관광지 순서 변경 가능'
    ]
  },
  'europe-2': {
    id: 'europe-2',
    type: 'overseas',
    region: 'europe',
    regionKo: '유럽',
    title: '이탈리아 로마 & 베니스 8일',
    price: '3,190,000',
    duration: '8일 6박',
    rating: 4.8,
    image: '/images/europe-italy.jpg',
    highlights: ['콜로세움', '바티칸', '베니스 곤돌라', '피사의 사탑'],
    departure: '매주 월/목 출발',
    description: '이탈리아의 문화와 예술의 중심지인 로마, 피렌체, 베니스를 탐방하는 8일 여행입니다. 세계적인 문화유산을 직접 체험하고 이탈리아의 전통 요리를 맛볼 수 있는 특별한 기회입니다.',
    itinerary: [
      {
        day: 1,
        title: '인천 출발 - 로마 도착',
        description: '인천공항에서 출발하여 로마 피우미치노 공항에 도착 후 호텔 체크인',
        meals: { breakfast: false, lunch: false, dinner: true },
        accommodation: '로마 시내 4성급 호텔'
      },
      {
        day: 2,
        title: '로마 시내 관광',
        description: '콜로세움, 로마 포럼, 트레비 분수, 스페인 계단 방문',
        meals: { breakfast: true, lunch: true, dinner: true },
        accommodation: '로마 시내 4성급 호텔'
      },
      {
        day: 3,
        title: '바티칸 시국 투어',
        description: '바티칸 박물관, 시스티나 성당, 성 베드로 대성당 방문',
        meals: { breakfast: true, lunch: true, dinner: true },
        accommodation: '로마 시내 4성급 호텔'
      },
      {
        day: 4,
        title: '로마 - 피렌체',
        description: '기차로 피렌체로 이동, 두오모, 우피치 미술관 방문',
        meals: { breakfast: true, lunch: false, dinner: true },
        accommodation: '피렌체 시내 4성급 호텔'
      },
      {
        day: 5,
        title: '피렌체 - 피사 - 베니스',
        description: '피사의 사탑 방문 후 베니스로 이동',
        meals: { breakfast: true, lunch: true, dinner: true },
        accommodation: '베니스 4성급 호텔'
      },
      {
        day: 6,
        title: '베니스 시내 관광',
        description: '산 마르코 광장, 두칼레 궁전, 곤돌라 탑승 체험',
        meals: { breakfast: true, lunch: true, dinner: true },
        accommodation: '베니스 4성급 호텔'
      },
      {
        day: 7,
        title: '베니스 - 밀라노 & 귀국',
        description: '베니스에서 밀라노로 이동, 두오모 성당 방문 후 밀라노 공항에서 출발',
        meals: { breakfast: true, lunch: false, dinner: false },
        accommodation: '기내'
      },
      {
        day: 8,
        title: '인천 도착',
        description: '인천공항 도착, 여행 종료',
        meals: { breakfast: false, lunch: false, dinner: false },
        accommodation: '-'
      }
    ],
    included: [
      '왕복 국제선 항공권 및 세금',
      '4성급 호텔 6박',
      '일정상 표기된 식사',
      '공항-호텔 간 전용 차량 이동',
      '도시 간 기차 또는 전용차량 이동',
      '현지 한국어 가이드',
      '여행자 보험'
    ],
    excluded: [
      '개인 여행 경비',
      '일정에 표기되지 않은 식사',
      '가이드 및 드라이버 팁',
      '각종 매너팁',
      '선택 관광 비용'
    ],
    notes: [
      '출발 최소 3일 전까지 예약 필요',
      '여권은 출발일 기준 6개월 이상 유효기간 필요',
      '항공 스케줄에 따라 일정 변경 가능',
      '현지 상황에 따라 관광지 순서 변경 가능'
    ]
  },
  'europe-3': {
    id: 'europe-3',
    type: 'overseas',
    region: 'europe',
    regionKo: '유럽',
    title: '스위스 알프스 & 독일 8일',
    price: '3,490,000',
    duration: '8일 6박',
    rating: 4.7,
    image: '/images/europe-swiss.jpg',
    highlights: ['융프라우', '라인강', '노이슈반슈타인성', '체르마트'],
    departure: '매주 수/토 출발',
    description: '알프스의 장엄한 풍경과 독일의 중세 도시들을 탐방하는 8일 여행입니다. 융프라우, 체르마트의 산악 경관부터 독일의 노이슈반슈타인 성과 흑림 지역까지 매혹적인 중부 유럽의 풍경을 경험하세요.',
    itinerary: [
      {
        day: 1,
        title: '인천 출발 - 취리히 도착',
        description: '인천공항에서 출발하여 취리히 국제공항에 도착 후 호텔 체크인',
        meals: { breakfast: false, lunch: false, dinner: true },
        accommodation: '취리히 4성급 호텔'
      },
      {
        day: 2,
        title: '취리히 - 루체른 - 인터라켄',
        description: '루체른 시내 관광, 카펠 다리, 시계탑 방문 후 인터라켄으로 이동',
        meals: { breakfast: true, lunch: true, dinner: true },
        accommodation: '인터라켄 4성급 호텔'
      },
      {
        day: 3,
        title: '융프라우 등정',
        description: '융프라우요흐(Top of Europe) 방문, 아이거 북벽 전망대',
        meals: { breakfast: true, lunch: true, dinner: true },
        accommodation: '인터라켄 4성급 호텔'
      },
      {
        day: 4,
        title: '인터라켄 - 체르마트',
        description: '기차로 체르마트로 이동, 마터호른 전망대 방문',
        meals: { breakfast: true, lunch: false, dinner: true },
        accommodation: '체르마트 4성급 호텔'
      },
      {
        day: 5,
        title: '체르마트 - 뮌헨',
        description: '기차로 뮌헨으로 이동, 마리엔 광장, 호프브로이하우스 방문',
        meals: { breakfast: true, lunch: true, dinner: true },
        accommodation: '뮌헨 4성급 호텔'
      },
      {
        day: 6,
        title: '노이슈반슈타인성 투어',
        description: '노이슈반슈타인성 방문, 퓌센 마을 탐방',
        meals: { breakfast: true, lunch: true, dinner: true },
        accommodation: '뮌헨 4성급 호텔'
      },
      {
        day: 7,
        title: '뮌헨 시내 관광 & 귀국',
        description: '뉴 타운홀, BMW 박물관 방문 후 뮌헨 공항에서 출발',
        meals: { breakfast: true, lunch: false, dinner: false },
        accommodation: '기내'
      },
      {
        day: 8,
        title: '인천 도착',
        description: '인천공항 도착, 여행 종료',
        meals: { breakfast: false, lunch: false, dinner: false },
        accommodation: '-'
      }
    ],
    included: [
      '왕복 국제선 항공권 및 세금',
      '4성급 호텔 6박',
      '일정상 표기된 식사',
      '공항-호텔 간 전용 차량 이동',
      '도시 간 기차 또는 전용차량 이동',
      '현지 한국어 가이드',
      '여행자 보험'
    ],
    excluded: [
      '개인 여행 경비',
      '일정에 표기되지 않은 식사',
      '가이드 및 드라이버 팁',
      '노이슈반슈타인 성 내부 입장료',
      '선택 관광 비용'
    ],
    notes: [
      '출발 최소 3일 전까지 예약 필요',
      '여권은 출발일 기준 6개월 이상 유효기간 필요',
      '항공 스케줄에 따라 일정 변경 가능',
      '현지 상황에 따라 관광지 순서 변경 가능'
    ]
  },
  // 여기에 다른 패키지 데이터가 추가됩니다.
};

// 지역별 패키지 가져오기
export function getPackagesByRegion(type: string, region: string): Package[] {
  return Object.values(allPackages).filter(
    (pkg) => pkg.type === type && pkg.region === region
  );
}

// 특정 패키지 가져오기
export function getPackageById(id: string): Package | undefined {
  // 일반 지역 패키지
  if (allPackages[id]) {
    return allPackages[id];
  }
  
  // 메인 페이지 패키지 - 하드코딩된 값들은 FeaturedPackages 컴포넌트와 일치해야 함
  const mainPagePackages: Record<string, Package> = {
    // 호텔 패키지
    'hotel-1': {
      id: 'hotel-1',
      type: 'hotel',
      region: 'europe',
      regionKo: '유럽',
      title: '파리 럭셔리 호텔',
      price: '450,000',
      duration: '1일 1박',
      rating: 5,
      image: '/images/hotel-paris.jpg',
      highlights: ['에펠탑 뷰', '럭셔리 스파', '미슐랭 레스토랑'],
      departure: '매일 출발',
      description: '에펠탑 뷰와 럭셔리 스파, 미슐랭 레스토랑을 갖춘 파리의 최고급 호텔에서의 특별한 숙박 경험'
    },
    'hotel-2': {
      id: 'hotel-2',
      type: 'hotel',
      region: 'europe',
      regionKo: '유럽',
      title: '런던 부티크 호텔',
      price: '380,000',
      duration: '1일 1박',
      rating: 5,
      image: '/images/hotel-london.jpg',
      highlights: ['템즈강 뷰', '역사적 건물', '애프터눈 티'],
      departure: '매일 출발',
      description: '템즈강 뷰와 역사적인 건물, 전통적인 애프터눈 티를 제공하는 런던의 고급 부티크 호텔'
    },
    'hotel-3': {
      id: 'hotel-3',
      type: 'hotel',
      region: 'europe',
      regionKo: '유럽',
      title: '로마 클래식 호텔',
      price: '320,000',
      duration: '1일 1박',
      rating: 4,
      image: '/images/hotel-rome.jpg',
      highlights: ['콜로세움 근처', '루프탑 바', '이탈리아 요리'],
      departure: '매일 출발',
      description: '콜로세움 근처에 위치한 루프탑 바와 정통 이탈리아 요리를 즐길 수 있는 로마의 클래식 호텔'
    },
    // 럭셔리 패키지
    'luxury-1': {
      id: 'luxury-1',
      type: 'luxury',
      region: 'europe',
      regionKo: '유럽',
      title: '파리 럭셔리 3박4일',
      price: '2,800,000',
      duration: '3박 4일',
      rating: 5,
      image: '/images/luxury-paris.jpg',
      highlights: ['5성급 호텔', '미슐랭 3스타', '개인 가이드', '전용 차량'],
      departure: '매일 출발',
      description: '5성급 호텔과 미슐랭 3스타 레스토랑, 개인 가이드가 함께하는 파리의 최고급 럭셔리 여행'
    },
    'luxury-2': {
      id: 'luxury-2',
      type: 'luxury',
      region: 'europe',
      regionKo: '유럽',
      title: '스위스 알프스 럭셔리 투어',
      price: '3,200,000',
      duration: '4박 5일',
      rating: 5,
      image: '/images/luxury-swiss.jpg',
      highlights: ['산악 리조트', '개인 셰프', '헬기 투어', '스파 트리트먼트'],
      departure: '매일 출발',
      description: '스위스 알프스의 산악 리조트에서 개인 셰프와 헬기 투어가 포함된 프리미엄 럭셔리 경험'
    },
    'luxury-3': {
      id: 'luxury-3',
      type: 'luxury',
      region: 'europe',
      regionKo: '유럽',
      title: '이탈리아 토스카나 와이너리',
      price: '2,500,000',
      duration: '3박 4일',
      rating: 5,
      image: '/images/luxury-tuscany.jpg',
      highlights: ['와이너리 투어', '요리 클래스', '고급 숙소', '개인 소믈리에'],
      departure: '매일 출발',
      description: '토스카나의 유명 와이너리에서 요리 클래스와 개인 소믈리에가 함께하는 고급 와인 투어'
    },
    // 럭셔리 크루즈 패키지
    'luxury-cruise-1': {
      id: 'luxury-cruise-1',
      type: 'luxury',
      region: 'cruise',
      regionKo: '크루즈',
      title: '지중해 럭셔리 크루즈',
      price: '4,200,000',
      duration: '7박 8일',
      rating: 5,
      image: '/images/cruise-mediterranean.jpg',
      highlights: ['스위트룸', '미슐랭 레스토랑', '개인 발코니', '전용 데크'],
      departure: '매일 출발',
      description: '지중해의 아름다운 섬들을 스위트룸과 미슐랭 레스토랑이 포함된 럭셔리 크루즈로 탐험'
    },
    'luxury-cruise-2': {
      id: 'luxury-cruise-2',
      type: 'luxury',
      region: 'cruise',
      regionKo: '크루즈',
      title: '카리브해 프리미엄 크루즈',
      price: '3,800,000',
      duration: '6박 7일',
      rating: 5,
      image: '/images/cruise-caribbean.jpg',
      highlights: ['오션뷰 스위트', '프라이빗 풀', '버틀러 서비스', '요트 투어'],
      departure: '매일 출발',
      description: '카리브해의 에메랄드 빛 바다를 오션뷰 스위트와 프라이빗 풀이 포함된 프리미엄 크루즈로 경험'
    },
    'luxury-cruise-3': {
      id: 'luxury-cruise-3',
      type: 'luxury',
      region: 'cruise',
      regionKo: '크루즈',
      title: '노르웨이 피오르드 크루즈',
      price: '5,500,000',
      duration: '8박 9일',
      rating: 5,
      image: '/images/cruise-norway.jpg',
      highlights: ['파노라마 스위트', '스파', '자연 관찰', '프라이빗 가이드'],
      departure: '매일 출발',
      description: '노르웨이 피오르드의 장엄한 자연을 파노라마 스위트와 전용 스파에서 감상하는 럭셔리 크루즈'
    },
    // 럭셔리 일본 패키지
    'luxury-japan-1': {
      id: 'luxury-japan-1',
      type: 'luxury',
      region: 'japan',
      regionKo: '일본',
      title: '교토 프리미엄 료칸 체험',
      price: '1,800,000',
      duration: '3박 4일',
      rating: 5,
      image: '/images/luxury-kyoto.jpg',
      highlights: ['전통 료칸', '개인 온천', '가이세키 요리', '차도 체험'],
      departure: '매일 출발',
      description: '교토의 전통 료칸에서 개인 온천과 정통 가이세키 요리를 즐기는 프리미엄 일본 문화 체험'
    },
    'luxury-japan-2': {
      id: 'luxury-japan-2',
      type: 'luxury',
      region: 'japan',
      regionKo: '일본',
      title: '도쿄 미슐랭 투어',
      price: '2,200,000',
      duration: '4박 5일',
      rating: 5,
      image: '/images/luxury-tokyo.jpg',
      highlights: ['미슐랭 3스타', '개인 셰프', '프리미엄 쇼핑', '전용 가이드'],
      departure: '매일 출발',
      description: '도쿄의 미슐랭 3스타 레스토랑과 개인 셰프가 함께하는 최고급 미식 투어'
    },
    'luxury-japan-3': {
      id: 'luxury-japan-3',
      type: 'luxury',
      region: 'japan',
      regionKo: '일본',
      title: '후지산 럭셔리 리트리트',
      price: '2,500,000',
      duration: '3박 4일',
      rating: 5,
      image: '/images/luxury-fuji.jpg',
      highlights: ['후지산 뷰', '프라이빗 온천', '헬기 투어', '스파 트리트먼트'],
      departure: '매일 출발',
      description: '후지산 전망의 프라이빗 온천과 헬기 투어가 포함된 하코네 럭셔리 리트리트'
    },
    // 럭셔리 동남아 패키지
    'luxury-sea-1': {
      id: 'luxury-sea-1',
      type: 'luxury',
      region: 'southeast-asia',
      regionKo: '동남아시아',
      title: '발리 프라이빗 빌라 리트리트',
      price: '2,200,000',
      duration: '4박 5일',
      rating: 5,
      image: '/images/luxury-bali.jpg',
      highlights: ['프라이빗 빌라', '개인 셰프', '스파 서비스', '요가 클래스'],
      departure: '매일 출발',
      description: '발리의 프라이빗 빌라에서 개인 셰프와 스파 서비스를 포함한 완벽한 휴식'
    },
    'luxury-sea-2': {
      id: 'luxury-sea-2',
      type: 'luxury',
      region: 'southeast-asia',
      regionKo: '동남아시아',
      title: '몰디브 리조트 프리미엄',
      price: '3,800,000',
      duration: '5박 6일',
      rating: 5,
      image: '/images/luxury-maldives.jpg',
      highlights: ['수상 빌라', '버틀러 서비스', '프라이빗 다이닝', '스노클링'],
      departure: '매일 출발',
      description: '몰디브의 수상 빌라에서 버틀러 서비스와 프라이빗 다이닝을 즐기는 최고급 휴양'
    },
    'luxury-sea-3': {
      id: 'luxury-sea-3',
      type: 'luxury',
      region: 'southeast-asia',
      regionKo: '동남아시아',
      title: '태국 코사무이 럭셔리',
      price: '1,800,000',
      duration: '4박 5일',
      rating: 5,
      image: '/images/luxury-samui.jpg',
      highlights: ['비치프론트', '요트 투어', '스파 패키지', '쿠킹 클래스'],
      departure: '매일 출발',
      description: '코사무이의 비치프론트 리조트에서 요트 투어와 스파 패키지를 포함한 럭셔리 휴양'
    },
    // 럭셔리 스페셜 테마 패키지
    'luxury-theme-1': {
      id: 'luxury-theme-1',
      type: 'luxury',
      region: 'special-theme',
      regionKo: '스페셜 테마',
      title: '오로라 프리미엄 투어',
      price: '3,800,000',
      duration: '5박 6일',
      rating: 5,
      image: '/images/luxury-aurora.jpg',
      highlights: ['프라이빗 가이드', '럭셔리 롯지', '오로라 전용 투어', '개썰매 체험'],
      departure: '10월-3월 출발',
      description: '아이슬란드와 노르웨이에서 프라이빗 가이드와 함께하는 오로라 관측과 럭셔리 롯지 체험'
    },
    'luxury-theme-2': {
      id: 'luxury-theme-2',
      type: 'luxury',
      region: 'special-theme',
      regionKo: '스페셜 테마',
      title: '사파리 럭셔리 캠프',
      price: '4,500,000',
      duration: '6박 7일',
      rating: 5,
      image: '/images/luxury-safari.jpg',
      highlights: ['텐트 럭셔리', '와일드라이프', '전문 가이드', '핫에어 벌룬'],
      departure: '6월-10월 출발',
      description: '케냐와 탄자니아의 럭셔리 텐트 캠프에서 야생동물과 전문 가이드가 함께하는 사파리 모험'
    },
    'luxury-theme-3': {
      id: 'luxury-theme-3',
      type: 'luxury',
      region: 'special-theme',
      regionKo: '스페셜 테마',
      title: '남극 탐험 크루즈',
      price: '8,800,000',
      duration: '10박 11일',
      rating: 5,
      image: '/images/luxury-antarctica.jpg',
      highlights: ['탐험선', '빙하 투어', '야생동물 관찰', '전문 가이드'],
      departure: '11월-3월 출발',
      description: '남극의 장엄한 자연을 탐험선으로 경험하며 빙하와 야생동물을 관찰하는 일생일대의 모험'
    },
    '1': {
      id: '1',
      type: 'overseas',
      region: 'europe',
      regionKo: '유럽',
      title: '파리 로맨틱 5일',
      price: '2,380,000',
      duration: '5일 4박',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80',
      highlights: ['에펠탑', '루브르 박물관', '베르사유 궁전', '몽마르트'],
      departure: '매주 화/목/일 출발',
      description: '에펠탑, 루브르 박물관, 베르사유 궁전을 둘러보는 낭만적인 파리 여행'
    },
    '2': {
      id: '2',
      type: 'overseas',
      region: 'japan',
      regionKo: '일본',
      title: '일본 도쿄 벚꽃 여행',
      price: '1,620,000',
      duration: '4일 3박',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      highlights: ['도쿄 명소', '벚꽃 명소', '온천', '전통 문화'],
      departure: '매주 월/수/금 출발',
      description: '아름다운 벚꽃과 함께하는 도쿄 명소 투어, 온천과 전통 문화 체험'
    },
    '3': {
      id: '3',
      type: 'overseas',
      region: 'americas',
      regionKo: '미주',
      title: '미국 뉴욕 자유여행',
      price: '3,150,000',
      duration: '6일 5박',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      highlights: ['자유의 여신상', '타임스퀘어', '센트럴파크', '브로드웨이'],
      departure: '매주 화/토 출발',
      description: '자유의 여신상, 타임스퀘어, 센트럴파크 등 뉴욕의 랜드마크 탐방'
    },
    '4': {
      id: '4',
      type: 'overseas',
      region: 'europe',
      regionKo: '유럽',
      title: '이탈리아 문화기행',
      price: '3,780,000',
      duration: '8일 7박',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      highlights: ['로마', '피렌체', '베네치아', '바티칸 시국'],
      departure: '매주 월/금 출발',
      description: '로마, 피렌체, 베네치아의 역사와 예술을 만나는 문화 여행'
    },
    '5': {
      id: '5',
      type: 'overseas',
      region: 'europe',
      regionKo: '유럽',
      title: '영국 클래식 투어',
      price: '3,420,000',
      duration: '7일 6박',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      highlights: ['런던', '스코틀랜드', '옥스퍼드', '에든버러'],
      departure: '매주 수/토 출발',
      description: '런던의 역사와 전통, 스코틀랜드의 신비로운 성들을 탐험'
    },
    '6': {
      id: '6',
      type: 'overseas',
      region: 'europe',
      regionKo: '유럽',
      title: '스페인 정열기행',
      price: '2,880,000',
      duration: '6일 5박',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      highlights: ['바르셀로나', '마드리드', '가우디 건축', '플라멘코'],
      departure: '매주 화/목 출발',
      description: '바르셀로나와 마드리드의 가우디 건축과 플라멘코 문화 체험'
    }
  };
  
  // 지역별 페이지 패키지 처리
  if (id.startsWith('southeast-asia-')) {
    // 동남아시아 패키지
    const regionPackages: Record<string, Package> = {
      'southeast-asia-thailand': {
        id: 'southeast-asia-thailand',
        type: 'overseas',
        region: 'southeast-asia',
        regionKo: '동남아시아',
        title: '태국 방콕 & 파타야 5일',
        price: '890,000',
        duration: '5일 3박',
        rating: 4.8,
        image: '/images/thailand.jpg',
        highlights: ['왕궁', '왓포', '파타야 비치', '수상시장'],
        departure: '매일 출발',
        description: '방콕의 화려한 왕궁과 사원, 파타야의 아름다운 해변을 탐험하는 5일 여행'
      },
      'southeast-asia-vietnam': {
        id: 'southeast-asia-vietnam',
        type: 'overseas',
        region: 'southeast-asia',
        regionKo: '동남아시아',
        title: '베트남 다낭 & 호이안 5일',
        price: '1,190,000',
        duration: '5일 3박',
        rating: 4.7,
        image: '/images/vietnam.jpg',
        highlights: ['바나힐', '미케 비치', '호이안 구시가지', '한시장'],
        departure: '매일 출발',
        description: '다낭의 아름다운 해변과 호이안의 전통적인 거리를 탐험하는 5일 여행'
      },
      'southeast-asia-singapore': {
        id: 'southeast-asia-singapore',
        type: 'overseas',
        region: 'southeast-asia',
        regionKo: '동남아시아',
        title: '싱가포르 & 말레이시아 6일',
        price: '1,490,000',
        duration: '6일 4박',
        rating: 4.9,
        image: '/images/singapore.jpg',
        highlights: ['마리나베이샌즈', '센토사', '쿠알라룸푸르', '페트로나스 타워'],
        departure: '매주 화/금/일 출발',
        description: '현대적인 싱가포르와 다채로운 문화가 있는 말레이시아 쿠알라룸푸르를 탐험하는 6일 여행'
      },
      'southeast-asia-philippines': {
        id: 'southeast-asia-philippines',
        type: 'overseas',
        region: 'southeast-asia',
        regionKo: '동남아시아',
        title: '필리핀 세부 리조트 5일',
        price: '1,290,000',
        duration: '5일 3박',
        rating: 4.6,
        image: '/images/cebu.jpg',
        highlights: ['막탄 리조트', '보홀섬', '알로나 비치', '스노클링'],
        departure: '매주 월/수/금/일 출발',
        description: '세부의 럭셔리 리조트에서 휴식을 취하고 인근 보홀섬과 알로나 비치를 방문하는 5일 여행'
      }
    };
    return regionPackages[id];
  }
  
  if (id.startsWith('europe-')) {
    // 유럽 추가 패키지
    const regionPackages: Record<string, Package> = {
      'europe-4': {
        id: 'europe-4',
        type: 'overseas',
        region: 'europe',
        regionKo: '유럽',
        title: '스페인 & 포르투갈 9일',
        price: '3,790,000',
        duration: '9일 7박',
        rating: 4.6,
        image: '/images/europe-spain.jpg',
        highlights: ['사그라다 파밀리아', '알함브라 궁전', '포르투', '리스본'],
        departure: '매주 화/일 출발',
        description: '열정의 나라 스페인과 아름다운 포르투갈의 매력을 느낄 수 있는 9일 여행입니다.'
      },
      'europe-5': {
        id: 'europe-5',
        type: 'overseas',
        region: 'europe',
        regionKo: '유럽',
        title: '그리스 아테네 & 산토리니 7일',
        price: '3,290,000',
        duration: '7일 5박',
        rating: 4.5,
        image: '/images/europe-greece.jpg',
        highlights: ['아크로폴리스', '산토리니 일몰', '아테네 플라카', '이아 마을'],
        departure: '매주 월/금 출발',
        description: '신화와 역사의 나라 그리스와 환상적인 에게해의 보석 산토리니를 방문하는 7일 여행입니다.'
      }
    };
    return regionPackages[id];
  }
  
  // 일본 패키지
  if (id.startsWith('japan-')) {
    const regionPackages: Record<string, Package> = {
      'japan-tokyo-osaka': {
        id: 'japan-tokyo-osaka',
        type: 'overseas',
        region: 'japan',
        regionKo: '일본',
        title: '도쿄 & 오사카 벚꽃 여행 5일',
        price: '1,890,000',
        duration: '5일 3박',
        rating: 4.9,
        image: '/images/japan-tokyo.jpg',
        highlights: ['시부야', '아사쿠사', '오사카성', '벚꽃 명소'],
        departure: '3-5월 매일 출발',
        description: '일본의 봄, 벚꽃 시즌에 도쿄와 오사카의 주요 명소를 방문하는 5일 여행'
      },
      'japan-kyushu': {
        id: 'japan-kyushu',
        type: 'overseas',
        region: 'japan',
        regionKo: '일본',
        title: '규슈 온천 힐링 여행 6일',
        price: '2,190,000',
        duration: '6일 4박',
        rating: 4.8,
        image: '/images/japan-kyushu.jpg',
        highlights: ['벳푸 온천', '유후인', '구마모토성', '아소산'],
        departure: '연중 출발',
        description: '일본 규슈 지역의 유명 온천과 아름다운 자연을 만끽하는 6일 힐링 여행'
      }
    };
    return regionPackages[id];
  }
  
  // 국내 리조트 패키지
  if (id.startsWith('domestic-resort-')) {
    const resortId = id.replace('domestic-resort-', '');
    const resortPackages: Record<string, Package> = {
      'domestic-resort-1': {
        id: 'domestic-resort-1',
        type: 'domestic',
        region: 'resort',
        regionKo: '리조트',
        title: '제주 신화월드 리조트',
        price: '250,000',
        duration: '1박',
        rating: 5,
        image: '/images/resort-jeju.jpg',
        highlights: ['워터파크', '테마파크', '골프장'],
        departure: '연중가능',
        description: '제주도의 럭셔리한 신화월드 리조트에서 워터파크와 테마파크를 즐기세요.'
      },
      'domestic-resort-2': {
        id: 'domestic-resort-2',
        type: 'domestic',
        region: 'resort',
        regionKo: '리조트',
        title: '강원도 알펜시아 리조트',
        price: '280,000',
        duration: '1박',
        rating: 5,
        image: '/images/resort-pyeongchang.jpg',
        highlights: ['스키장', '워터파크', '스파'],
        departure: '연중가능',
        description: '강원도 평창의 알펜시아 리조트에서 계절별 다양한 액티비티와 힐링을 경험하세요.'
      },
      'domestic-resort-3': {
        id: 'domestic-resort-3',
        type: 'domestic',
        region: 'resort',
        regionKo: '리조트',
        title: '경주 보문단지 리조트',
        price: '220,000',
        duration: '1박',
        rating: 4,
        image: '/images/resort-gyeongju.jpg',
        highlights: ['골프장', '온천', '불국사 인근'],
        departure: '연중가능',
        description: '역사의 도시 경주에서 호수 전망과 함께 편안한 휴식을 즐기세요.'
      },
      'domestic-resort-4': {
        id: 'domestic-resort-4',
        type: 'domestic',
        region: 'resort',
        regionKo: '리조트',
        title: '부산 해운대 프라이빗 리조트',
        price: '320,000',
        duration: '1박',
        rating: 5,
        image: '/images/resort-busan.jpg',
        highlights: ['오션뷰', '인피니티풀', '스파'],
        departure: '연중가능',
        description: '부산 해운대 해변을 바라보며 최고급 시설과 서비스를 경험할 수 있는 프라이빗 리조트입니다.'
      }
    };
    return resortPackages[id] || resortPackages[`domestic-resort-${resortId}`];
  }
  
  // 국내 풀빌라 패키지 처리
  if (id.startsWith('pool-villa-') || id.startsWith('domestic-villa-')) {
    const villaId = id.startsWith('pool-villa-') ? id.replace('pool-villa-', '') : id.replace('domestic-villa-', '');
    const villaPackages: Record<string, Package> = {
      'pool-villa-jeju': {
        id: 'pool-villa-jeju',
        type: 'domestic',
        region: 'pool-villa',
        regionKo: '풀빌라',
        title: '제주 프라이빗 풀빌라',
        price: '450,000',
        duration: '1박',
        rating: 4.9,
        image: '/images/villa-jeju.jpg',
        highlights: ['프라이빗 풀', '제주 오션뷰', '바베큐 시설'],
        departure: '연중가능',
        description: '제주의 아름다운 해변을 바라보며 프라이빗 풀에서 휴식을 즐길 수 있는 풀빌라입니다.'
      },
      'domestic-villa-1': {
        id: 'domestic-villa-1',
        type: 'domestic',
        region: 'pool-villa',
        regionKo: '풀빌라',
        title: '제주 사려니 프라이빗풀 빌라',
        price: '480,000',
        duration: '1박',
        rating: 5,
        image: '/images/villa-jeju.jpg',
        highlights: ['프라이빗 풀', '한라산 뷰', '바베큐'],
        departure: '연중가능',
        description: '제주 사려니 숲길 근처에 위치한 독채 풀빌라로, 한라산 전망을 감상할 수 있는 프라이빗 풀과 야외 바베큐 시설을 갖추고 있습니다. 주변 자연 환경과 조화를 이루는 모던한 디자인으로, 완벽한 휴식과 프라이버시를 제공합니다.',
        included: [
          '프라이빗 수영장 이용',
          '웰컴 드링크',
          '바베큐 그릴 및 기본 도구',
          '무료 와이파이',
          '주차장'
        ],
        excluded: [
          '식사',
          '바베큐 재료',
          '픽업 서비스',
          '추가 인원 요금',
          '관광 가이드'
        ],
        notes: [
          '체크인: 오후 3시, 체크아웃: 오전 11시',
          '최대 6인까지 이용 가능 (기준 인원 4인, 추가 인원 1인당 50,000원)',
          '반려동물 동반 불가',
          '바베큐 이용 시 사전 예약 필요',
          '소음으로 인한 민원이 발생하지 않도록 야간 소음 자제 부탁드립니다'
        ],
        features: ['한라산 전망', '독채 빌라', '프라이빗 수영장', '바베큐 시설', '고급 인테리어']
      },
      'domestic-villa-2': {
        id: 'domestic-villa-2',
        type: 'domestic',
        region: 'pool-villa',
        regionKo: '풀빌라',
        title: '강원도 평창 하늘정원 빌라',
        price: '420,000',
        duration: '1박',
        rating: 5,
        image: '/images/villa-pyeongchang.jpg',
        highlights: ['온수풀', '스키리조트 근처', '자쿠지'],
        departure: '연중가능',
        description: '강원도 평창의 높은 고도에 위치한 럭셔리 풀빌라로, 계절에 상관없이 즐길 수 있는 온수 수영장과 자쿠지를 갖추고 있습니다. 스키 리조트와 가까워 겨울에는 스키를, 여름에는 시원한 고원 지대의 기후를 만끽할 수 있는 사계절 휴양지입니다.',
        included: [
          '온수 풀 이용',
          '자쿠지 이용',
          '아침 식사 (2인)',
          '무료 와이파이',
          '주차장'
        ],
        excluded: [
          '추가 식사',
          '스키 장비 렌탈',
          '스파 트리트먼트',
          '추가 인원 요금',
          '리조트 셔틀'
        ],
        notes: [
          '체크인: 오후 2시, 체크아웃: 오전 11시',
          '최대 4인까지 이용 가능 (기준 인원 2인, 추가 인원 1인당 50,000원)',
          '스키 시즌(12월-2월)은 요금이 30% 인상됩니다',
          '온수풀 이용 시간: 오전 7시 - 오후 10시',
          '스키 리조트 셔틀 예약 가능 (유료)'
        ],
        features: ['온수 수영장', '자쿠지', '스키 리조트 근처', '산악 전망', '자연 친화적 설계']
      },
      'domestic-villa-3': {
        id: 'domestic-villa-3',
        type: 'domestic',
        region: 'pool-villa',
        regionKo: '풀빌라',
        title: '경기도 가평 수상 풀빌라',
        price: '380,000',
        duration: '1박',
        rating: 4.5,
        image: '/images/villa-gapyeong.jpg',
        highlights: ['수상 빌라', '오픈 에어풀', '캠프파이어'],
        departure: '연중가능',
        description: '가평 북한강변에 위치한 독특한 수상 풀빌라로, 물 위에 떠 있는 듯한 경험을 제공합니다. 오픈 에어 수영장과 강변 캠프파이어 시설을 갖추고 있어 특별한 추억을 만들 수 있는 이색적인 숙소입니다.',
        included: [
          '수영장 이용',
          '캠프파이어 세트 (장작 및 점화기)',
          '카약 2시간 무료 대여',
          '바베큐 그릴',
          'TV 및 사운드 시스템'
        ],
        excluded: [
          '식사',
          '바베큐 재료',
          '카약 추가 이용',
          '낚시 장비',
          '보트 투어'
        ],
        notes: [
          '체크인: 오후 3시, 체크아웃: 오전 11시',
          '최대 6인까지 이용 가능 (기준 인원 4인, 추가 인원 1인당 40,000원)',
          '안전을 위해 어린이는 반드시 성인 동반 필수',
          '우천시 캠프파이어 이용이 제한될 수 있습니다',
          '수영장 이용 시간: 오전 8시 - 오후 9시'
        ],
        features: ['수상 빌라', '오픈 에어 수영장', '강변 전망', '캠프파이어', '카약 대여']
      },
      'domestic-villa-4': {
        id: 'domestic-villa-4',
        type: 'domestic',
        region: 'pool-villa',
        regionKo: '풀빌라',
        title: '양양 서핑 비치 풀빌라',
        price: '350,000',
        duration: '1박',
        rating: 4.5,
        image: '/images/villa-yangyang.jpg',
        highlights: ['해변 근처', '인피니티풀', '루프탑 테라스'],
        departure: '연중가능',
        description: '양양 서핑 해변 근처에 위치한 모던한 풀빌라로, 인피니티 수영장과 루프탑 테라스를 갖추고 있습니다. 서핑 애호가들에게 이상적이며, 해변까지 도보 5분 거리로 접근성이 뛰어납니다.',
        included: [
          '인피니티풀 이용',
          '루프탑 테라스',
          '서핑 보드 보관소',
          '주차장',
          '무료 와이파이'
        ],
        excluded: [
          '식사',
          '서핑 강습',
          '장비 대여',
          '해변 셔틀',
          '바비큐 재료'
        ],
        notes: [
          '체크인: 오후 2시, 체크아웃: 오전 11시',
          '최대 4인까지 이용 가능 (기준 인원 2인, 추가 인원 1인당 30,000원)',
          '서핑 보드 세척 및 보관 공간 제공',
          '성수기(6월-8월) 요금 20% 인상',
          '루프탑 테라스 이용 시간: 오전 8시 - 오후 10시'
        ],
        features: ['인피니티 수영장', '해변 근접', '루프탑 테라스', '서핑 보드 보관소', '모던 디자인']
      },
      'domestic-villa-5': {
        id: 'domestic-villa-5',
        type: 'domestic',
        region: 'pool-villa',
        regionKo: '풀빌라',
        title: '여수 밤바다 오션뷰 풀빌라',
        price: '420,000',
        duration: '1박',
        rating: 4.5,
        image: '/images/villa-yeosu.jpg',
        highlights: ['오션뷰', '인피니티풀', '루프탑 테라스'],
        departure: '연중가능',
        description: '여수 밤바다가 한눈에 보이는 언덕 위에 위치한 럭셔리 풀빌라입니다. 인피니티 에지 수영장에서 바다와 하늘이 맞닿은 환상적인 전망을 감상할 수 있으며, 밤에는 빛나는 여수 밤바다의 낭만을 즐길 수 있습니다.',
        included: [
          '인피니티 수영장 이용',
          '루프탑 테라스',
          '웰컴 와인 1병',
          '조식 도시락 배달 서비스',
          '무료 주차'
        ],
        excluded: [
          '저녁 식사',
          '바다 투어',
          '마사지 서비스',
          '추가 음료',
          '관광 가이드'
        ],
        notes: [
          '체크인: 오후 3시, 체크아웃: 오전 11시',
          '최대 4인까지 이용 가능 (기준 인원 2인, 추가 인원 1인당 50,000원)',
          '풀빌라에서 도보 10분 거리에 카페와 레스토랑 위치',
          '야외 수영장 이용 시간: 오전 8시 - 오후 9시',
          '방음 시설이 되어있으나, 늦은 시간 소음 자제 부탁드립니다'
        ],
        features: ['오션뷰', '인피니티 수영장', '루프탑 테라스', '웰컴 와인', '럭셔리 인테리어']
      },
      'domestic-villa-6': {
        id: 'domestic-villa-6',
        type: 'domestic',
        region: 'pool-villa',
        regionKo: '풀빌라',
        title: '남해 독일마을 감성 풀빌라',
        price: '380,000',
        duration: '1박',
        rating: 4.5,
        image: '/images/villa-namhae.jpg',
        highlights: ['독일마을 근처', '온수풀', '테라스'],
        departure: '연중가능',
        description: '남해 독일마을 인근에 위치한 유럽풍 디자인의 풀빌라로, 사계절 이용 가능한 온수풀과 아름다운 바다를 조망할 수 있는 테라스를 갖추고 있습니다. 독일마을의 이국적인 분위기와 남해의 아름다운 자연을 동시에 즐길 수 있는 특별한 공간입니다.',
        included: [
          '온수풀 이용',
          '독일식 아침 식사 바구니',
          '테라스 이용',
          '무료 주차',
          '무료 와이파이'
        ],
        excluded: [
          '저녁 식사',
          '바베큐 재료',
          '독일마을 투어 가이드',
          '추가 침구류',
          '픽업 서비스'
        ],
        notes: [
          '체크인: 오후 2시, 체크아웃: 오전 11시',
          '최대 6인까지 이용 가능 (기준 인원 4인, 추가 인원 1인당 40,000원)',
          '독일마을까지 도보 15분',
          '온수풀 이용 시간: 오전 7시 - 오후 10시',
          '주변 관광지: 독일마을, 상주은모래비치, 미조항 (차량 15-20분 거리)'
        ],
        features: ['유럽풍 디자인', '온수 수영장', '바다 전망', '독일마을 근처', '프라이빗 테라스']
      },
      'pool-villa-gapyeong': {
        id: 'pool-villa-gapyeong',
        type: 'domestic',
        region: 'pool-villa',
        regionKo: '풀빌라',
        title: '가평 숲속 풀빌라',
        price: '380,000',
        duration: '1박',
        rating: 4.8,
        image: '/images/villa-gapyeong.jpg',
        highlights: ['프라이빗 풀', '숲속 뷰', '테라스'],
        departure: '연중가능',
        description: '가평의 울창한 숲속에서 프라이빗 풀과 함께 조용한 휴식을 즐길 수 있는 풀빌라입니다.'
      },
      'pool-villa-yangyang': {
        id: 'pool-villa-yangyang',
        type: 'domestic',
        region: 'pool-villa',
        regionKo: '풀빌라',
        title: '양양 해변 풀빌라',
        price: '420,000',
        duration: '1박',
        rating: 4.7,
        image: '/images/villa-yangyang.jpg',
        highlights: ['프라이빗 풀', '해변 접근성', '루프탑 테라스'],
        departure: '연중가능',
        description: '양양 해변과 가까운 곳에 위치한 프라이빗 풀과 루프탑 테라스를 갖춘 럭셔리 풀빌라입니다.'
      }
    };
    return villaPackages[id] || villaPackages[`domestic-villa-${villaId}`];
  }

  // 괌/사이판 호텔 패키지 처리
  if (id.startsWith('guam-hotel-') || id.startsWith('saipan-hotel-') || id.startsWith('americas-hotel-') || 
      id.startsWith('hongkong-hotel-') || id.startsWith('macau-hotel-') || id.startsWith('taipei-hotel-') || 
      id.startsWith('shanghai-hotel-') || id.startsWith('beijing-hotel-')) {
    const hotelPackages: Record<string, Package> = {
      'americas-hotel-1': {
        id: 'americas-hotel-1',
        type: 'hotel',
        region: 'americas',
        regionKo: '미주/캐나다',
        title: '뉴욕 타임스퀘어 호텔',
        price: '450,000',
        duration: '1박',
        rating: 5,
        image: '/images/hotel-newyork.jpg',
        highlights: ['중심 위치', '브로드웨이 근처', '루프탑 바'],
        departure: '연중가능',
        description: '뉴욕 맨해튼 중심부 타임스퀘어에 위치한 럭셔리 호텔로, 브로드웨이 공연장과 쇼핑 명소가 도보 거리에 있습니다.'
      },
      'americas-hotel-2': {
        id: 'americas-hotel-2',
        type: 'hotel',
        region: 'americas',
        regionKo: '미주/캐나다',
        title: '하와이 와이키키 리조트',
        price: '480,000',
        duration: '1박',
        rating: 5,
        image: '/images/hotel-hawaii.jpg',
        highlights: ['오션뷰', '서핑 레슨', '루아우쇼'],
        departure: '연중가능',
        description: '하와이 와이키키 해변에 위치한 고급 리조트로, 아름다운 오션뷰와 다양한 해양 액티비티를 즐길 수 있습니다.'
      },
      'americas-hotel-3': {
        id: 'americas-hotel-3',
        type: 'hotel',
        region: 'americas',
        regionKo: '미주/캐나다',
        title: '밴쿠버 하버뷰 호텔',
        price: '320,000',
        duration: '1박',
        rating: 4.7,
        image: '/images/hotel-vancouver.jpg',
        highlights: ['하버뷰', '스키장 근처', '스파'],
        departure: '연중가능',
        description: '캐나다 밴쿠버 하버 전망을 갖춘 고급 호텔로, 스키 리조트와 자연 명소에 접근하기 좋은 위치에 있습니다.'
      },
      'americas-hotel-4': {
        id: 'americas-hotel-4',
        type: 'hotel',
        region: 'americas',
        regionKo: '미주/캐나다',
        title: '라스베가스 럭셔리 리조트',
        price: '390,000',
        duration: '1박',
        rating: 4.9,
        image: '/images/hotel-lasvegas.jpg',
        highlights: ['카지노', '쇼', '수영장'],
        departure: '연중가능',
        description: '라스베가스 스트립에 위치한 호화로운 리조트로, 카지노, 세계적인 쇼, 다양한 레스토랑을 갖추고 있습니다.'
      },
      'americas-hotel-5': {
        id: 'americas-hotel-5',
        type: 'hotel',
        region: 'americas',
        regionKo: '미주/캐나다',
        title: '마이애미 비치 호텔',
        price: '370,000',
        duration: '1박',
        rating: 4.8,
        image: '/images/hotel-miami.jpg',
        highlights: ['비치프론트', '아트데코', '루프탑 풀'],
        departure: '연중가능',
        description: '마이애미 사우스 비치의 아트데코 지구에 위치한 스타일리시한 호텔로, 프라이빗 비치와 루프탑 수영장을 즐길 수 있습니다.'
      },
      'americas-hotel-6': {
        id: 'americas-hotel-6',
        type: 'hotel',
        region: 'americas',
        regionKo: '미주/캐나다',
        title: '토론토 다운타운 호텔',
        price: '290,000',
        duration: '1박',
        rating: 4.6,
        image: '/images/hotel-toronto.jpg',
        highlights: ['시내 중심', 'CN타워 전망', '비즈니스 센터'],
        departure: '연중가능',
        description: '토론토 다운타운에 위치한 비즈니스 친화적인 호텔로, CN타워와 주요 관광지가 가까이 있습니다.'
      },
      'hongkong-hotel-1': {
        id: 'hongkong-hotel-1',
        type: 'hotel',
        region: 'china-hongkong',
        regionKo: '중국/홍콩',
        title: '홍콩 하버뷰 호텔',
        price: '320,000',
        duration: '1박',
        rating: 5,
        image: '/images/hotel-hongkong.jpg',
        highlights: ['빅토리아 하버뷰', '딤섬 레스토랑', '쇼핑몰 연결'],
        departure: '연중가능',
        description: '홍콩 빅토리아 하버가 한눈에 내려다보이는 최고의 위치에 있는 호텔로, 쇼핑과 관광에 편리합니다.'
      },
      'macau-hotel-1': {
        id: 'macau-hotel-1',
        type: 'hotel',
        region: 'china-hongkong',
        regionKo: '중국/홍콩',
        title: '마카오 갤럭시 리조트',
        price: '380,000',
        duration: '1박',
        rating: 5,
        image: '/images/hotel-macau.jpg',
        highlights: ['카지노', '워터파크', '미슐랭 레스토랑'],
        departure: '연중가능',
        description: '마카오의 대표적인 복합 리조트로, 카지노, 워터파크, 미슐랭 레스토랑 등 다양한 엔터테인먼트를 제공합니다.'
      },
      'taipei-hotel-1': {
        id: 'taipei-hotel-1',
        type: 'hotel',
        region: 'china-hongkong',
        regionKo: '중국/홍콩',
        title: '타이베이 그랜드 호텔',
        price: '280,000',
        duration: '1박',
        rating: 4.7,
        image: '/images/hotel-taipei.jpg',
        highlights: ['전통 건축', '야시장 근처', '온천'],
        departure: '연중가능',
        description: '타이완의 전통 건축 양식을 따른 고급 호텔로, 유명 야시장과 가까우며 자체 온천 시설을 갖추고 있습니다.'
      },
      'hongkong-hotel-2': {
        id: 'hongkong-hotel-2',
        type: 'hotel',
        region: 'china-hongkong',
        regionKo: '중국/홍콩',
        title: '홍콩 리츠칼튼',
        price: '420,000',
        duration: '1박',
        rating: 4.9,
        image: '/images/hotel-hongkong2.jpg',
        highlights: ['5성급 럭셔리', '스파', '미슐랭 다이닝'],
        departure: '연중가능',
        description: '홍콩에서 가장 럭셔리한 호텔 중 하나로, 탁월한 서비스와 시설을 자랑합니다.'
      },
      'shanghai-hotel-1': {
        id: 'shanghai-hotel-1',
        type: 'hotel',
        region: 'china-hongkong',
        regionKo: '중국/홍콩',
        title: '상하이 페닌슐라 호텔',
        price: '350,000',
        duration: '1박',
        rating: 4.8,
        image: '/images/hotel-shanghai.jpg',
        highlights: ['번드 전망', '헤리티지 호텔', '럭셔리 스파'],
        departure: '연중가능',
        description: '상하이 번드에 위치한 역사적인 호텔로, 클래식한 우아함과 현대적인 편의시설이 완벽하게 조화를 이루고 있습니다.'
      },
      'beijing-hotel-1': {
        id: 'beijing-hotel-1',
        type: 'hotel',
        region: 'china-hongkong',
        regionKo: '중국/홍콩',
        title: '베이징 리젠트 호텔',
        price: '290,000',
        duration: '1박',
        rating: 4.6,
        image: '/images/hotel-beijing.jpg',
        highlights: ['자금성 근처', '차이나 가든', '비즈니스 시설'],
        departure: '연중가능',
        description: '베이징의 중심부에 위치해 자금성과 같은 주요 관광지에 쉽게 접근할 수 있는 고급 비즈니스 호텔입니다.'
      },
      'guam-hotel-1': {
        id: 'guam-hotel-1',
        type: 'hotel',
        region: 'guam-saipan',
        regionKo: '괌/사이판',
        title: '두짓 타니 괌 리조트',
        price: '380,000',
        duration: '1박',
        rating: 5,
        image: '/images/hotel-guam.jpg',
        highlights: ['오션뷰', '인피니티풀', '프라이빗비치', '키즈클럽'],
        departure: '연중가능',
        description: '괌의 아름다운 해변과 열대 정원 사이에 위치한 럭셔리 리조트로 최고급 서비스와 시설을 제공합니다.'
      },
      'saipan-hotel-1': {
        id: 'saipan-hotel-1',
        type: 'hotel',
        region: 'guam-saipan',
        regionKo: '괌/사이판',
        title: '하얏트 리젠시 사이판',
        price: '350,000',
        duration: '1박',
        rating: 4.8,
        image: '/images/hotel-saipan.jpg',
        highlights: ['클럽라운지', '워터파크', '스파', '다이빙'],
        departure: '연중가능',
        description: '사이판 최고의 리조트 중 하나로, 프라이빗 비치와 워터파크를 갖추고 있으며 다양한 해양 액티비티를 즐길 수 있습니다.'
      },
      'guam-hotel-2': {
        id: 'guam-hotel-2',
        type: 'hotel',
        region: 'guam-saipan',
        regionKo: '괌/사이판',
        title: '더 웨스틴 호텔',
        price: '290,000',
        duration: '1박',
        rating: 4.7,
        image: '/images/hotel-guam2.jpg',
        highlights: ['바다전망', '해변산책로', '수영장', '테니스장'],
        departure: '연중가능',
        description: '투몬 베이의 중심에 위치한 웨스틴 호텔은 편안한 객실과 다양한 레저 시설을 제공합니다.'
      },
      'guam-hotel-3': {
        id: 'guam-hotel-3',
        type: 'hotel',
        region: 'guam-saipan',
        regionKo: '괌/사이판',
        title: '더 티파니아 리조트',
        price: '420,000',
        duration: '1박',
        rating: 4.9,
        image: '/images/hotel-guam3.jpg',
        highlights: ['파노라마 뷰', '고급 레스토랑', '인피니티풀', '해양액티비티'],
        departure: '연중가능',
        description: '괌의 아름다운 해변을 파노라마 뷰로 감상할 수 있는 고급 리조트로, 최상급 서비스를 제공합니다.'
      },
      'saipan-hotel-2': {
        id: 'saipan-hotel-2',
        type: 'hotel',
        region: 'guam-saipan',
        regionKo: '괌/사이판',
        title: '사이판 월드 호텔 리조트',
        price: '310,000',
        duration: '1박',
        rating: 4.6,
        image: '/images/hotel-saipan2.jpg',
        highlights: ['프라이빗', '다이브센터', '전망좋음', '등산'],
        departure: '연중가능',
        description: '사이판의 자연 경관을 즐기기에 최적의 위치에 있으며, 다이빙과 등산 같은 다양한 활동을 즐길 수 있습니다.'
      },
      'guam-hotel-4': {
        id: 'guam-hotel-4',
        type: 'hotel',
        region: 'guam-saipan',
        regionKo: '괌/사이판',
        title: '오션 뷰 타워 호텔',
        price: '270,000',
        duration: '1박',
        rating: 4.5,
        image: '/images/hotel-guam4.jpg',
        highlights: ['시내중심', '쇼핑몰', '셔틀서비스', '비즈니스센터'],
        departure: '연중가능',
        description: '괌 시내 중심에 위치한 편리한 호텔로, 쇼핑과 관광에 최적의 위치를 자랑합니다.'
      }
    };
    return hotelPackages[id];
  }
  
  // 해외 중국/홍콩 패키지 처리
  if (id.startsWith('china-hongkong-')) {
    const chinaPackages: Record<string, Package> = {
      'china-hongkong-1': {
        id: 'china-hongkong-1',
        type: 'overseas',
        region: 'china-hongkong',
        regionKo: '중국/홍콩',
        title: '홍콩 & 마카오 3일',
        price: '890,000',
        duration: '3일 1박',
        rating: 4.7,
        image: '/images/hongkong.jpg',
        highlights: ['빅토리아 피크', '심포니 오브 라이츠', '베네시안 마카오', '딤섬'],
        departure: '매일 출발',
        description: '홍콩의 화려한 야경과 마카오의 환상적인 카지노를 모두 경험할 수 있는 짧고 알찬 여행입니다.'
      },
      'china-hongkong-2': {
        id: 'china-hongkong-2',
        type: 'overseas',
        region: 'china-hongkong',
        regionKo: '중국/홍콩',
        title: '대만 타이베이 & 타이중 5일',
        price: '1,290,000',
        duration: '5일 3박',
        rating: 4.8,
        image: '/images/taiwan.jpg',
        highlights: ['101타워', '야시장', '지우펀', '타로코 협곡'],
        departure: '매일 출발',
        description: '대만의 수도 타이베이와 타이중의 매력적인 관광지와 다양한 먹거리를 경험하는 여행입니다.'
      },
      'china-hongkong-3': {
        id: 'china-hongkong-3',
        type: 'overseas',
        region: 'china-hongkong',
        regionKo: '중국/홍콩',
        title: '홍콩 디즈니랜드 가족여행 4일',
        price: '1,490,000',
        duration: '4일 2박',
        rating: 4.9,
        image: '/images/hongkong-disney.jpg',
        highlights: ['디즈니랜드', '오션파크', '스타페리', '템플스트리트'],
        departure: '매주 금/토/일 출발',
        description: '홍콩 디즈니랜드와 오션파크를 중심으로 온 가족이 함께 즐길 수 있는 테마파크 여행입니다.'
      },
      'china-hongkong-4': {
        id: 'china-hongkong-4',
        type: 'overseas',
        region: 'china-hongkong',
        regionKo: '중국/홍콩',
        title: '대만 일주 완전정복 8일',
        price: '2,190,000',
        duration: '8일 6박',
        rating: 4.6,
        image: '/images/taiwan-tour.jpg',
        highlights: ['타이베이', '타이중', '가오슝', '화련'],
        departure: '매주 화/토 출발',
        description: '대만의 북부, 중부, 남부, 동부를 모두 돌아보며 대만의 아름다운 자연과 문화를 깊이 있게 체험하는 여행입니다.'
      }
    };
    return chinaPackages[id];
  }

  // 해외 미주 패키지 처리
  if (id.startsWith('americas-')) {
    const americasPackages: Record<string, Package> = {
      'americas-1': {
        id: 'americas-1',
        type: 'overseas',
        region: 'americas',
        regionKo: '미주',
        title: '미국 서부 그랜드캐년 & 라스베가스 8일',
        price: '3,490,000',
        duration: '8일 6박',
        rating: 4.8,
        image: '/images/usa-west.jpg',
        highlights: ['그랜드캐년', '라스베가스', '샌프란시스코', '요세미티'],
        departure: '매주 화/금 출발',
        description: '웅장한 그랜드캐년과 화려한 라스베가스를 포함한 미국 서부의 명소들을 둘러보는 여행입니다.'
      },
      'americas-2': {
        id: 'americas-2',
        type: 'overseas',
        region: 'americas',
        regionKo: '미주',
        title: '하와이 오아후 & 마우이 7일',
        price: '2,890,000',
        duration: '7일 5박',
        rating: 4.9,
        image: '/images/hawaii.jpg',
        highlights: ['와이키키', '다이아몬드헤드', '마우이 선라이즈', '진주만'],
        departure: '매일 출발',
        description: '천국의 섬 하와이에서 오아후와 마우이의 아름다운 해변과 자연을 경험하는 여행입니다.'
      },
      'americas-3': {
        id: 'americas-3',
        type: 'overseas',
        region: 'americas',
        regionKo: '미주',
        title: '캐나다 로키 밴쿠버 & 토론토 9일',
        price: '3,890,000',
        duration: '9일 7박',
        rating: 4.7,
        image: '/images/canada.jpg',
        highlights: ['밴프', '재스퍼', '나이아가라 폭포', '토론토'],
        departure: '6-9월 매주 출발',
        description: '웅장한 로키 산맥과 나이아가라 폭포 등 캐나다의 대자연과 도시를 함께 경험하는 여행입니다.'
      },
      'americas-4': {
        id: 'americas-4',
        type: 'overseas',
        region: 'americas',
        regionKo: '미주',
        title: '뉴욕 & 워싱턴 동부 여행 7일',
        price: '3,290,000',
        duration: '7일 5박',
        rating: 4.6,
        image: '/images/usa-east.jpg',
        highlights: ['타임스퀘어', '자유의 여신상', '백악관', '스미소니언'],
        departure: '연중 매주 출발',
        description: '세계의 중심 뉴욕과 미국의 수도 워싱턴 DC의 역사와 문화를 탐방하는 여행입니다.'
      }
    };
    return americasPackages[id];
  }
  
  // 추가 패키지들을 여기에 추가할 수 있습니다.
  
  return mainPagePackages[id];
}

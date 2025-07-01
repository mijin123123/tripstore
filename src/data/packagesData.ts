import { Calendar, MapPin, Clock, Users, Utensils, Home, Camera, Plane } from 'lucide-react';

export interface TravelPackage {
  id: number;
  name: string;
  destination: string;
  description: string;
  price: string;
  image: string;
  type: string;
  rating?: number;
  duration?: string;
  groupSize?: string;
  meals?: string;
  accommodation?: string;
  activities?: string[];
  includes?: string[];
  excludes?: string[];
  itinerary?: {
    day: number;
    title: string;
    description: string;
    image?: string;
  }[];
  gallery?: string[];
  highlights?: string[];
  departureDate?: string[];
}

export const packagesData: TravelPackage[] = [
  {
    id: 1,
    name: "파리, 프랑스",
    destination: "파리, 프랑스",
    description: "로맨틱한 센 강 유람선과 함께하는 예술의 도시",
    price: "1,800,000원",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760c0337?q=80&w=2070&auto=format&fit=crop",
    type: "커플",
    duration: "5박 6일",
    groupSize: "최대 16명",
    meals: "조식 5회, 석식 3회 포함",
    accommodation: "4성급 호텔",
    activities: ["에펠탑 관람", "루브르 박물관 가이드 투어", "센 강 유람선", "몽마르트르 언덕 산책", "베르사유 궁전 방문"],
    includes: ["왕복 항공권", "공항 픽업 서비스", "숙박 및 포함된 식사", "전문 한국어 가이드", "관광지 입장료", "여행자 보험"],
    excludes: ["개인 지출", "포함되지 않은 식사", "선택 관광"],
    itinerary: [
      {
        day: 1,
        title: "파리 도착 및 시내 투어",
        description: "인천에서 출발하여 파리 샤를 드골 공항에 도착합니다. 호텔 체크인 후 간단한 오리엔테이션과 함께 근처 카페에서 휴식을 취합니다.",
        image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=1974&auto=format&fit=crop"
      },
      {
        day: 2,
        title: "에펠탑 & 센 강 유람선",
        description: "아침 식사 후 파리의 상징인 에펠탑을 방문합니다. 중식 후에는 센 강 유람선을 타고 파리의 아름다운 경치를 감상합니다.",
        image: "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?q=80&w=2001&auto=format&fit=crop"
      },
      {
        day: 3,
        title: "루브르 박물관 & 몽마르트르",
        description: "세계 최대 규모의 박물관인 루브르를 방문하여 모나리자와 비너스 등 명작들을 감상합니다. 오후에는 예술가들의 마을 몽마르트르를 방문합니다.",
        image: "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?q=80&w=2074&auto=format&fit=crop"
      },
      {
        day: 4,
        title: "베르사유 궁전",
        description: "베르사유 궁전과 아름다운 정원을 방문합니다. 루이 14세의 화려했던 궁중 생활을 엿볼 수 있습니다.",
        image: "https://images.unsplash.com/photo-1548783307-f3d624fdaf35?q=80&w=2071&auto=format&fit=crop"
      },
      {
        day: 5,
        title: "자유 시간 및 쇼핑",
        description: "마지막 날은 자유 시간입니다. 갤러리 라파예트나 샹젤리제 거리에서 쇼핑을 즐기거나 원하는 명소를 방문하세요.",
        image: "https://images.unsplash.com/photo-1520469666044-707dbe68890c?q=80&w=2071&auto=format&fit=crop"
      },
      {
        day: 6,
        title: "파리 출발",
        description: "아침 식사 후 공항으로 이동하여 한국행 비행기에 탑승합니다.",
        image: "https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?q=80&w=2070&auto=format&fit=crop"
      }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1502602898657-3e91760c0337?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?q=80&w=2001&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551634979-2b11f8c946fe?q=80&w=2076&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1533294455009-a77b7557d2d1?q=80&w=1974&auto=format&fit=crop"
    ],
    highlights: ["세계적인 명소 에펠탑", "예술의 보고 루브르", "왕실의 호화로움 베르사유", "로맨틱한 센 강 유람"],
    departureDate: ["2025.08.15", "2025.08.22", "2025.09.05", "2025.09.15"]
  },
  {
    id: 2,
    name: "발리, 인도네시아",
    destination: "발리, 인도네시아",
    description: "평화로운 해변과 요가, 그리고 영적인 휴식",
    price: "1,200,000원",
    image: "https://images.unsplash.com/photo-1573790387438-4da905039392?q=80&w=1925&auto=format&fit=crop",
    type: "커플",
    duration: "6박 7일",
    groupSize: "최대 12명",
    meals: "조식 6회, 석식 3회 포함",
    accommodation: "4성급 리조트",
    activities: ["우붓 마사지 체험", "발리 전통 댄스 관람", "우붓 몽키 포레스트", "테갈랄랑 라이스 테라스", "울루와투 사원 일몰 관람"],
    includes: ["왕복 항공권", "공항 픽업 서비스", "숙박 및 포함된 식사", "현지 가이드", "액티비티 비용", "여행자 보험"],
    excludes: ["개인 지출", "포함되지 않은 식사", "선택 관광", "비자 발급 비용"],
    itinerary: [
      {
        day: 1,
        title: "발리 도착",
        description: "인천에서 출발하여 발리 응우라라이 국제공항에 도착합니다. 호텔 체크인 후 휴식을 취합니다.",
        image: "https://images.unsplash.com/photo-1558005137-d9619a5c539f?q=80&w=2071&auto=format&fit=crop"
      },
      {
        day: 2,
        title: "꾸따 비치 & 스파",
        description: "아침에는 꾸따 비치에서 여유로운 시간을 보내고, 오후에는 발리 전통 마사지를 체험합니다.",
        image: "https://images.unsplash.com/photo-1541789094913-f3809a8f3ba5?q=80&w=2070&auto=format&fit=crop"
      },
      {
        day: 3,
        title: "우붓 투어",
        description: "우붓 몽키 포레스트와 테갈랄랑 라이스 테라스를 방문한 후, 현지 예술가들의 작품을 볼 수 있는 우붓 아트 마켓을 방문합니다.",
        image: "https://images.unsplash.com/photo-1512495352224-760e8709c878?q=80&w=1974&auto=format&fit=crop"
      },
      {
        day: 4,
        title: "따나롯 사원 & 발리 전통 댄스",
        description: "아침에 유명한 따나롯 사원을 방문하고, 저녁에는 발리 전통 댄스 공연을 관람합니다.",
        image: "https://images.unsplash.com/photo-1577948000111-9c970dfe3743?q=80&w=1974&auto=format&fit=crop"
      },
      {
        day: 5,
        title: "해변 휴식 & 선셋 디너",
        description: "오전에는 해변에서 자유롭게 휴식을 취하고, 저녁에는 짐바란 비치에서 해변 선셋 디너를 즐깁니다.",
        image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=2070&auto=format&fit=crop"
      },
      {
        day: 6,
        title: "울루와투 사원 & 케착 댄스",
        description: "울루와투 사원에서 아름다운 일몰을 감상하고 케착 파이어 댄스를 관람합니다.",
        image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2070&auto=format&fit=crop"
      },
      {
        day: 7,
        title: "발리 출발",
        description: "아침 식사 후 공항으로 이동하여 한국행 비행기에 탑승합니다.",
        image: "https://images.unsplash.com/photo-1542897644-e04428948020?q=80&w=1974&auto=format&fit=crop"
      }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1573790387438-4da905039392?q=80&w=1925&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1577948000111-9c970dfe3743?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512495352224-760e8709c878?q=80&w=1974&auto=format&fit=crop"
    ],
    highlights: ["영적인 발리 문화 체험", "이국적인 해변에서의 휴식", "세계적으로 유명한 발리 마사지", "아름다운 사원 투어"],
    departureDate: ["2025.07.15", "2025.07.28", "2025.08.10", "2025.08.24"]
  },
  {
    id: 3,
    name: "교토, 일본",
    destination: "교토, 일본",
    description: "천년 고도의 정취, 고즈넉한 사찰과 정원 산책",
    price: "900,000원",
    image: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=2070&auto=format&fit=crop",
    type: "커플",
    duration: "4박 5일",
    groupSize: "최대 15명",
    meals: "조식 4회, 석식 2회 포함",
    accommodation: "3성급 호텔",
    activities: ["후시미 이나리 신사", "기요미즈데라 사원", "아라시야마 대나무 숲", "금각사", "기온 거리 산책"],
    includes: ["왕복 항공권", "공항 픽업 서비스", "숙박 및 포함된 식사", "가이드 서비스", "관광지 입장료"],
    excludes: ["개인 지출", "포함되지 않은 식사", "선택 관광"],
    itinerary: [
      {
        day: 1,
        title: "교토 도착 및 시내 투어",
        description: "인천에서 출발하여 오사카 간사이 공항에 도착 후 교토로 이동합니다. 호텔에 체크인하고 주변 구경을 시작합니다.",
        image: "https://images.unsplash.com/photo-1607619662634-3ac55ec0e216?q=80&w=1935&auto=format&fit=crop"
      },
      {
        day: 2,
        title: "후시미 이나리 & 기요미즈데라",
        description: "아침에 수천 개의 주황색 도리이 게이트로 유명한 후시미 이나리 신사를 방문합니다. 오후에는 교토의 대표적인 사원인 기요미즈데라를 방문합니다.",
        image: "https://images.unsplash.com/photo-1504198453758-3e494d3f44e5?q=80&w=1935&auto=format&fit=crop"
      },
      {
        day: 3,
        title: "아라시야마 & 금각사",
        description: "아침에 아라시야마의 대나무 숲을 산책하고, 오후에는 아름다운 금각사를 방문합니다.",
        image: "https://images.unsplash.com/photo-1607604760190-ec4e01236324?q=80&w=1974&auto=format&fit=crop"
      },
      {
        day: 4,
        title: "니조성 & 기온 거리",
        description: "아침에 니조성을 방문하고, 저녁에는 기온 거리에서 전통적인 교토의 밤 분위기를 느껴보세요.",
        image: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?q=80&w=2053&auto=format&fit=crop"
      },
      {
        day: 5,
        title: "교토 출발",
        description: "아침 식사 후 간사이 공항으로 이동하여 한국행 비행기에 탑승합니다.",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1950&auto=format&fit=crop"
      }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504198453758-3e494d3f44e5?q=80&w=1935&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1607604760190-ec4e01236324?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1950&auto=format&fit=crop"
    ],
    highlights: ["전통 사원과 신사 방문", "아름다운 일본 정원 감상", "일본 전통 문화 체험", "맛있는 교토 요리 맛보기"],
    departureDate: ["2025.09.10", "2025.09.24", "2025.10.08", "2025.10.22"]
  },
  {
    id: 4,
    name: "퀸스타운, 뉴질랜드",
    destination: "퀸스타운, 뉴질랜드",
    description: "짜릿한 액티비티의 천국, 번지점프와 스카이다이빙",
    price: "2,500,000원",
    image: "https://images.unsplash.com/photo-1579448933831-4553472c35e9?q=80&w=1974&auto=format&fit=crop",
    type: "어드벤처",
    duration: "7박 8일",
    groupSize: "최대 10명",
    meals: "조식 7회, 석식 4회 포함",
    accommodation: "4성급 호텔 & 로지",
    activities: ["번지점프", "제트보트", "밀포드 사운드 크루즈", "스카이다이빙", "와나카 트레킹"],
    includes: ["왕복 항공권", "전용 차량", "숙박 및 포함된 식사", "액티비티 비용", "전문 가이드", "안전 장비"],
    excludes: ["개인 지출", "포함되지 않은 식사", "여행자 보험", "추가 액티비티"],
    itinerary: [
      {
        day: 1,
        title: "퀸스타운 도착",
        description: "인천에서 출발하여 퀸스타운에 도착합니다. 호텔 체크인 후 시내 오리엔테이션 투어를 합니다.",
        image: "https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?q=80&w=1944&auto=format&fit=crop"
      },
      {
        day: 2,
        title: "번지점프 & 제트보트",
        description: "세계에서 가장 유명한 카와라우 다리에서 번지점프에 도전하고, 오후에는 숏오버 협곡에서 제트보트를 체험합니다.",
        image: "https://images.unsplash.com/photo-1445452916036-9022dfd33aa8?q=80&w=1974&auto=format&fit=crop"
      },
      {
        day: 3,
        title: "밀포드 사운드 일일 투어",
        description: "세계 8대 불가사의 중 하나인 밀포드 사운드를 방문하여 크루즈를 타고 그 웅장한 아름다움을 감상합니다.",
        image: "https://images.unsplash.com/photo-1531274932525-9dfa2ba9fd15?q=80&w=2070&auto=format&fit=crop"
      },
      {
        day: 4,
        title: "와나카 호수 & 트레킹",
        description: "와나카 호수와 그 유명한 와나카 트리를 방문합니다. 오후에는 가볍게 주변 트레킹을 즐깁니다.",
        image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?q=80&w=2071&auto=format&fit=crop"
      },
      {
        day: 5,
        title: "스카이다이빙",
        description: "아침에 퀸스타운 상공에서 스카이다이빙에 도전합니다. 뉴질랜드의 장엄한 풍경을 하늘에서 바라보는 경험을 할 수 있습니다.",
        image: "https://images.unsplash.com/photo-1608148515775-f12a7f7e8ca3?q=80&w=1974&auto=format&fit=crop"
      },
      {
        day: 6,
        title: "와인 투어",
        description: "센트럴 오타고 지역의 와이너리를 방문하여 뉴질랜드의 유명한 피노 누아를 비롯한 다양한 와인을 시음합니다.",
        image: "https://images.unsplash.com/photo-1620219365994-4d9f10eba8a3?q=80&w=1974&auto=format&fit=crop"
      },
      {
        day: 7,
        title: "자유 시간 & 장보기",
        description: "마지막 날은 자유 시간입니다. 시내에서 쇼핑을 하거나 추가 액티비티를 즐길 수 있습니다.",
        image: "https://images.unsplash.com/photo-1596470664098-ab8537af9d9e?q=80&w=2070&auto=format&fit=crop"
      },
      {
        day: 8,
        title: "퀸스타운 출발",
        description: "아침 식사 후 공항으로 이동하여 한국행 비행기에 탑승합니다.",
        image: "https://images.unsplash.com/photo-1570545917213-404353c7438d?q=80&w=2070&auto=format&fit=crop"
      }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1579448933831-4553472c35e9?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1531274932525-9dfa2ba9fd15?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?q=80&w=2071&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1445452916036-9022dfd33aa8?q=80&w=1974&auto=format&fit=crop"
    ],
    highlights: ["세계적인 번지점프", "극한의 스카이다이빙", "잊을 수 없는 밀포드 사운드", "아름다운 와나카 호수"],
    departureDate: ["2025.03.15", "2025.03.29", "2025.04.12", "2025.04.26"]
  },
  {
    id: 5,
    name: "로마, 이탈리아",
    destination: "로마, 이탈리아",
    description: "콜로세움과 바티칸 시국, 살아있는 역사의 현장",
    price: "2,100,000원",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1996&auto=format&fit=crop",
    type: "커플",
    duration: "6박 7일",
    groupSize: "최대 15명",
    meals: "조식 6회, 석식 3회 포함",
    accommodation: "4성급 호텔",
    activities: ["콜로세움 & 포로 로마노 투어", "바티칸 박물관 & 성 베드로 대성당", "판테온 & 트레비 분수", "로마 음식 투어", "폼페이 일일 투어"],
    includes: ["왕복 항공권", "공항 픽업 서비스", "숙박 및 포함된 식사", "전문 가이드", "입장료", "여행자 보험"],
    excludes: ["개인 지출", "포함되지 않은 식사", "선택 관광"],
    itinerary: [
      {
        day: 1,
        title: "로마 도착",
        description: "인천에서 출발하여 로마 피우미치노 공항에 도착합니다. 호텔 체크인 후 주변 환경에 적응하는 시간을 가집니다.",
        image: "https://images.unsplash.com/photo-1555992828-35627f3b373f?q=80&w=1974&auto=format&fit=crop"
      },
      {
        day: 2,
        title: "고대 로마 투어",
        description: "콜로세움, 포로 로마노, 팔라티노 언덕을 방문하여 고대 로마의 역사와 문화를 체험합니다.",
        image: "https://images.unsplash.com/photo-1548585219-f6416ec2cfe3?q=80&w=1974&auto=format&fit=crop"
      },
      {
        day: 3,
        title: "바티칸 시국 투어",
        description: "바티칸 박물관, 시스티나 채플, 성 베드로 대성당을 방문하여 가톨릭의 중심지를 탐험합니다.",
        image: "https://images.unsplash.com/photo-1569416078500-3857b00616f8?q=80&w=1974&auto=format&fit=crop"
      },
      {
        day: 4,
        title: "로마 시내 투어",
        description: "판테온, 트레비 분수, 스페인 계단 등 로마의 유명 명소들을 방문합니다.",
        image: "https://images.unsplash.com/photo-1529260830199-42c24126f198?q=80&w=2076&auto=format&fit=crop"
      },
      {
        day: 5,
        title: "폼페이 일일 투어",
        description: "나폴리 근처의 폼페이 유적지를 방문하여 베수비오 화산의 폭발로 멈춰버린 2천년 전 도시의 모습을 살펴봅니다.",
        image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1972&auto=format&fit=crop"
      },
      {
        day: 6,
        title: "이탈리안 푸드 투어 & 자유 시간",
        description: "맛있는 이탈리안 푸드 투어를 즐긴 후, 자유 시간을 가집니다. 마지막 쇼핑을 즐기거나 놓친 명소를 방문할 수 있습니다.",
        image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=2070&auto=format&fit=crop"
      },
      {
        day: 7,
        title: "로마 출발",
        description: "아침 식사 후 공항으로 이동하여 한국행 비행기에 탑승합니다.",
        image: "https://images.unsplash.com/photo-1564594153200-7d3fccbaecf0?q=80&w=2070&auto=format&fit=crop"
      }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1996&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1548585219-f6416ec2cfe3?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1569416078500-3857b00616f8?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1529260830199-42c24126f198?q=80&w=2076&auto=format&fit=crop"
    ],
    highlights: ["2천년 역사의 콜로세움", "세계에서 가장 작은 독립국 바티칸", "행운의 트레비 분수", "전설적인 이탈리아 요리"],
    departureDate: ["2025.05.10", "2025.05.24", "2025.06.14", "2025.06.28"]
  },
  {
    id: 6,
    name: "그랜드 캐니언, 미국",
    destination: "그랜드 캐니언, 미국",
    description: "대자연의 웅장함을 느낄 수 있는 하이킹과 일출 감상",
    price: "2,800,000원",
    image: "https://images.unsplash.com/photo-1474044159687-1683b036478e?q=80&w=2070&auto=format&fit=crop",
    type: "어드벤처",
    duration: "5박 6일",
    groupSize: "최대 12명",
    meals: "조식 5회, 점심도시락 3회, 석식 2회 포함",
    accommodation: "3성급 호텔 & 캠핑 (1박)",
    activities: ["그랜드 캐니언 사우스 림 투어", "헬리콥터 투어", "콜로라도 강 래프팅", "선라이즈/선셋 관람", "브라이트 엔젤 트레일 하이킹"],
    includes: ["왕복 항공권", "전용 차량", "숙박 및 포함된 식사", "국립공원 입장료", "액티비티 비용", "전문 가이드"],
    excludes: ["개인 지출", "포함되지 않은 식사", "선택 관광", "여행자 보험"],
    itinerary: [
      {
        day: 1,
        title: "라스베가스 도착",
        description: "인천에서 출발하여 라스베가스에 도착합니다. 저녁에는 라스베가스 스트립의 밤 풍경을 감상합니다.",
        image: "https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?q=80&w=2048&auto=format&fit=crop"
      },
      {
        day: 2,
        title: "그랜드 캐니언으로 이동",
        description: "아침 일찍 라스베가스를 출발하여 그랜드 캐니언 국립공원으로 이동합니다. 오후에는 그랜드 캐니언의 장엄한 전망을 감상합니다.",
        image: "https://images.unsplash.com/photo-1575527936789-a3be08e06781?q=80&w=1974&auto=format&fit=crop"
      },
      {
        day: 3,
        title: "브라이트 엔젤 트레일 하이킹",
        description: "아침에 그랜드 캐니언의 대표적인 하이킹 코스인 브라이트 엔젤 트레일을 탐험합니다. 깊이 내려갈수록 드러나는 다양한 지층과 절경을 감상할 수 있습니다.",
        image: "https://images.unsplash.com/photo-1578299912132-2d564806be0c?q=80&w=2039&auto=format&fit=crop"
      },
      {
        day: 4,
        title: "헬리콥터 투어 & 캠핑",
        description: "그랜드 캐니언 상공을 헬리콥터로 관람하는 특별한 경험을 합니다. 저녁에는 캠핑을 하며 별이 빛나는 하늘을 감상합니다.",
        image: "https://images.unsplash.com/photo-1605641532626-3b608fb58595?q=80&w=2070&auto=format&fit=crop"
      },
      {
        day: 5,
        title: "콜로라도 강 래프팅 & 라스베가스 복귀",
        description: "아침에 콜로라도 강에서 래프팅을 즐긴 후, 라스베가스로 복귀합니다. 저녁 시간은 자유롭게 보냅니다.",
        image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop"
      },
      {
        day: 6,
        title: "라스베가스 출발",
        description: "아침 식사 후 공항으로 이동하여 한국행 비행기에 탑승합니다.",
        image: "https://images.unsplash.com/photo-1623810310139-6e6a4936c76c?q=80&w=2069&auto=format&fit=crop"
      }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1474044159687-1683b036478e?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578299912132-2d564806be0c?q=80&w=2039&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1575527936789-a3be08e06781?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop"
    ],
    highlights: ["세계에서 가장 장엄한 협곡", "헬리콥터에서 바라보는 절경", "별빛 아래서의 캠핑", "짜릿한 콜로라도 강 래프팅"],
    departureDate: ["2025.04.05", "2025.04.19", "2025.05.03", "2025.05.17"]
  },
  {
    id: 7,
    name: "그리스 산토리니 & 아테네 8일",
    destination: "산토리니 & 아테네, 그리스",
    description: "푸른 바다와 하얀 건물의 완벽한 조화, 지중해의 보석",
    price: "3,890,000원",
    image: "https://images.unsplash.com/photo-1533105079780-52b9be48d077?q=80&w=2070&auto=format&fit=crop",
    type: "휴양",
    duration: "7박 8일",
    groupSize: "최대 12명",
    meals: "조식 7회, 석식 3회 포함",
    accommodation: "4성급 호텔",
    activities: ["산토리니 마을 투어", "이아(Oia) 선셋 체험", "파르테논 신전 방문", "카타폴라니 해변 투어", "블루 돔 포토투어"],
    includes: ["왕복 항공권", "공항 픽업 서비스", "숙박 및 포함된 식사", "전문 가이드", "입장료", "여행자 보험"],
    excludes: ["개인 지출", "선택 관광", "포함되지 않은 식사"],
    itinerary: [
      {
        day: 1,
        title: "아테네 도착",
        description: "인천에서 출발하여 아테네 국제공항에 도착합니다. 호텔 체크인 후 휴식을 취합니다.",
        image: "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?q=80&w=2070&auto=format&fit=crop"
      },
      {
        day: 2,
        title: "아테네 시내 투어",
        description: "아테네의 상징 파르테논 신전과 아크로폴리스를 방문합니다. 플라카 지구에서 전통 그리스 요리를 즐깁니다.",
        image: "https://images.unsplash.com/photo-1555993539-1732b0258235?q=80&w=2070&auto=format&fit=crop"
      },
      {
        day: 3,
        title: "산토리니 이동",
        description: "국내선을 타고 산토리니 섬으로 이동합니다. 섬에 도착하여 피라 마을을 둘러봅니다.",
        image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2072&auto=format&fit=crop"
      },
      {
        day: 4,
        title: "산토리니 이아 마을",
        description: "산토리니의 대표적인 마을인 이아(Oia)를 방문하여 세계적으로 유명한 산토리니 석양을 감상합니다.",
        image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=2070&auto=format&fit=crop"
      },
      {
        day: 5,
        title: "블루 돔 & 해변",
        description: "산토리니의 상징인 블루 돔 교회에서 사진 촬영을 하고, 레드 비치와 블랙 비치를 방문합니다.",
        image: "https://images.unsplash.com/photo-1613395877093-95a5bc58d2c9?q=80&w=2070&auto=format&fit=crop"
      },
      {
        day: 6,
        title: "산토리니 자유 시간",
        description: "산토리니에서 자유 시간을 즐깁니다. 로컬 시장을 방문하거나 해변에서 휴식을 취할 수 있습니다.",
        image: "https://images.unsplash.com/photo-1551621955-83f3fde292c6?q=80&w=2070&auto=format&fit=crop"
      },
      {
        day: 7,
        title: "아테네 귀환",
        description: "산토리니에서 아테네로 돌아옵니다. 마지막 저녁은 전통 그리스 음악과 함께 요리를 즐깁니다.",
        image: "https://images.unsplash.com/photo-1560703650-ef3e0f254ae0?q=80&w=2070&auto=format&fit=crop"
      },
      {
        day: 8,
        title: "아테네 출발",
        description: "아침 식사 후 공항으로 이동하여 한국행 비행기에 탑승합니다.",
        image: "https://images.unsplash.com/photo-1519642918688-7e43b19245d8?q=80&w=2070&auto=format&fit=crop"
      }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1533105079780-52b9be48d077?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555993539-1732b0258235?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2072&auto=format&fit=crop"
    ],
    highlights: ["절경의 산토리니 석양", "이아 마을의 하얀 집과 파란 지붕", "아크로폴리스와 파르테논 신전", "크리스탈 블루 에게해"],
    departureDate: ["2025.06.15", "2025.06.29", "2025.07.13", "2025.07.27", "2025.08.10"]
  },
  {
    id: 8,
    name: "하와이 오아후 & 마우이 7일",
    destination: "오아후 & 마우이, 하와이",
    description: "열대의 파라다이스에서 즐기는 완벽한 휴양",
    price: "4,290,000원",
    image: "https://images.unsplash.com/photo-1483168527879-c66136b56105?q=80&w=2016&auto=format&fit=crop",
    type: "휴양",
    duration: "6박 7일",
    groupSize: "최대 14명",
    meals: "조식 6회, 석식 2회 포함",
    accommodation: "4성급 리조트",
    activities: ["와이키키 비치 투어", "다이아몬드 헤드 트레킹", "진주만 방문", "마우이 로드 투 하나 드라이브", "하와이안 루아우 참석"],
    includes: ["왕복 항공권", "숙박 및 포함된 식사", "공항-호텔 이동", "일정 내 교통편", "가이드 서비스", "여행자 보험"],
    excludes: ["개인 지출", "선택 관광 비용", "포함되지 않은 식사", "일부 액티비티 비용"],
    itinerary: [
      {
        day: 1,
        title: "호놀룰루 도착",
        description: "인천에서 출발하여 호놀룰루 국제공항에 도착합니다. 와이키키 비치의 호텔로 이동하여 체크인 후 휴식을 취합니다.",
        image: "https://images.unsplash.com/photo-1507876466758-bc54f384809a?q=80&w=2070&auto=format&fit=crop"
      },
      {
        day: 2,
        title: "오아후 섬 투어",
        description: "다이아몬드 헤드 하이킹과 하나우마 베이에서 스노클링을 즐깁니다. 선셋 비치에서 하와이 석양을 감상합니다.",
        image: "https://images.unsplash.com/photo-1591152288929-96c889c5be2f?q=80&w=2072&auto=format&fit=crop"
      },
      {
        day: 3,
        title: "진주만 & 시내 탐방",
        description: "진주만을 방문하여 USS 아리조나 기념관을 둘러봅니다. 오후에는 알라 모아나 쇼핑센터에서 쇼핑을 즐깁니다.",
        image: "https://images.unsplash.com/photo-1596394141230-b9595406286a?q=80&w=2070&auto=format&fit=crop"
      },
      {
        day: 4,
        title: "마우이 이동",
        description: "국내선을 타고 마우이 섬으로 이동합니다. 마우이의 숙소에 체크인 후 카아나팔리 비치에서 자유 시간을 갖습니다.",
        image: "https://images.unsplash.com/photo-1542259009477-d625272157b7?q=80&w=2070&auto=format&fit=crop"
      },
      {
        day: 5,
        title: "로드 투 하나",
        description: "세계적으로 유명한 드라이브 코스인 '로드 투 하나'를 따라 마우이 동쪽을 탐험합니다. 폭포와 열대 우림을 감상합니다.",
        image: "https://images.unsplash.com/photo-1551221252-4de0be8cabd4?q=80&w=2070&auto=format&fit=crop"
      },
      {
        day: 6,
        title: "하와이안 루아우",
        description: "마지막 밤은 전통적인 하와이 루아우(파티)에 참석하여 폴리네시안 음식과 춤을 즐깁니다.",
        image: "https://images.unsplash.com/photo-1584495040240-dfa2f4068234?q=80&w=2070&auto=format&fit=crop"
      },
      {
        day: 7,
        title: "마우이 출발",
        description: "아침 식사 후 공항으로 이동하여 호놀룰루를 경유해 한국행 비행기에 탑승합니다.",
        image: "https://images.unsplash.com/photo-1570138453226-ca2a1d44f6c4?q=80&w=2070&auto=format&fit=crop"
      }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1483168527879-c66136b56105?q=80&w=2016&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507876466758-bc54f384809a?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542259009477-d625272157b7?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551221252-4de0be8cabd4?q=80&w=2070&auto=format&fit=crop"
    ],
    highlights: ["와이키키 비치의 서핑", "마우이의 아름다운 자연 경관", "하와이 전통 루아우 체험", "로드 투 하나 드라이브"],
    departureDate: ["2025.06.10", "2025.06.24", "2025.07.08", "2025.07.22", "2025.08.05", "2025.08.19"]
  },
  {
    id: 9,
    name: "캐나다 밴쿠버 & 로키 9일",
    destination: "밴쿠버 & 로키산맥, 캐나다",
    description: "가을 단풍으로 물든 장엄한 로키산맥",
    price: "4,590,000원",
    image: "https://images.unsplash.com/photo-1609825488888-3a928d3f0a54?q=80&w=2072&auto=format&fit=crop",
    type: "관광",
    duration: "8박 9일",
    groupSize: "최대 16명",
    meals: "조식 8회, 중식 3회, 석식 4회 포함",
    accommodation: "4성급 호텔",
    activities: ["밴쿠버 시내 투어", "레이크 루이스 방문", "밴프 국립공원 탐험", "캐나디안 로키 트레킹", "곤돌라 탑승"],
    includes: ["왕복 항공권", "전용 차량", "숙박 및 포함된 식사", "입장료", "전문 가이드", "여행자 보험"],
    excludes: ["개인 지출", "포함되지 않은 식사", "선택 관광", "가이드/기사 팁"],
    itinerary: [
      {
        day: 1,
        title: "밴쿠버 도착",
        description: "인천에서 출발하여 밴쿠버 국제공항에 도착합니다. 호텔 체크인 후 휴식을 취합니다.",
        image: "https://images.unsplash.com/photo-1560814304-4f05b62af116?q=80&w=1974&auto=format&fit=crop"
      },
      {
        day: 2,
        title: "밴쿠버 시내 투어",
        description: "스탠리 파크, 개스타운, 그랜빌 아일랜드 등 밴쿠버의 주요 명소를 방문합니다.",
        image: "https://images.unsplash.com/photo-1559511260-66a654ae982a?q=80&w=2070&auto=format&fit=crop"
      },
      {
        day: 3,
        title: "켈로나 이동",
        description: "밴쿠버에서 오카나간 벨리의 중심 도시인 켈로나로 이동합니다. 와이너리 투어와 시음을 진행합니다.",
        image: "https://images.unsplash.com/photo-1600240642186-89a1e2ad21c5?q=80&w=1974&auto=format&fit=crop"
      },
      {
        day: 4,
        title: "레벨스톡 이동",
        description: "켈로나에서 레벨스톡으로 이동합니다. 노면이 좋은 트랜스 캐나다 하이웨이를 달려 가는 동안, 창밖으로 펼쳐지는 로키산맥의 풍경을 감상합니다.",
        image: "https://images.unsplash.com/photo-1513203943232-175e7252dc17?q=80&w=2070&auto=format&fit=crop"
      },
      {
        day: 5,
        title: "밴프 국립공원",
        description: "레벨스톡에서 밴프로 이동합니다. 밴프 국립공원의 아름다운 자연 경관과 설파 산 곤돌라를 탑승하여 로키산맥의 장관을 감상합니다.",
        image: "https://images.unsplash.com/photo-1609825488888-3a928d3f0a54?q=80&w=2072&auto=format&fit=crop"
      },
      {
        day: 6,
        title: "레이크 루이스 & 모레인 레이크",
        description: "세계적으로 유명한 에메랄드빛 레이크 루이스와 모레인 레이크를 방문합니다. 가을에는 황금빛 단풍으로 둘러싸인 호수를 감상할 수 있습니다.",
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop"
      },
      {
        day: 7,
        title: "재스퍼 국립공원",
        description: "밴프에서 재스퍼 국립공원으로 이동합니다. 아이스필드 파크웨이를 따라 콜롬비아 빙원과 아타바스카 폭포를 방문합니다.",
        image: "https://images.unsplash.com/photo-1566910081753-7d8e8775c266?q=80&w=2070&auto=format&fit=crop"
      },
      {
        day: 8,
        title: "캘거리 이동",
        description: "재스퍼에서 캘거리로 이동합니다. 오후에는 캘거리 시내 관광을 즐기고, 마지막 저녁 식사를 함께 합니다.",
        image: "https://images.unsplash.com/photo-1558963936-3b3c40e0dd2f?q=80&w=2071&auto=format&fit=crop"
      },
      {
        day: 9,
        title: "캘거리 출발",
        description: "아침 식사 후 공항으로 이동하여 한국행 비행기에 탑승합니다.",
        image: "https://images.unsplash.com/photo-1521464302861-ce943915d1c3?q=80&w=1974&auto=format&fit=crop"
      }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1609825488888-3a928d3f0a54?q=80&w=2072&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566910081753-7d8e8775c266?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560814304-4f05b62af116?q=80&w=1974&auto=format&fit=crop"
    ],
    highlights: ["황금빛 가을 단풍의 로키산맥", "에메랄드 빛 레이크 루이스", "밴프 국립공원의 웅장한 풍경", "아이스필드 파크웨이 드라이브"],
    departureDate: ["2025.09.05", "2025.09.19", "2025.10.03", "2025.10.17", "2025.10.31"]
  },
  {
    id: 10,
    name: "교토 단풍 명소 5일",
    destination: "교토, 일본",
    description: "천년 고도의 가을 풍경",
    price: "1,990,000원",
    image: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=2070&auto=format&fit=crop",
    type: "관광",
    duration: "4박 5일",
    groupSize: "최대 10명",
    meals: "조식 4회, 중식 2회 포함",
    accommodation: "4성급 료칸 & 호텔",
    activities: ["아라시야마 대나무 숲", "키요미즈데라 사원", "금각사와 은각사", "후시미 이나리 신사", "청수사"],
    includes: ["왕복 항공권", "공항-호텔 이동", "숙박 및 포함된 식사", "전문 가이드", "입장료"],
    excludes: ["개인 지출", "포함되지 않은 식사", "선택 관광"],
    itinerary: [
      {
        day: 1,
        title: "교토 도착",
        description: "인천에서 출발하여 간사이 국제공항에 도착하고 교토로 이동합니다. 호텔 체크인 후 간단한 저녁 식사를 합니다.",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1950&auto=format&fit=crop"
      },
      {
        day: 2,
        title: "아라시야마 & 금각사",
        description: "아침에는 아라시야마의 대나무 숲을 방문합니다. 단풍으로 물든 대나무 숲의 풍경을 즐깁니다. 오후에는 금각사를 방문하여 호수에 비치는 금빛 사원을 감상합니다.",
        image: "https://images.unsplash.com/photo-1605649461361-83c6fec46988?q=80&w=2069&auto=format&fit=crop"
      },
      {
        day: 3,
        title: "후시미 이나리 & 청수사",
        description: "아침에 후시미 이나리 신사의 붉은 토리이 터널을 방문합니다. 오후에는 청수사(키요미즈데라)에서 단풍과 함께 교토 시내 전경을 감상합니다.",
        image: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=2070&auto=format&fit=crop"
      },
      {
        day: 4,
        title: "은각사 & 철학의 길",
        description: "은각사를 방문하고, 단풍으로 유명한 철학의 길을 산책합니다. 오후에는 기온 거리에서 자유 시간을 갖습니다.",
        image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=2070&auto=format&fit=crop"
      },
      {
        day: 5,
        title: "교토 출발",
        description: "아침 식사 후 간사이 국제공항으로 이동하여 한국행 비행기에 탑승합니다.",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1950&auto=format&fit=crop"
      }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605649461361-83c6fec46988?q=80&w=2069&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1607604760190-ec4e01236324?q=80&w=1974&auto=format&fit=crop"
    ],
    highlights: ["가을 단풍으로 물든 일본 사원", "아라시야마의 대나무 숲", "키요미즈데라에서의 전망", "후시미 이나리의 붉은 토리이"],
    departureDate: ["2025.10.25", "2025.11.01", "2025.11.08", "2025.11.15", "2025.11.22"]
  },
  {
    id: 11,
    name: "핀란드 오로라 헌팅 6일",
    destination: "로바니에미 & 이발로, 핀란드",
    description: "겨울의 마법, 북극광을 찾아서",
    price: "3,490,000원",
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=2070&auto=format&fit=crop",
    type: "어드벤처",
    duration: "5박 6일",
    groupSize: "최대 12명",
    meals: "조식 5회, 석식 3회 포함",
    accommodation: "글래스 이글루 & 4성급 호텔",
    activities: ["오로라 헌팅 투어", "산타 빌리지 방문", "허스키 썰매", "스노모빌 사파리", "겨울 액티비티"],
    includes: ["왕복 항공권", "전용 차량", "숙박 및 포함된 식사", "액티비티 비용", "겨울 장비 대여", "전문 가이드"],
    excludes: ["개인 지출", "포함되지 않은 식사", "선택 관광"],
    itinerary: [
      {
        day: 1,
        title: "헬싱키 도착",
        description: "인천에서 출발하여 핀란드 헬싱키에 도착합니다. 호텔 체크인 후 휴식을 취합니다.",
        image: "https://images.unsplash.com/photo-1559132798-bb6034e659c3?q=80&w=2070&auto=format&fit=crop"
      },
      {
        day: 2,
        title: "로바니에미 이동",
        description: "국내선을 타고 산타클로스의 고향 로바니에미로 이동합니다. 오후에는 산타 빌리지를 방문하여 산타클로스를 만나고 북극권 인증서를 받습니다.",
        image: "https://images.unsplash.com/photo-1543519831-533624555426?q=80&w=2070&auto=format&fit=crop"
      },
      {
        day: 3,
        title: "허스키 사파리 & 오로라 헌팅",
        description: "아침에 허스키 농장을 방문하여 허스키 썰매를 체험합니다. 저녁에는 첫 번째 오로라 헌팅을 떠납니다.",
        image: "https://images.unsplash.com/photo-1579931899163-6005c61916b1?q=80&w=2070&auto=format&fit=crop"
      },
      {
        day: 4,
        title: "이발로 이동 & 글래스 이글루",
        description: "이발로로 이동하여 글래스 이글루에서 하룻밤을 보냅니다. 천장으로 오로라를 감상할 수 있는 특별한 경험을 제공합니다.",
        image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=2070&auto=format&fit=crop"
      },
      {
        day: 5,
        title: "스노모빌 사파리 & 마지막 오로라 헌팅",
        description: "스노모빌을 타고 라플란드의 눈 덮인 숲을 탐험합니다. 저녁에는 마지막 오로라 헌팅을 떠납니다.",
        image: "https://images.unsplash.com/photo-1505147607375-9a0134828270?q=80&w=2070&auto=format&fit=crop"
      },
      {
        day: 6,
        title: "헬싱키 경유 귀국",
        description: "아침 식사 후 로바니에미에서 헬싱키를 경유하여 한국행 비행기에 탑승합니다.",
        image: "https://images.unsplash.com/photo-1522885147691-06d859633fb8?q=80&w=2070&auto=format&fit=crop"
      }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579931899163-6005c61916b1?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1543519831-533624555426?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505147607375-9a0134828270?q=80&w=2070&auto=format&fit=crop"
    ],
    highlights: ["밤하늘의 오로라 감상", "글래스 이글루 숙박 체험", "산타클로스 만나기", "허스키 & 스노모빌 체험"],
    departureDate: ["2025.12.05", "2025.12.12", "2025.12.19", "2025.12.26", "2026.01.02", "2026.01.09"]
  },
  {
    id: 12,
    name: "홋카이도 스키 & 온천 5일",
    destination: "니세코 & 삿포로, 일본",
    description: "파우더 스노우와 온천을 함께 즐기는 일본 겨울 여행",
    price: "2,190,000원",
    image: "https://images.unsplash.com/photo-1548092372-6d990a13f182?q=80&w=2070&auto=format&fit=crop",
    type: "어드벤처",
    duration: "4박 5일",
    groupSize: "최대 12명",
    meals: "조식 4회, 석식 2회 포함",
    accommodation: "온천 료칸 & 스키 리조트",
    activities: ["니세코 스키", "유노카와 온천", "삿포로 맥주 박물관", "오타루 운하 관광", "홋카이도 해산물 요리"],
    includes: ["왕복 항공권", "공항-호텔 이동", "숙박 및 포함된 식사", "리프트 티켓 2일권", "장비 렌탈 (기본)", "온천 입장료"],
    excludes: ["개인 지출", "선택 관광", "스키 수업비", "고급 장비 렌탈 추가비용"],
    itinerary: [
      {
        day: 1,
        title: "삿포로 도착",
        description: "인천에서 출발하여 삿포로 신치토세 공항에 도착합니다. 니세코의 스키 리조트로 이동하여 체크인 합니다.",
        image: "https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=2025&auto=format&fit=crop"
      },
      {
        day: 2,
        title: "니세코 스키 & 온천",
        description: "아침부터 니세코의 유명한 파우더 스노우에서 스키 또는 스노보드를 즐깁니다. 저녁에는 온천에서 하루의 피로를 풀어줍니다.",
        image: "https://images.unsplash.com/photo-1548092372-6d990a13f182?q=80&w=2070&auto=format&fit=crop"
      },
      {
        day: 3,
        title: "스키 & 유노카와 온천",
        description: "오전에 스키를 즐기고, 오후에는 유노카와 온천으로 이동합니다. 온천 료칸에서 숙박하며 정통 일본 요리를 경험합니다.",
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop"
      },
      {
        day: 4,
        title: "오타루 & 삿포로",
        description: "오타루 운하와 유리공예 거리를 방문합니다. 오후에는 삿포로로 이동하여 시내 관광과 홋카이도 맥주 박물관을 방문합니다.",
        image: "https://images.unsplash.com/photo-1576738264166-b11d2a2df33e?q=80&w=2070&auto=format&fit=crop"
      },
      {
        day: 5,
        title: "삿포로 출발",
        description: "아침 식사 후 시간이 허락하면 간단한 쇼핑을 하고 공항으로 이동하여 한국행 비행기에 탑승합니다.",
        image: "https://images.unsplash.com/photo-1580749590029-281a788ece60?q=80&w=2070&auto=format&fit=crop"
      }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1548092372-6d990a13f182?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1576738264166-b11d2a2df33e?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=2025&auto=format&fit=crop"
    ],
    highlights: ["세계적인 파우더 스노우", "일본 온천 료칸 체험", "홋카이도 신선한 해산물 요리", "오타루의 운하와 유리공예"],
    departureDate: ["2025.12.10", "2025.12.24", "2026.01.07", "2026.01.21", "2026.02.04", "2026.02.18"]
  }
];

// 패키지 ID로 패키지 데이터 가져오기
export function getPackageById(id: string | string[]): TravelPackage | undefined {
  const packageId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
  return packagesData.find(pkg => pkg.id === packageId);
}

// 패키지 기능 아이콘 매핑
export const packageFeatures = [
  { icon: Calendar, label: "기간" },
  { icon: MapPin, label: "목적지" },
  { icon: Clock, label: "일정" },
  { icon: Users, label: "그룹 크기" },
  { icon: Utensils, label: "식사" },
  { icon: Home, label: "숙박" },
  { icon: Camera, label: "액티비티" },
  { icon: Plane, label: "교통" }
];

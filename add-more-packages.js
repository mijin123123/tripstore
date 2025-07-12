const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

console.log('=== 50개 추가 해외여행 패키지 등록 ===\n');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// 50개 추가 해외여행 패키지 데이터
const additionalPackages = [
  // 아시아 패키지 (15개)
  {
    title: "태국 방콕 & 푸켓 6박 8일",
    description: "왕궁과 사원이 어우러진 방콕과 아름다운 해변의 푸켓을 함께 즐기는 환상적인 태국 여행.",
    destination: "태국",
    price: 1890000,
    duration: 8,
    category: "휴양/문화",
    image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1740"
  },
  {
    title: "싱가포르 모던시티 투어 3박 5일",
    description: "마리나 베이 샌즈, 가든스 바이 더 베이 등 미래도시 싱가포르의 모든 것을 경험하세요.",
    destination: "싱가포르",
    price: 1690000,
    duration: 5,
    category: "도시탐방",
    image_url: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1752"
  },
  {
    title: "홍콩 야경과 딤섬 투어 3박 4일",
    description: "세계 3대 야경과 정통 딤섬, 쇼핑의 천국 홍콩에서의 완벽한 휴가.",
    destination: "홍콩",
    price: 1490000,
    duration: 4,
    category: "도시탐방",
    image_url: "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?q=80&w=1749"
  },
  {
    title: "베트남 하롱베이 크루즈 4박 6일",
    description: "유네스코 세계문화유산 하롱베이에서의 크루즈와 하노이 구시가지 탐방.",
    destination: "베트남",
    price: 1390000,
    duration: 6,
    category: "자연/문화",
    image_url: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=1740"
  },
  {
    title: "말레이시아 쿠알라룸푸르 & 랑카위 5박 7일",
    description: "페트로나스 트윈타워의 도시와 열대 낙원 랑카위를 모두 즐기는 여행.",
    destination: "말레이시아",
    price: 1590000,
    duration: 7,
    category: "도시/휴양",
    image_url: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=1740"
  },
  {
    title: "필리핀 보라카이 휴양 4박 6일",
    description: "세계에서 가장 아름다운 해변 중 하나인 보라카이에서의 완벽한 휴양.",
    destination: "필리핀",
    price: 1290000,
    duration: 6,
    category: "휴양",
    image_url: "https://images.unsplash.com/photo-1573790387438-4da905039392?q=80&w=1925"
  },
  {
    title: "인도 골든 트라이앵글 6박 8일",
    description: "델리, 아гра, 자이푸르를 연결하는 인도의 핵심 관광코스와 타지마할 관람.",
    destination: "인도",
    price: 2190000,
    duration: 8,
    category: "역사문화",
    image_url: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1771"
  },
  {
    title: "네팔 히말라야 트레킹 7박 9일",
    description: "세계의 지붕 히말라야에서의 트레킹과 카트만두 문화유산 탐방.",
    destination: "네팔",
    price: 2490000,
    duration: 9,
    category: "어드벤처",
    image_url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1742"
  },
  {
    title: "미얀마 바간 & 양곤 5박 7일",
    description: "수천 개의 파고다가 펼쳐진 바간 평원과 황금빛 쉐다곤 파고다 탐방.",
    destination: "미얀마",
    price: 1890000,
    duration: 7,
    category: "역사문화",
    image_url: "https://images.unsplash.com/photo-1555993539-1732b0258235?q=80&w=1740"
  },
  {
    title: "스리랑카 문화유산 투어 6박 8일",
    description: "고대 왕국의 유적지와 아름다운 차 농장, 야생동물 사파리까지.",
    destination: "스리랑카",
    price: 1990000,
    duration: 8,
    category: "문화/자연",
    image_url: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?q=80&w=1742"
  },
  {
    title: "캄보디아 앙코르와트 4박 6일",
    description: "세계 최대 규모의 종교 건축물 앙코르와트와 크메르 문명 탐방.",
    destination: "캄보디아",
    price: 1690000,
    duration: 6,
    category: "역사문화",
    image_url: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6b?q=80&w=1740"
  },
  {
    title: "라오스 루앙프라방 힐링 5박 7일",
    description: "유네스코 세계문화유산 도시에서의 명상과 메콩강 크루즈.",
    destination: "라오스",
    price: 1790000,
    duration: 7,
    category: "힐링/문화",
    image_url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1742"
  },
  {
    title: "몰디브 럭셔리 리조트 5박 7일",
    description: "인도양의 진주 몰디브에서 오버워터 빌라와 스노클링의 꿈같은 시간.",
    destination: "몰디브",
    price: 4990000,
    duration: 7,
    category: "럭셔리 휴양",
    image_url: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?q=80&w=1740"
  },
  {
    title: "우즈베키스탄 실크로드 7박 9일",
    description: "사마르칸드, 부하라, 타슈켄트의 실크로드 문명과 이슬람 건축의 걸작들.",
    destination: "우즈베키스탄",
    price: 2890000,
    duration: 9,
    category: "역사문화",
    image_url: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?q=80&w=1740"
  },
  {
    title: "조지아 & 아르메니아 8박 10일",
    description: "코카서스 산맥의 숨겨진 보석, 와인의 발상지와 고대 기독교 문화 탐방.",
    destination: "조지아/아르메니아",
    price: 3290000,
    duration: 10,
    category: "문화탐방",
    image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1740"
  },

  // 유럽 패키지 (20개)
  {
    title: "그리스 산토리니 & 미코노스 6박 8일",
    description: "에게해의 보석 같은 섬들에서 즐기는 낭만적인 그리스 아일랜드 호핑.",
    destination: "그리스",
    price: 3490000,
    duration: 8,
    category: "휴양/문화",
    image_url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1744"
  },
  {
    title: "터키 이스탄불 & 카파도키아 7박 9일",
    description: "동서양이 만나는 이스탄불과 기암괴석의 카파도키아 열기구 투어.",
    destination: "터키",
    price: 2890000,
    duration: 9,
    category: "문화/자연",
    image_url: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=1742"
  },
  {
    title: "크로아티아 아드리아해 크루즈 8박 10일",
    description: "두브로브니크, 스플리트 등 아드리아해 연안의 아름다운 도시들을 크루즈로.",
    destination: "크로아티아",
    price: 4190000,
    duration: 10,
    category: "크루즈/자연",
    image_url: "https://images.unsplash.com/photo-1555993539-1732b0258235?q=80&w=1740"
  },
  {
    title: "체코 프라하 동화 속 여행 4박 6일",
    description: "중세 유럽의 모습이 그대로 남아있는 프라하의 성과 광장, 맥주 투어.",
    destination: "체코",
    price: 2290000,
    duration: 6,
    category: "역사문화",
    image_url: "https://images.unsplash.com/photo-1541849546-216549ae216d?q=80&w=1740"
  },
  {
    title: "헝가리 부다페스트 온천 투어 4박 6일",
    description: "도나우강의 진주 부다페스트와 세계적으로 유명한 온천욕 체험.",
    destination: "헝가리",
    price: 2190000,
    duration: 6,
    category: "휴양/문화",
    image_url: "https://images.unsplash.com/photo-1541849546-216549ae216d?q=80&w=1740"
  },
  {
    title: "폴란드 크라쿠프 & 바르샤바 5박 7일",
    description: "중세 도시 크라쿠프와 재건된 수도 바르샤바, 아우슈비츠 역사 탐방.",
    destination: "폴란드",
    price: 2490000,
    duration: 7,
    category: "역사문화",
    image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1740"
  },
  {
    title: "오스트리아 빈 & 잘츠부르크 5박 7일",
    description: "음악의 도시 빈과 모차르트의 고향 잘츠부르크, 클래식 음악 여행.",
    destination: "오스트리아",
    price: 2890000,
    duration: 7,
    category: "문화/예술",
    image_url: "https://images.unsplash.com/photo-1516550135131-fe3dcb0bedc7?q=80&w=1740"
  },
  {
    title: "스위스 융프라우 알프스 6박 8일",
    description: "유럽의 지붕 융프라우와 인터라켄, 마터호른의 절경을 만나는 알프스 여행.",
    destination: "스위스",
    price: 4590000,
    duration: 8,
    category: "자연/관광",
    image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1740"
  },
  {
    title: "네덜란드 튤립 시즌 투어 4박 6일",
    description: "쾨켄호프 튤립 정원과 암스테르담 운하, 풍차마을 잔세스칸스 투어.",
    destination: "네덜란드",
    price: 2690000,
    duration: 6,
    category: "자연/문화",
    image_url: "https://images.unsplash.com/photo-1464851707681-f9d5fdaccea8?q=80&w=1740"
  },
  {
    title: "벨기에 브뤼셀 & 브뤼헤 3박 5일",
    description: "유럽연합의 수도 브뤼셀과 중세도시 브뤼헤, 초콜릿과 와플의 본고장.",
    destination: "벨기에",
    price: 2190000,
    duration: 5,
    category: "문화/미식",
    image_url: "https://images.unsplash.com/photo-1515489942312-73dac6b5c79d?q=80&w=1740"
  },
  {
    title: "덴마크 코펜하겐 북유럽 디자인 4박 6일",
    description: "안데르센의 나라 덴마크와 스칸디나비아 디자인, 힘겔 문화 체험.",
    destination: "덴마크",
    price: 3290000,
    duration: 6,
    category: "문화/디자인",
    image_url: "https://images.unsplash.com/photo-1578527956514-adf3c6ac3e99?q=80&w=1740"
  },
  {
    title: "노르웨이 피요르드 크루즈 7박 9일",
    description: "게이랑에르 피요르드와 노르웨이 전통 문화, 오로라 관측 투어.",
    destination: "노르웨이",
    price: 4890000,
    duration: 9,
    category: "자연/크루즈",
    image_url: "https://images.unsplash.com/photo-1501436513145-30f24e19fcc4?q=80&w=1740"
  },
  {
    title: "스웨덴 스톡홀름 & 고틀란드 5박 7일",
    description: "북방의 베니스 스톡홀름과 중세 한자도시 비스비, 바이킹 문화 탐방.",
    destination: "스웨덴",
    price: 3590000,
    duration: 7,
    category: "문화/역사",
    image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1742"
  },
  {
    title: "핀란드 헬싱키 & 라플란드 6박 8일",
    description: "북극권 라플란드에서 오로라 관측과 산타클로스 마을, 순록 썰매 체험.",
    destination: "핀란드",
    price: 4290000,
    duration: 8,
    category: "자연/체험",
    image_url: "https://images.unsplash.com/photo-1578528387385-74a963d1d261?q=80&w=1740"
  },
  {
    title: "아이슬란드 링로드 일주 8박 10일",
    description: "화산과 빙하, 간헐천과 오로라의 나라 아이슬란드 대자연 일주.",
    destination: "아이슬란드",
    price: 5290000,
    duration: 10,
    category: "자연/어드벤처",
    image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1740"
  },
  {
    title: "포르투갈 리스본 & 포르투 6박 8일",
    description: "대항해시대의 영광과 포르토 와인, 파두 음악이 흐르는 포르투갈 여행.",
    destination: "포르투갈",
    price: 2890000,
    duration: 8,
    category: "문화/역사",
    image_url: "https://images.unsplash.com/photo-1564419320461-6870880221ad?q=80&w=1740"
  },
  {
    title: "몰타 지중해 보석섬 5박 7일",
    description: "기사단의 역사와 지중해의 푸른 바다, 바로크 건축의 아름다운 섬.",
    destination: "몰타",
    price: 2690000,
    duration: 7,
    category: "휴양/문화",
    image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1744"
  },
  {
    title: "루마니아 트란실바니아 6박 8일",
    description: "드라큘라 성과 중세 도시 브라쇼브, 시기쇼아라의 고딕 건축 탐방.",
    destination: "루마니아",
    price: 2490000,
    duration: 8,
    category: "역사/문화",
    image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1740"
  },
  {
    title: "불가리아 소피아 & 플로브디프 5박 7일",
    description: "발칸반도의 숨겨진 보석, 장미의 나라 불가리아와 트라키아 문명 탐방.",
    destination: "불가리아",
    price: 2190000,
    duration: 7,
    category: "문화/자연",
    image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1740"
  },
  {
    title: "세르비아 베오그라드 & 노비사드 4박 6일",
    description: "도나우강과 사바강이 만나는 베오그라드와 보헤미안 도시 노비사드.",
    destination: "세르비아",
    price: 1990000,
    duration: 6,
    category: "문화탐방",
    image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1740"
  },

  // 아메리카 패키지 (10개)
  {
    title: "캐나다 밴쿠버 & 토론토 7박 9일",
    description: "자연의 도시 밴쿠버와 다문화 도시 토론토, 나이아가라 폭포 관광.",
    destination: "캐나다",
    price: 3890000,
    duration: 9,
    category: "자연/도시",
    image_url: "https://images.unsplash.com/photo-1517935706615-2717063c2225?q=80&w=1742"
  },
  {
    title: "브라질 리우데자네이루 & 이과수 6박 8일",
    description: "리우 카니발과 코파카바나 해변, 세계 최대 이과수 폭포의 장관.",
    destination: "브라질",
    price: 4590000,
    duration: 8,
    category: "문화/자연",
    image_url: "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?q=80&w=1926"
  },
  {
    title: "아르헨티나 부에노스아이레스 & 우수아이아 8박 10일",
    description: "탱고의 수도 부에노스아이레스와 세계 끝 도시 우수아이아, 파타고니아 탐험.",
    destination: "아르헨티나",
    price: 5290000,
    duration: 10,
    category: "문화/자연",
    image_url: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=1740"
  },
  {
    title: "칠레 산티아고 & 발파라이소 6박 8일",
    description: "안데스 산맥의 수도 산티아고와 태평양 항구도시 발파라이소, 와인 투어.",
    destination: "칠레",
    price: 4890000,
    duration: 8,
    category: "문화/자연",
    image_url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1742"
  },
  {
    title: "페루 마추픽추 & 쿠스코 5박 7일",
    description: "잉카 문명의 신비 마추픽추와 고산도시 쿠스코, 안데스 문화 체험.",
    destination: "페루",
    price: 3890000,
    duration: 7,
    category: "역사/문화",
    image_url: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1740"
  },
  {
    title: "멕시코 칸쿤 & 치첸이트사 5박 7일",
    description: "카리브해의 휴양지 칸쿤과 마야 문명의 유적 치첸이트사 탐방.",
    destination: "멕시코",
    price: 2890000,
    duration: 7,
    category: "휴양/문화",
    image_url: "https://images.unsplash.com/photo-1562967916-eb82221dfb92?q=80&w=1742"
  },
  {
    title: "코스타리카 생태관광 6박 8일",
    description: "중남미 생태관광의 메카, 야생동물과 화산, 온천이 어우러진 자연 여행.",
    destination: "코스타리카",
    price: 3590000,
    duration: 8,
    category: "생태관광",
    image_url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1742"
  },
  {
    title: "쿠바 하바나 클래식카 투어 6박 8일",
    description: "시간이 멈춘 도시 하바나와 클래식카, 살사 음악과 시가의 나라.",
    destination: "쿠바",
    price: 3290000,
    duration: 8,
    category: "문화/음악",
    image_url: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=1740"
  },
  {
    title: "콜롬비아 카르타헤나 & 보고타 6박 8일",
    description: "카리브해 식민도시 카르타헤나와 고원의 수도 보고타, 커피 농장 투어.",
    destination: "콜롬비아",
    price: 3790000,
    duration: 8,
    category: "문화/자연",
    image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1740"
  },
  {
    title: "에콰도르 갈라파고스 크루즈 7박 9일",
    description: "진화론의 섬 갈라파고스에서의 크루즈와 키토 구시가지 탐방.",
    destination: "에콰도르",
    price: 6990000,
    duration: 9,
    category: "생태/크루즈",
    image_url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1742"
  },

  // 아프리카 & 오세아니아 패키지 (5개)
  {
    title: "모로코 마라케시 & 사하라 사막 6박 8일",
    description: "붉은 도시 마라케시와 사하라 사막 캠핑, 베르베르 문화 체험.",
    destination: "모로코",
    price: 2890000,
    duration: 8,
    category: "문화/어드벤처",
    image_url: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6b?q=80&w=1740"
  },
  {
    title: "이집트 카이로 & 룩소르 6박 8일",
    description: "파라오의 나라 이집트, 피라미드와 스핑크스, 나일강 크루즈.",
    destination: "이집트",
    price: 3290000,
    duration: 8,
    category: "역사/문화",
    image_url: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6b?q=80&w=1740"
  },
  {
    title: "남아프리카공화국 사파리 7박 9일",
    description: "크루거 국립공원에서의 빅파이브 사파리와 케이프타운 와인랜드 투어.",
    destination: "남아프리카공화국",
    price: 4890000,
    duration: 9,
    category: "사파리/자연",
    image_url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1742"
  },
  {
    title: "호주 시드니 & 멜버른 7박 9일",
    description: "오페라하우스의 시드니와 문화의 도시 멜버른, 그레이트 오션 로드.",
    destination: "호주",
    price: 4590000,
    duration: 9,
    category: "도시/자연",
    image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1740"
  },
  {
    title: "뉴질랜드 남북섬 일주 9박 11일",
    description: "반지의 제왕 촬영지와 피오르드랜드, 로토루아 온천의 뉴질랜드 대자연.",
    destination: "뉴질랜드",
    price: 5890000,
    duration: 11,
    category: "자연/영화",
    image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1740"
  }
];

async function addMorePackages() {
  try {
    console.log('1. 기존 패키지 개수 확인...');
    const { data: existingPackages, error: countError } = await supabase
      .from('packages')
      .select('id')
      .order('id', { ascending: false })
      .limit(1);
    
    if (countError) {
      console.error('❌ 기존 데이터 조회 실패:', countError);
      return;
    }
    
    const lastId = existingPackages?.[0]?.id || 8;
    console.log(`✅ 마지막 패키지 ID: ${lastId}`);
    
    console.log('\n2. 50개 추가 패키지 데이터 준비...');
    // ID를 순차적으로 할당
    const packagesWithIds = additionalPackages.map((pkg, index) => ({
      ...pkg,
      id: lastId + index + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
    
    console.log('\n3. 새로운 패키지 데이터 삽입...');
    const { data, error: insertError } = await supabase
      .from('packages')
      .insert(packagesWithIds);
    
    if (insertError) {
      console.error('❌ 새 데이터 삽입 실패:', insertError);
      return;
    }
    
    console.log('✅ 50개 추가 패키지 데이터 삽입 완료');
    
    console.log('\n4. 전체 패키지 개수 확인...');
    const { data: allPackages, error: selectError } = await supabase
      .from('packages')
      .select('id, title, destination, price')
      .order('id');
    
    if (selectError) {
      console.error('❌ 데이터 조회 실패:', selectError);
      return;
    }
    
    console.log(`\n🎉 총 ${allPackages.length}개의 해외여행 패키지가 등록되었습니다!`);
    
    // 대륙별 분류
    const continents = {
      '아시아': 0,
      '유럽': 0,
      '아메리카': 0,
      '아프리카/오세아니아': 0
    };
    
    allPackages.forEach(pkg => {
      if (['태국', '싱가포르', '홍콩', '베트남', '말레이시아', '필리핀', '인도', '네팔', '미얀마', '스리랑카', '캄보디아', '라오스', '몰디브', '우즈베키스탄', '일본', '인도네시아'].includes(pkg.destination)) {
        continents['아시아']++;
      } else if (['프랑스', '스페인', '이탈리아', '영국', '독일', '그리스', '터키', '크로아티아', '체코', '헝가리', '폴란드', '오스트리아', '스위스', '네덜란드', '벨기에', '덴마크', '노르웨이', '스웨덴', '핀란드', '아이슬란드', '포르투갈', '몰타', '루마니아', '불가리아', '세르비아', '조지아/아르메니아'].includes(pkg.destination)) {
        continents['유럽']++;
      } else if (['미국', '캐나다', '브라질', '아르헨티나', '칠레', '페루', '멕시코', '코스타리카', '쿠바', '콜롬비아', '에콰도르'].includes(pkg.destination)) {
        continents['아메리카']++;
      } else {
        continents['아프리카/오세아니아']++;
      }
    });
    
    console.log('\n📊 대륙별 패키지 분포:');
    Object.entries(continents).forEach(([continent, count]) => {
      console.log(`   ${continent}: ${count}개`);
    });
    
    console.log('\n💰 가격대별 분포:');
    const priceRanges = {
      '100만원 미만': allPackages.filter(p => p.price < 1000000).length,
      '100-200만원': allPackages.filter(p => p.price >= 1000000 && p.price < 2000000).length,
      '200-300만원': allPackages.filter(p => p.price >= 2000000 && p.price < 3000000).length,
      '300-400만원': allPackages.filter(p => p.price >= 3000000 && p.price < 4000000).length,
      '400-500만원': allPackages.filter(p => p.price >= 4000000 && p.price < 5000000).length,
      '500만원 이상': allPackages.filter(p => p.price >= 5000000).length
    };
    
    Object.entries(priceRanges).forEach(([range, count]) => {
      console.log(`   ${range}: ${count}개`);
    });
    
    console.log('\n🌍 이제 전 세계 58개 여행지의 다양한 패키지를 제공하는 글로벌 여행사가 되었습니다!');
    
  } catch (err) {
    console.error('❌ 패키지 추가 실패:', err.message);
  }
}

addMorePackages();

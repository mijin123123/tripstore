// 임시 패키지 데이터 (데이터베이스 연결 전까지 사용)
export const packagesData = [
  {
    id: '1',
    title: '제주도 힐링 여행 3일',
    description: '아름다운 자연과 독특한 문화를 간직한 제주도에서 힐링과 관광을 동시에 즐기는 국내 여행입니다.',
    destination: '제주도',
    duration: 3,
    price: 450000,
    departure_date: '2025-09-15',
    return_date: '2025-09-17',
    max_people: 20,
    current_bookings: 6,
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    includes: ['왕복 항공료', '4성급 호텔 2박', '렌터카', '전문 가이드', '조식 2회'],
    excludes: ['점심/저녁 식사', '개인 경비', '입장료', '주유비'],
    itinerary: '1일차: 김포공항 출발 → 제주공항 도착 → 성산일출봉 → 섭지코지\n2일차: 한라산 둘레길 → 천지연폭포 → 중문 관광단지\n3일차: 협재해수욕장 → 제주민속촌 → 제주공항 출발 → 김포공항 도착'
  },
  {
    id: '2',
    title: '방콕 & 파타야 힐링 여행 6일',
    description: '태국의 매력적인 두 도시 방콕과 파타야에서 휴식과 관광을 동시에 즐길 수 있는 완벽한 패키지입니다.',
    destination: '태국 방콕/파타야',
    duration: 6,
    price: 980000,
    departure_date: '2025-09-15',
    return_date: '2025-09-20',
    max_people: 25,
    current_bookings: 8,
    image_url: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800',
    includes: ['왕복 항공료', '4성급 호텔 5박', '전문 가이드', '조식 5회', '공항 픽업/샌딩', '시내 관광'],
    excludes: ['점심/저녁 식사', '개인 경비', '마사지', '선택 관광'],
    itinerary: '1일차: 인천공항 출발 → 수완나품공항 도착 → 방콕 시내 관광\n2일차: 왕궁 → 왓포 사원 → 차오프라야 강 투어\n3일차: 방콕 → 파타야 이동 → 비치 휴식\n4일차: 코랄섬 투어 → 워킹스트리트\n5일차: 파타야 → 방콕 이동 → 쇼핑\n6일차: 자유시간 → 수완나품공항 출발 → 인천공항 도착'
  }
];

export default packagesData;

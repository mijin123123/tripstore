// API 테스트 - Mock 데이터만으로 동작 확인
const mockPackages = [
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
  }
];

console.log('=== Mock 데이터 JSON 직렬화 테스트 ===');

try {
  const jsonString = JSON.stringify(mockPackages);
  console.log('✅ JSON 직렬화 성공');
  console.log('데이터 길이:', jsonString.length);
  console.log('첫 번째 패키지:', mockPackages[0].title);
  
  const parsed = JSON.parse(jsonString);
  console.log('✅ JSON 파싱 성공');
  console.log('파싱된 패키지 개수:', parsed.length);
  
} catch (error) {
  console.error('❌ JSON 직렬화/파싱 실패:', error.message);
}

console.log('\n=== 각 필드 타입 확인 ===');
const firstPackage = mockPackages[0];
Object.keys(firstPackage).forEach(key => {
  const value = firstPackage[key];
  const type = typeof value;
  console.log(`${key}: ${type} - ${value}`);
});

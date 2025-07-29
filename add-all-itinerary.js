// 다른 패키지들에 일정 추가
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ihhnvmzizaiokrfkatwt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloaG52bXppemFpb2tyZmthdHd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwODg1OTksImV4cCI6MjA2ODY2NDU5OX0.wfwap5L5VIh4LUK7MS_Yrbq4ulS9APj2mkcJUufj8No';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function addItineraryToAllPackages() {
  try {
    console.log('모든 패키지에 일정 추가 중...');
    
    // 일정이 없거나 비어있는 패키지들 가져오기
    const { data: packages, error: fetchError } = await supabase
      .from('packages')
      .select('id, title, itinerary, type')
      .limit(10);
    
    if (fetchError) throw fetchError;
    
    for (const pkg of packages) {
      // 일정이 없거나 비어있는 경우에만 추가
      if (!pkg.itinerary || !Array.isArray(pkg.itinerary) || pkg.itinerary.length === 0) {
        console.log('일정 추가 중:', pkg.title);
        
        let sampleItinerary;
        
        if (pkg.type === 'domestic') {
          // 국내 여행 일정
          sampleItinerary = [
            {
              day: 1,
              title: "체크인 및 자유시간",
              description: "호텔 체크인 후 주변 탐방 및 휴식. 근처 맛집이나 카페를 방문하며 여행의 시작을 만끽합니다.",
              accommodation: "선택하신 호텔",
              meals: { breakfast: false, lunch: false, dinner: true }
            },
            {
              day: 2,
              title: "관광 및 체험",
              description: "주요 관광지 방문 및 현지 체험 활동. 지역 특색을 살린 다양한 액티비티를 즐기며 특별한 추억을 만듭니다.",
              accommodation: "선택하신 호텔",
              meals: { breakfast: true, lunch: false, dinner: false }
            },
            {
              day: 3,
              title: "체크아웃",
              description: "호텔 체크아웃 후 마지막 관광 또는 쇼핑. 아쉬운 마음으로 집으로 돌아갑니다.",
              accommodation: "",
              meals: { breakfast: true, lunch: false, dinner: false }
            }
          ];
        } else if (pkg.type === 'overseas') {
          // 해외 여행 일정
          sampleItinerary = [
            {
              day: 1,
              title: "출발 및 현지 도착",
              description: "인천국제공항에서 출발하여 현지 도착. 공항에서 호텔로 이동하여 체크인 후 간단한 주변 탐방.",
              accommodation: "현지 4성급 호텔",
              meals: { breakfast: false, lunch: false, dinner: true }
            },
            {
              day: 2,
              title: "시티투어",
              description: "현지 가이드와 함께하는 시티투어. 주요 관광명소를 방문하며 현지 문화와 역사를 체험합니다.",
              accommodation: "현지 4성급 호텔",
              meals: { breakfast: true, lunch: true, dinner: false }
            },
            {
              day: 3,
              title: "자유시간 및 쇼핑",
              description: "자유시간을 통해 개별 관광이나 쇼핑을 즐깁니다. 현지 전통 시장이나 쇼핑몰을 방문하며 기념품을 구입합니다.",
              accommodation: "현지 4성급 호텔",
              meals: { breakfast: true, lunch: false, dinner: false }
            },
            {
              day: 4,
              title: "출발 및 귀국",
              description: "호텔 체크아웃 후 공항으로 이동. 현지에서 출발하여 인천국제공항 도착 후 각자 해산.",
              accommodation: "",
              meals: { breakfast: true, lunch: false, dinner: false }
            }
          ];
        } else {
          // 럭셔리 여행 일정
          sampleItinerary = [
            {
              day: 1,
              title: "프리미엄 도착 및 환영",
              description: "VIP 라운지 이용 후 프리미엄 항공편으로 출발. 현지 도착 후 전용 차량으로 럭셔리 호텔 이동 및 웰컴 디너.",
              accommodation: "5성급 럭셔리 호텔",
              meals: { breakfast: false, lunch: false, dinner: true }
            },
            {
              day: 2,
              title: "프라이빗 투어",
              description: "전용 가이드와 함께하는 프라이빗 투어. 일반 관광객들이 가지 못하는 특별한 장소를 방문하며 VIP 체험을 즐깁니다.",
              accommodation: "5성급 럭셔리 호텔",
              meals: { breakfast: true, lunch: true, dinner: true }
            },
            {
              day: 3,
              title: "스페셜 체험",
              description: "현지 특색을 살린 프리미엄 체험 활동. 미슐랭 레스토랑에서의 식사와 특별한 문화 체험을 즐깁니다.",
              accommodation: "5성급 럭셔리 호텔",
              meals: { breakfast: true, lunch: true, dinner: true }
            },
            {
              day: 4,
              title: "럭셔리 귀국",
              description: "호텔에서 늦은 체크아웃 후 VIP 라운지 이용. 비즈니스 클래스 또는 퍼스트 클래스로 편안한 귀국.",
              accommodation: "",
              meals: { breakfast: true, lunch: false, dinner: false }
            }
          ];
        }
        
        // 패키지 일정 업데이트
        const { error } = await supabase
          .from('packages')
          .update({
            itinerary: sampleItinerary
          })
          .eq('id', pkg.id);
        
        if (error) {
          console.error('일정 추가 실패:', pkg.title, error.message);
        } else {
          console.log('일정 추가 성공:', pkg.title);
        }
      } else {
        console.log('일정이 이미 있음:', pkg.title);
      }
    }
    
    console.log('모든 패키지 일정 업데이트 완료!');
    
  } catch (error) {
    console.error('오류 발생:', error.message);
  }
}

addItineraryToAllPackages();

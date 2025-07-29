// 패키지 일정 추가 스크립트
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ihhnvmzizaiokrfkatwt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloaG52bXppemFpb2tyZmthdHd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwODg1OTksImV4cCI6MjA2ODY2NDU5OX0.wfwap5L5VIh4LUK7MS_Yrbq4ulS9APj2mkcJUufj8No';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function addItineraryToPackage() {
  try {
    console.log('패키지에 일정 추가 중...');
    
    // 첫 번째 패키지 가져오기
    const { data: packages, error: fetchError } = await supabase
      .from('packages')
      .select('id, title, itinerary')
      .limit(1);
    
    if (fetchError) throw fetchError;
    
    if (packages && packages.length > 0) {
      const pkg = packages[0];
      console.log('수정할 패키지:', pkg.title, '(ID:', pkg.id + ')');
      
      // 샘플 일정 데이터
      const sampleItinerary = [
        {
          day: 1,
          title: "출발 및 도착",
          description: "인천공항에서 출발하여 현지 도착. 공항에서 호텔로 이동하여 체크인 후 자유시간.",
          accommodation: "현지 4성급 호텔",
          meals: {
            breakfast: false,
            lunch: false,
            dinner: true
          }
        },
        {
          day: 2,
          title: "시티투어 및 관광",
          description: "주요 관광지 방문 및 현지 문화 체험. 가이드와 함께 하는 시티투어로 명소들을 둘러보며 현지 음식을 맛봅니다.",
          accommodation: "현지 4성급 호텔",
          meals: {
            breakfast: true,
            lunch: true,
            dinner: false
          }
        },
        {
          day: 3,
          title: "자유시간 및 쇼핑",
          description: "자유시간을 통해 개별 관광이나 쇼핑을 즐기고, 오후에는 현지 전통 시장 방문.",
          accommodation: "현지 4성급 호텔",
          meals: {
            breakfast: true,
            lunch: false,
            dinner: false
          }
        },
        {
          day: 4,
          title: "출발 및 귀국",
          description: "호텔 체크아웃 후 공항으로 이동. 현지 출발하여 인천공항 도착.",
          accommodation: "",
          meals: {
            breakfast: true,
            lunch: false,
            dinner: false
          }
        }
      ];
      
      // 패키지 일정 업데이트
      const { data, error } = await supabase
        .from('packages')
        .update({
          itinerary: sampleItinerary
        })
        .eq('id', pkg.id)
        .select();
      
      if (error) throw error;
      
      console.log('일정 추가 성공!');
      console.log('업데이트된 데이터:', data);
      
    } else {
      console.log('패키지를 찾을 수 없습니다.');
    }
    
  } catch (error) {
    console.error('일정 추가 실패:', error.message);
  }
}

addItineraryToPackage();

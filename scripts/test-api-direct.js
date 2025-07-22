// API 직접 테스트 스크립트
// 실행: node scripts/test-api-direct.js

const fetch = require('node-fetch');

// API 엔드포인트
const API_URL = 'http://localhost:3000/api/user'; // 로컬 개발 서버 URL로 변경하세요
const TEST_USER_ID = 'test-user-id-' + Date.now(); // 테스트용 고유 ID 생성

// API 테스트 함수
async function testUserApi() {
  console.log('API 직접 테스트 시작...');
  
  // 테스트 페이로드 생성
  const testPayload = {
    userId: TEST_USER_ID,
    userData: {
      email: `test-${Date.now()}@example.com`,
      name: 'API 테스트 사용자',
      phone: '01012345678',
      is_admin: false
    }
  };
  
  console.log('테스트 페이로드:', testPayload);
  
  try {
    // API 호출
    console.log(`API 요청 전송 중: ${API_URL}`);
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload),
    });
    
    console.log('응답 상태 코드:', response.status);
    console.log('응답 상태 텍스트:', response.statusText);
    
    // 응답 처리
    const responseData = await response.json();
    console.log('응답 데이터:', JSON.stringify(responseData, null, 2));
    
    if (response.ok) {
      console.log('API 테스트 성공!');
      return true;
    } else {
      console.error('API 오류:', responseData.error || '알 수 없는 오류');
      return false;
    }
  } catch (error) {
    console.error('API 테스트 예외 발생:', error);
    return false;
  }
}

// 테스트 실행
testUserApi()
  .then(success => {
    console.log('테스트 완료. 결과:', success ? '성공' : '실패');
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('테스트 중 예기치 않은 오류:', error);
    process.exit(1);
  });

// 회원가입 API 테스트 스크립트
require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch'); // 이 패키지가 없다면 npm install node-fetch 실행 필요

async function testUserAPI() {
  try {
    const userId = '5105bd79-feb2-437a-b812-736f2685b8ee'; // 테스트에서 생성된 실제 사용자 ID로 교체
    const userData = {
      email: 'test-api@example.com',
      name: 'API 테스트 사용자',
      phone: '01099998888',
      is_admin: false
    };

    console.log('API 호출 준비:', { userId, userData });
    
    const serverUrl = 'http://localhost:3000'; // 개발 서버 URL
    
    // API 엔드포인트 호출
    const response = await fetch(`${serverUrl}/api/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        userData
      }),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || '사용자 데이터 저장에 실패했습니다.');
    }
    
    console.log('API 호출 성공 응답:', result);
    return { success: true, result };
  } catch (error) {
    console.error('API 호출 오류:', error);
    return { success: false, error: error.message };
  }
}

console.log('로컬 서버가 실행 중인지 확인하세요!');
console.log('API 테스트를 시작합니다...');

// 이 스크립트를 실행하기 전에 'npm run dev'로 Next.js 서버를 실행해야 합니다.
testUserAPI()
  .then(result => {
    if (result.success) {
      console.log('API 테스트 성공!');
    } else {
      console.error('API 테스트 실패!');
    }
  });

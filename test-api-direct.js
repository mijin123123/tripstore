// API 직접 호출 테스트
require('dotenv').config();
const fetch = require('node-fetch');

async function testUserAPI() {
  const userId = '테스트-' + Date.now(); // 테스트용 임의 ID
  
  const userData = {
    email: `test-${Date.now()}@example.com`,
    name: '테스트 사용자',
    phone: '01012345678',
    is_admin: false
  };
  
  const apiUrl = 'http://localhost:3000/api/user'; // 로컬 API 주소
  
  console.log('API 호출 테스트 시작...');
  console.log('요청 데이터:', { userId, userData });
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        userData
      })
    });
    
    console.log('응답 상태:', response.status, response.statusText);
    
    const result = await response.json();
    console.log('응답 데이터:', result);
    
    if (!response.ok) {
      console.error('API 오류:', result);
    }
  } catch (error) {
    console.error('API 호출 오류:', error);
  }
}

testUserAPI();

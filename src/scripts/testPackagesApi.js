// API 엔드포인트 직접 테스트
import fetch from 'node-fetch';

async function testPackagesApi() {
  console.log('===== 패키지 API 테스트 스크립트 =====');
  
  try {
    console.log('패키지 API 호출 중...');
    const response = await fetch('http://localhost:3001/api/packages', {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'X-Test-Timestamp': new Date().toISOString()
      }
    });
    
    console.log(`API 응답 상태: ${response.status} ${response.statusText}`);
    
    // 응답 헤더 확인
    console.log('응답 헤더:');
    response.headers.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
    
    // 응답 본문
    const responseText = await response.text();
    console.log('응답 본문 (처음 200자):');
    console.log(responseText.substring(0, 200) + '...');
    
    // JSON 파싱 시도
    try {
      const data = JSON.parse(responseText);
      console.log(`응답에 ${Array.isArray(data) ? data.length : 0}개의 아이템이 있습니다.`);
      
      if (Array.isArray(data) && data.length > 0) {
        console.log('첫 번째 아이템:');
        console.log(JSON.stringify(data[0], null, 2).substring(0, 500) + '...');
      }
    } catch (parseError) {
      console.error('JSON 파싱 오류:', parseError);
    }
    
  } catch (error) {
    console.error('API 요청 오류:', error);
  }
}

// 스크립트 실행
testPackagesApi().catch(err => {
  console.error('스크립트 실행 오류:', err);
  process.exit(1);
});

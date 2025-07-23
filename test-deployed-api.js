// 배포된 사이트의 API 테스트
const https = require('https');

const apiUrl = 'tripstore.netlify.app';

console.log('=== 배포된 API 테스트 ===');

function testDeployedAPI() {
  return new Promise((resolve, reject) => {
    // GET 요청으로 현재 예약 데이터 조회
    const options = {
      hostname: apiUrl,
      port: 443,
      path: '/api/bookings',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      console.log('GET /api/bookings 상태 코드:', res.statusCode);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('✅ GET 요청 성공');
          console.log('응답 데이터:', JSON.stringify(result, null, 2));
          
          // 이제 POST 요청 테스트
          testPostRequest();
          
        } catch (error) {
          console.log('응답 파싱 오류:', error.message);
          console.log('원본 응답:', data);
        }
        resolve(data);
      });
    });

    req.on('error', (error) => {
      console.error('GET 요청 오류:', error.message);
      reject(error);
    });

    req.setTimeout(15000, () => {
      console.error('GET 요청 타임아웃');
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
}

function testPostRequest() {
  const testData = {
    packageId: 'test-package-terminal',
    startDate: '2025-08-01',
    quantity: 1,
    peopleCount: 1,
    travelerInfo: {
      name: '터미널 테스트',
      birthdate: '1990-01-01',
      gender: '남성',
      phone: '010-1234-5678',
      email: 'terminal-test@example.com'
    },
    specialRequests: '터미널에서 테스트한 예약',
    totalPrice: 100000,
    cost: 100000,
    userId: null
  };

  const postData = JSON.stringify(testData);

  const options = {
    hostname: apiUrl,
    port: 443,
    path: '/api/bookings',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  console.log('\n--- POST 요청 테스트 ---');
  console.log('전송 데이터:', JSON.stringify(testData, null, 2));

  const req = https.request(options, (res) => {
    console.log('POST /api/bookings 상태 코드:', res.statusCode);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        console.log('✅ POST 요청 성공');
        console.log('응답 데이터:', JSON.stringify(result, null, 2));
      } catch (error) {
        console.log('응답 파싱 오류:', error.message);
        console.log('원본 응답:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('POST 요청 오류:', error.message);
  });

  req.setTimeout(15000, () => {
    console.error('POST 요청 타임아웃');
    req.destroy();
  });

  req.write(postData);
  req.end();
}

async function runTest() {
  try {
    await testDeployedAPI();
  } catch (error) {
    console.error('테스트 실패:', error.message);
  }
}

runTest();

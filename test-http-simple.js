// 간단한 HTTP 요청으로 Supabase 연결 테스트
const https = require('https');

const supabaseUrl = 'https://ihhenvmzizaiokrfkatwt.supabase.co';

console.log('=== 네트워크 연결 테스트 ===');

// 1. 간단한 HTTP 요청
function testHttpRequest() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'ihhenvmzizaiokrfkatwt.supabase.co',
      port: 443,
      path: '/rest/v1/',
      method: 'GET',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloaG52bXppemFpb2tyZmthdHd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwODg1OTksImV4cCI6MjA2ODY2NDU5OX0.Mu9LgJQMK8HWJK5_3t6Ik5xHHMhxU6PFdgXGMNIUHEM'
      }
    };

    const req = https.request(options, (res) => {
      console.log('HTTP 상태 코드:', res.statusCode);
      console.log('응답 헤더:', JSON.stringify(res.headers, null, 2));
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('응답 데이터 길이:', data.length);
        resolve(data);
      });
    });

    req.on('error', (error) => {
      console.error('HTTP 요청 오류:', error.message);
      reject(error);
    });

    req.setTimeout(10000, () => {
      console.error('요청 타임아웃');
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
}

async function runTest() {
  try {
    console.log('Supabase 연결 테스트 시작...');
    await testHttpRequest();
    console.log('✅ 기본 연결 성공');
  } catch (error) {
    console.error('❌ 연결 실패:', error.message);
  }
}

runTest();

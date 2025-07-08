// 환경 변수를 먼저 로드하기 위해 dotenv 설정
import { config } from 'dotenv';
config();

import { packagesData } from '../data/packagesData';

// API를 통해 패키지 데이터를 가져오는 함수
async function importPackagesToAdmin(options = { force: false }) {
  console.log('메인 사이트의 패키지 데이터를 관리자 페이지에 등록하는 중...');
  console.log('옵션:', options);
  
  try {
    // 메인 사이트의 패키지 데이터 로그
    console.log(`메인 사이트에서 ${packagesData.length}개의 패키지 데이터 발견:`);
    console.log('첫 번째 패키지 예시:', {
      name: packagesData[0].name,
      destination: packagesData[0].destination,
      price: packagesData[0].price
    });
    
    // API 요청을 보내 메인 사이트 패키지 데이터 가져오기
    console.log('API 요청 준비 중...');
    console.log('요청 옵션:', {
      force: options.force,
      packagesCount: packagesData.length
    });
    
    const response = await fetch('/api/packages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'X-Import-Timestamp': new Date().toISOString() // 캐시 방지 타임스탬프
      },
      body: JSON.stringify({
        action: 'import_demo_data',
        packagesData: packagesData,
        force: options.force, // 강제 덮어쓰기 옵션
        source: 'main-site' // 소스 표시
      }),
      cache: 'no-store',
      next: { revalidate: 0 } // 캐시 방지
    });
    
    console.log(`API 응답 상태: ${response.status} ${response.statusText}`);
    
    // 응답 헤더 확인
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });
    console.log('응답 헤더:', responseHeaders);
    
    // 응답 텍스트 가져오기
    const rawText = await response.text();
    console.log('API 응답 원시 데이터:', rawText.substring(0, 200) + '...');
    
    let result;
    try {
      result = JSON.parse(rawText);
    } catch (parseError) {
      console.error('JSON 파싱 오류:', parseError);
      return { success: false, error: '응답을 파싱할 수 없습니다', rawResponse: rawText.substring(0, 500) };
    }
    
    console.log('파싱된 API 응답:', result);
    
    // 응답이 정상적이지 않은 경우
    if (!response.ok) {
      console.error('API 오류 응답:', result);
      return { 
        success: false, 
        error: result?.error || `API 응답 오류: ${response.status}`,
        details: result?.details || '추가 정보 없음'
      };
    }
    
    return {
      success: result.success || false,
      message: result.message,
      count: result.count,
      error: result.error,
      details: result.details
    };
    
  } catch (error) {
    console.error('패키지 데이터 가져오기 실패:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다'
    };
  }
}

export { importPackagesToAdmin };

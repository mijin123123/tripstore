import { packagesData } from '../data/packagesData';

// API를 통해 패키지 데이터를 가져오는 함수
async function importPackagesToAdmin() {
  console.log('메인 사이트의 패키지 데이터를 관리자 페이지에 등록하는 중...');
  
  try {
    console.log(`메인 사이트에서 ${packagesData.length}개의 패키지 데이터 발견`);
    
    // API 요청을 보내 데모 데이터 가져오기
    const response = await fetch('/api/packages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({
        action: 'import_demo_data',
        packagesData: packagesData,
      }),
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

// 패키지 데이터를 가져오는 유틸리티
// 클라이언트 컴포넌트에서 사용하므로 Node.js 전용 모듈(pg)을 사용하지 않음
// 'use client' 환경에서는 API를 통해 데이터를 가져옴

interface PackageResult {
  success: boolean;
  packages: any[];
  count?: number;
  error?: string;
  source?: string;
}

// 관리자 UI에서 사용할 수 있는 패키지 데이터 가져오기 함수
export async function fetchPackagesDirectly(): Promise<PackageResult> {
  console.log('패키지 데이터 가져오는 중...');

  try {
    console.log('API를 통해 패키지 데이터 가져오는 중...');
    // API 요청에 타임스탬프 추가하여 캐시를 방지
    const timestamp = new Date().getTime();
    const response = await fetch(`/api/packages?_=${timestamp}`, {
      method: 'GET',
      headers: { 
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API 오류: ${response.status} ${response.statusText}`);
    }
    
    // 응답 데이터를 텍스트로 가져온 후 JSON 파싱
    const rawText = await response.text();
    console.log('API 응답 원시 데이터 미리보기:', rawText.substring(0, 100) + '...');
    
    let data;
    try {
      data = JSON.parse(rawText);
    } catch (parseError) {
      console.error('JSON 파싱 오류:', parseError);
      throw new Error('API 응답을 JSON으로 파싱할 수 없습니다');
    }
    
    if (!Array.isArray(data)) {
      console.error('예상하지 않은 데이터 형식:', typeof data);
      throw new Error('API가 배열 형태의 패키지 데이터를 반환하지 않았습니다');
    }
    
    console.log(`API에서 ${data.length}개의 패키지 데이터를 가져왔습니다.`);
    
    // 패키지 데이터 샘플 로깅 (첫 번째 아이템)
    if (data.length > 0) {
      console.log('첫 번째 패키지 데이터 샘플:', {
        id: data[0].id,
        title: data[0].title,
        destination: data[0].destination
      });
    }
    
    return {
      success: true,
      packages: data,
      count: data.length,
      source: 'api'
    };
  } catch (error: any) {
    console.error('패키지 데이터 가져오기 오류:', error);
    return {
      success: false,
      error: error?.message || '알 수 없는 오류',
      packages: [],
      source: 'error'
    };
  }
}

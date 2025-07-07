import { packagesData } from '../data/packagesData';

// API를 통해 패키지 데이터를 가져오는 함수
async function importPackagesToAdmin() {
  console.log('메인 사이트의 패키지 데이터를 관리자 페이지에 등록하는 중...');
  
  try {
    // API 요청을 보내 데모 데이터 가져오기
    const response = await fetch('/api/packages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'import_demo_data',
        packagesData: packagesData,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API 응답 오류: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('API 응답:', result);
    
    if (result.success) {
      alert(`성공: ${result.message}`);
      // 성공 후 패키지 페이지 새로고침
      window.location.reload();
    } else {
      alert(`알림: ${result.message}`);
    }
    
  } catch (error) {
    console.error('패키지 데이터 가져오기 실패:', error);
    alert('패키지 데이터를 가져오는 중 오류가 발생했습니다.');
  }
}

export { importPackagesToAdmin };

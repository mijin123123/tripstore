import { packagesData } from '../data/packagesData';

async function directImportPackages() {
  try {
    console.log('API를 통한 패키지 데이터 직접 가져오기 시작...');
    
    // API 요청을 보내 데모 데이터 가져오기
    const response = await fetch('http://localhost:3000/api/packages', {
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
    
    console.log('패키지 데이터 가져오기 완료!');
    
  } catch (error) {
    console.error('패키지 데이터 가져오기 실패:', error);
  }
}

// 스크립트 실행
directImportPackages()
  .then(() => console.log('작업 완료'))
  .catch(error => console.error('치명적 오류:', error))
  .finally(() => process.exit());

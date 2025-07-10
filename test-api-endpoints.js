// API 테스트 스크립트 (Node.js 18+ 내장 fetch 사용)
async function testAPI() {
  try {
    console.log('=== API 엔드포인트 테스트 ===\n');
    
    console.log('로컬 서버 접근 테스트 중...');
    console.log('주의: 이 테스트는 npm run dev가 실행 중일 때만 작동합니다.\n');
    
    // 패키지 API 테스트
    console.log('1. /api/packages 테스트:');
    try {
      const packagesResponse = await fetch('http://localhost:3000/api/packages');
      const packagesData = await packagesResponse.json();
      
      if (packagesResponse.ok) {
        console.log(`✅ 패키지 API 성공 - ${packagesData.length}개 패키지 반환`);
        console.log('   첫 번째 패키지:', packagesData[0]?.title || '데이터 없음');
      } else {
        console.log('❌ 패키지 API 실패:', packagesData);
      }
    } catch (err) {
      console.log('❌ 패키지 API 연결 실패:', err.message);
    }
    
    // 헬스체크 API 테스트
    console.log('\n2. /api/health/db 테스트:');
    try {
      const healthResponse = await fetch('http://localhost:3000/api/health/db');
      const healthData = await healthResponse.json();
      
      if (healthResponse.ok) {
        console.log('✅ 헬스체크 성공:', healthData.status);
        console.log('   DB 상태:', healthData.database);
      } else {
        console.log('❌ 헬스체크 실패:', healthData);
      }
    } catch (err) {
      console.log('❌ 헬스체크 연결 실패:', err.message);
    }
    
    console.log('\n📝 참고: API 테스트가 실패하면 다음을 확인하세요:');
    console.log('   1. npm run dev 실행 여부');
    console.log('   2. localhost:3000 접근 가능 여부');
    console.log('   3. 방화벽 설정');
    
  } catch (error) {
    console.error('전체 테스트 실패:', error.message);
  }
}

testAPI();

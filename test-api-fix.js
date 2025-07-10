// 수정된 API 테스트
require('dotenv').config({ path: '.env.local' });

console.log('=== API 수정 후 환경변수 테스트 ===\n');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('환경변수 확인:');
console.log('SUPABASE_URL:', supabaseUrl ? '✅ 설정됨' : '❌ 설정되지 않음');
console.log('SUPABASE_KEY:', supabaseKey ? '✅ 설정됨' : '❌ 설정되지 않음');

if (supabaseUrl && supabaseKey) {
  console.log('\n✅ API가 Supabase로 연결을 시도할 수 있습니다.');
  console.log('URL:', supabaseUrl);
} else {
  console.log('\n❌ 환경변수가 누락되어 Mock 데이터를 사용할 것입니다.');
}

// Mock 데이터 테스트
console.log('\n=== Mock 데이터 확인 ===');
const mockPackages = require('./src/lib/mock-data.ts').mockPackages;
if (mockPackages && mockPackages.length > 0) {
  console.log(`✅ Mock 데이터 ${mockPackages.length}개 로드됨`);
  console.log('첫 번째 패키지:', mockPackages[0].title);
} else {
  console.log('❌ Mock 데이터 로드 실패');
}

console.log('\n🔧 수정사항:');
console.log('1. API 라우트에서 직접 Supabase 클라이언트 생성');
console.log('2. 모든 에러 상황에서 Mock 데이터로 fallback');
console.log('3. JSON 직렬화 문제 해결');

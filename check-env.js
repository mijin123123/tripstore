// 환경 변수를 확인하는 스크립트
import { config } from 'dotenv';
config();

console.log('=========================================');
console.log('환경 변수 확인');
console.log('=========================================');

// 중요 환경 변수 확인 (민감 정보 일부만 표시)
const environmentVariables = {
  NEON_DATABASE_URL: process.env.NEON_DATABASE_URL ? 
    `${process.env.NEON_DATABASE_URL.substring(0, 20)}...` : 
    '설정되지 않음',
  NODE_ENV: process.env.NODE_ENV || '설정되지 않음',
  // 기타 필요한 환경 변수들...
};

console.log('환경 변수 상태:');
Object.entries(environmentVariables).forEach(([key, value]) => {
  console.log(`- ${key}: ${value}`);
});

// dotenv 설정 확인
console.log('\ndotenv 로드 상태:');
try {
  const dotenvResult = config();
  console.log(`- 파일 로드: ${dotenvResult.parsed ? '성공' : '실패'}`);
  console.log(`- 경로: ${dotenvResult.path || '알 수 없음'}`);
  console.log(`- 로드된 변수 수: ${dotenvResult.parsed ? Object.keys(dotenvResult.parsed).length : 0}`);
} catch (error) {
  console.error('dotenv 로드 오류:', error);
}

// 작업 디렉토리 확인
console.log(`\n현재 작업 디렉토리: ${process.cwd()}`);
console.log('=========================================');

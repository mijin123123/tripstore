import fs from 'fs';

console.log('=== Mock 데이터 검증 ===');

// 파일을 텍스트로 읽어서 분석
const content = fs.readFileSync('./src/lib/mock-data.ts', 'utf8');

// 객체 개수 세기 (각 패키지는 { 로 시작)
const objectCount = (content.match(/{\s*"id":/g) || []).length;
console.log('총 패키지 수:', objectCount);

// 첫 번째 패키지 정보 추출
const firstPackageMatch = content.match(/"id":\s*(\d+),[\s\S]*?"title":\s*"([^"]+)",[\s\S]*?"category":\s*"([^"]+)"/);
if (firstPackageMatch) {
  console.log('첫 번째 패키지:', {
    id: parseInt(firstPackageMatch[1]),
    title: firstPackageMatch[2],
    category: firstPackageMatch[3]
  });
}

// 파일 크기 확인
const stats = fs.statSync('./src/lib/mock-data.ts');
console.log('파일 크기:', Math.round(stats.size / 1024), 'KB');
console.log('줄 수:', content.split('\n').length);

const fs = require('fs');
const path = require('path');

// 데모 패키지를 제거할 페이지 목록
const pages = [
  'src/app/overseas/saipan/page.tsx',
  'src/app/overseas/macau/page.tsx',
  'src/app/overseas/hongkong/page.tsx',
  'src/app/overseas/guam/page.tsx',
  'src/app/luxury/cruise/page.tsx'
];

function removeDemoPackages(filePath) {
  try {
    const fullPath = path.join(__dirname, filePath);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    console.log(`Processing: ${filePath}`);
    
    // const packages = [ ... ] 패턴을 찾아서 빈 배열로 교체
    content = content.replace(
      /const packages = \[\s*\{[\s\S]*?\}\s*\]/g,
      '// 데이터베이스에서 패키지를 가져오는 로직을 추가하거나 빈 배열로 초기화\n  const packages: any[] = [];'
    );
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Successfully updated: ${filePath}`);
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// 모든 페이지의 데모 패키지 제거
console.log('Starting demo package removal for remaining pages...\n');

pages.forEach(page => {
  removeDemoPackages(page);
});

console.log('\n✅ Demo package removal completed for all pages!');
